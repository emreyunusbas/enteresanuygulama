import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, User, Users, CheckCircle, XCircle, Plus, Trash, Calendar, X, Save, UserPlus, UserMinus, Home } from 'lucide-react-native';
import { UserContext } from '../context/UserContext';
import { useAttendance } from '../context/AttendanceContext';
import { useData } from '../context/DataContext';
import { useRouter } from 'expo-router';

export default function ClassesScreen() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { attendance, addAttendance, approveAttendance } = useAttendance();
  const { instructors, classes, students, addClass, updateClass, deleteClass } = useData();
  const router = useRouter();

  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showStudentAssignment, setShowStudentAssignment] = useState(null);
  const [classFormData, setClassFormData] = useState({
    name: '',
    time: '',
    date: '',
    capacity: '',
    price: ''
  });

  const handleGoHome = () => {
    setCurrentUser(null);
    router.replace('/');
  };

  const resetClassForm = () => {
    setClassFormData({
      name: '',
      time: '',
      date: '',
      capacity: '',
      price: ''
    });
    setEditingClass(null);
    setShowClassForm(false);
  };

  const handleClassSubmit = () => {
    if (!classFormData.name || !classFormData.time || !classFormData.date || !classFormData.capacity || !classFormData.price) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const classData = {
        name: classFormData.name,
        instructor: currentUser?.name || '',
        time: classFormData.time,
        date: classFormData.date,
        capacity: parseInt(classFormData.capacity) || 0,
        enrolled: editingClass?.enrolled || 0,
        price: parseInt(classFormData.price) || 0,
        studentsAssigned: editingClass?.studentsAssigned || []
      };

      if (editingClass) {
        updateClass(editingClass.id, classData);
        Alert.alert('Başarılı', 'Ders güncellendi!');
      } else {
        addClass(classData);
        Alert.alert('Başarılı', 'Yeni ders eklendi!');
      }

      resetClassForm();
    } catch (error) {
      Alert.alert('Hata', 'İşlem sırasında bir hata oluştu.');
    }
  };

  const handleEditClass = (cls) => {
    if (currentUser?.role === 'instructor' && cls.instructor !== currentUser.name) {
      Alert.alert('Hata', 'Sadece kendi derslerinizi düzenleyebilirsiniz.');
      return;
    }

    setEditingClass(cls);
    setClassFormData({
      name: cls.name,
      time: cls.time,
      date: cls.date,
      capacity: cls.capacity.toString(),
      price: cls.price.toString()
    });
    setShowClassForm(true);
  };

  const handleDeleteClass = (cls) => {
    if (currentUser?.role === 'instructor' && cls.instructor !== currentUser.name) {
      Alert.alert('Hata', 'Sadece kendi derslerinizi silebilirsiniz.');
      return;
    }

    Alert.alert(
      'Ders Sil',
      `${cls.name} dersini silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteClass(cls.id);
            Alert.alert('Başarılı', 'Ders silindi!');
          }
        }
      ]
    );
  };

  const handleAssignStudent = (classId, studentId) => {
    const classToUpdate = classes.find(c => c.id === classId);
    if (!classToUpdate) return;

    if (classToUpdate.studentsAssigned.includes(studentId)) {
      Alert.alert('Bilgi', 'Bu öğrenci zaten derse kayıtlı.');
      return;
    }

    if (classToUpdate.enrolled >= classToUpdate.capacity) {
      Alert.alert('Hata', 'Ders kapasitesi dolu.');
      return;
    }

    const updatedStudents = [...classToUpdate.studentsAssigned, studentId];
    updateClass(classId, {
      studentsAssigned: updatedStudents,
      enrolled: updatedStudents.length
    });

    Alert.alert('Başarılı', 'Öğrenci derse atandı!');
  };

  const handleRemoveStudent = (classId, studentId) => {
    const classToUpdate = classes.find(c => c.id === classId);
    if (!classToUpdate) return;

    const updatedStudents = classToUpdate.studentsAssigned.filter(id => id !== studentId);
    updateClass(classId, {
      studentsAssigned: updatedStudents,
      enrolled: updatedStudents.length
    });

    Alert.alert('Başarılı', 'Öğrenci dersten çıkarıldı!');
  };

  const handleAttendanceCheck = (classId: number, studentId: number) => {
    addAttendance({
      classId,
      studentId,
      studentCheckedIn: true,
      instructorApproved: false,
      timestamp: new Date().toISOString()
    });
  };

  const handleAttendanceApproval = (classId: number, studentId: number) => {
    approveAttendance(classId, studentId);
  };

  const renderAttendanceStatus = (classId: number, studentId: number) => {
    const studentAttendance = attendance.find(
      att => att.classId === classId && att.studentId === studentId
    );

    if (!studentAttendance) {
      return (
        <Text style={styles.attendanceStatus}>Katılım bekleniyor</Text>
      );
    }

    if (studentAttendance.instructorApproved) {
      return (
        <View style={styles.attendanceApproved}>
          <CheckCircle size={16} color="#059669" />
          <Text style={styles.attendanceApprovedText}>Onaylandı</Text>
        </View>
      );
    }

    if (studentAttendance.studentCheckedIn) {
      return (
        <View style={styles.attendancePending}>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleAttendanceApproval(classId, studentId)}
          >
            <Text style={styles.approveButtonText}>Onayla</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  // Filter classes based on user role
  const visibleClasses = classes.filter(cls => {
    if (!currentUser) return false;
    
    if (currentUser.role === 'admin') {
      return true;
    }

    if (currentUser.role === 'instructor') {
      return cls.instructor === currentUser.name;
    }

    // For students, show only classes they're not enrolled in and that have space
    if (currentUser.role === 'student') {
      const isNotEnrolled = !cls.studentsAssigned.includes(currentUser.id);
      const hasSpace = cls.enrolled < cls.capacity;
      return isNotEnrolled && hasSpace;
    }

    return false;
  });

  // Helper function to get student names for a class
  const getEnrolledStudents = (studentIds: number[]) => {
    return students.filter(user => studentIds.includes(user.id));
  };

  // Get available students for assignment (not already enrolled)
  const getAvailableStudents = (classId: number) => {
    const classData = classes.find(c => c.id === classId);
    if (!classData) return [];
    
    return students.filter(student => !classData.studentsAssigned.includes(student.id));
  };

  const canManageClass = (cls) => {
    return currentUser?.role === 'admin' || 
           (currentUser?.role === 'instructor' && cls.instructor === currentUser.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Ders Programı</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={handleGoHome}
            >
              <Home size={20} color="white" />
              <Text style={styles.homeButtonText}>Ana Sayfa</Text>
            </TouchableOpacity>
            {(currentUser?.role === 'admin' || currentUser?.role === 'instructor') && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowClassForm(true)}
              >
                <Plus size={20} color="white" />
                <Text style={styles.addButtonText}>Yeni Ders</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {currentUser?.role === 'student' && (
          <Text style={styles.subtitle}>Katılabileceğiniz dersler</Text>
        )}
        {currentUser?.role === 'instructor' && (
          <Text style={styles.subtitle}>Verdiğiniz dersler</Text>
        )}
        {currentUser?.role === 'admin' && (
          <Text style={styles.subtitle}>Tüm dersler ve kayıtlı öğrenciler</Text>
        )}

        {visibleClasses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {currentUser?.role === 'student' 
                ? 'Şu anda katılabileceğiniz uygun ders bulunmuyor.'
                : currentUser?.role === 'instructor'
                ? 'Henüz ders eklememişsiniz. Yeni ders eklemek için + butonunu kullanın.'
                : 'Henüz ders bulunmuyor.'}
            </Text>
          </View>
        ) : (
          <View style={styles.classList}>
            {visibleClasses.map(cls => (
              <View key={cls.id} style={styles.classCard}>
                <View style={styles.classHeader}>
                  <Text style={styles.className}>{cls.name}</Text>
                  <View style={styles.classHeaderActions}>
                    <View style={styles.priceBadge}>
                      <Text style={styles.priceText}>₺{cls.price}</Text>
                    </View>
                    {canManageClass(cls) && (
                      <View style={styles.classActions}>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleEditClass(cls)}
                        >
                          <Text style={styles.editButtonText}>Düzenle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteClass(cls)}
                        >
                          <Trash size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.classDetails}>
                  <View style={styles.detailRow}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{cls.time}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Calendar size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{cls.date}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <User size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{cls.instructor}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Users size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{cls.enrolled}/{cls.capacity} kişi</Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${(cls.enrolled / cls.capacity) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    Doluluk: {Math.round((cls.enrolled / cls.capacity) * 100)}%
                  </Text>
                </View>

                {canManageClass(cls) && (
                  <>
                    <View style={styles.studentManagement}>
                      <View style={styles.studentManagementHeader}>
                        <Text style={styles.enrolledStudentsTitle}>Kayıtlı Öğrenciler:</Text>
                        <TouchableOpacity
                          style={styles.manageStudentsButton}
                          onPress={() => setShowStudentAssignment(cls.id)}
                        >
                          <UserPlus size={16} color="#3B82F6" />
                          <Text style={styles.manageStudentsText}>Öğrenci Yönet</Text>
                        </TouchableOpacity>
                      </View>
                      
                      {getEnrolledStudents(cls.studentsAssigned).map((student) => (
                        <View key={student.id} style={styles.studentRow}>
                          <View style={styles.studentInfo}>
                            <Text style={styles.studentName}>{student.name}</Text>
                            <Text style={styles.studentContact}>{student.phone}</Text>
                          </View>
                          <View style={styles.studentActions}>
                            {renderAttendanceStatus(cls.id, student.id)}
                            <TouchableOpacity
                              style={styles.removeStudentButton}
                              onPress={() => handleRemoveStudent(cls.id, student.id)}
                            >
                              <UserMinus size={16} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {currentUser?.role === 'student' && (
                  <TouchableOpacity
                    style={styles.checkInButton}
                    onPress={() => handleAttendanceCheck(cls.id, currentUser.id)}
                  >
                    <Text style={styles.checkInButtonText}>Derse Katıldım</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Class Form Modal */}
      {showClassForm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingClass ? 'Ders Düzenle' : 'Yeni Ders Ekle'}
              </Text>
              <TouchableOpacity onPress={resetClassForm}>
                <X size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.modalBody}>
                <View style={styles.formField}>
                  <Text style={styles.label}>Ders Adı</Text>
                  <TextInput
                    style={styles.input}
                    value={classFormData.name}
                    onChangeText={(text) => setClassFormData({ ...classFormData, name: text })}
                    placeholder="Ders adı giriniz"
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.label}>Tarih</Text>
                  <TextInput
                    style={styles.input}
                    value={classFormData.date}
                    onChangeText={(text) => setClassFormData({ ...classFormData, date: text })}
                    placeholder="YYYY-MM-DD"
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.label}>Saat</Text>
                  <TextInput
                    style={styles.input}
                    value={classFormData.time}
                    onChangeText={(text) => setClassFormData({ ...classFormData, time: text })}
                    placeholder="09:00"
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.label}>Kapasite</Text>
                  <TextInput
                    style={styles.input}
                    value={classFormData.capacity}
                    onChangeText={(text) => setClassFormData({ ...classFormData, capacity: text })}
                    placeholder="Kapasite giriniz"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.label}>Ücret</Text>
                  <TextInput
                    style={styles.input}
                    value={classFormData.price}
                    onChangeText={(text) => setClassFormData({ ...classFormData, price: text })}
                    placeholder="Ücret giriniz"
                    keyboardType="numeric"
                  />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleClassSubmit}>
                  <Save size={20} color="white" />
                  <Text style={styles.submitButtonText}>
                    {editingClass ? 'Güncelle' : 'Kaydet'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Student Assignment Modal */}
      {showStudentAssignment && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Öğrenci Atama</Text>
              <TouchableOpacity onPress={() => setShowStudentAssignment(null)}>
                <X size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.modalBody}>
                <Text style={styles.sectionTitle}>Mevcut Öğrenciler</Text>
                {getAvailableStudents(showStudentAssignment).map((student) => (
                  <View key={student.id} style={styles.availableStudentRow}>
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName}>{student.name}</Text>
                      <Text style={styles.studentContact}>{student.phone}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.assignButton}
                      onPress={() => handleAssignStudent(showStudentAssignment, student.id)}
                    >
                      <UserPlus size={16} color="white" />
                      <Text style={styles.assignButtonText}>Ata</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                
                {getAvailableStudents(showStudentAssignment).length === 0 && (
                  <Text style={styles.noStudentsText}>
                    Atanabilecek öğrenci bulunmuyor.
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  classList: {
    padding: 16,
  },
  classCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    }),
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  classHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: '500',
  },
  classActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    padding: 6,
    borderRadius: 6,
  },
  classDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  studentManagement: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  studentManagementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  enrolledStudentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  manageStudentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  manageStudentsText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '500',
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    color: '#374151',
  },
  studentContact: {
    fontSize: 14,
    color: '#6B7280',
  },
  studentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeStudentButton: {
    backgroundColor: '#FEF2F2',
    padding: 6,
    borderRadius: 6,
  },
  attendanceStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  attendanceApproved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendanceApprovedText: {
    fontSize: 14,
    color: '#059669',
  },
  attendancePending: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  approveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  checkInButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  checkInButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalBody: {
    padding: 24,
    gap: 16,
  },
  formField: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  availableStudentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  assignButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  noStudentsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});