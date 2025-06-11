import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, User, Users, CheckCircle, XCircle, Plus, Trash } from 'lucide-react-native';
import { UserContext } from '../context/UserContext';
import { useAttendance } from '../context/AttendanceContext';
import { useData } from '../context/DataContext';

export default function ClassesScreen() {
  const { currentUser } = useContext(UserContext);
  const { attendance, addAttendance, approveAttendance } = useAttendance();
  const { instructors, classes, students } = useData();

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

  const handleAddInstructor = () => {
    Alert.alert('Yeni Eğitmen Ekle', 'Bu özellik Admin Paneli > Veri Yönetimi bölümünden kullanılabilir');
  };

  const handleRemoveInstructor = (instructorId: number) => {
    Alert.alert(
      'Eğitmen Sil',
      'Bu eğitmeni silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Bilgi', 'Bu özellik Admin Paneli > Veri Yönetimi bölümünden kullanılabilir');
          }
        }
      ]
    );
  };

  const renderInstructorManagement = () => {
    if (currentUser?.role !== 'admin') return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Eğitmen Yönetimi</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddInstructor}
          >
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>Yeni Eğitmen</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructorList}>
          {instructors.map(instructor => (
            <View key={instructor.id} style={styles.instructorCard}>
              <View style={styles.instructorInfo}>
                <Text style={styles.instructorName}>{instructor.name}</Text>
                <Text style={styles.instructorContact}>{instructor.phone}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveInstructor(instructor.id)}
              >
                <Trash size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
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

  // Filter classes based on user role and availability
  const visibleClasses = classes.filter(cls => {
    if (!currentUser) return false;
    
    if (currentUser.role === 'admin' || currentUser.role === 'instructor') {
      return true;
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderInstructorManagement()}
        
        <View style={styles.header}>
          <Text style={styles.title}>Ders Programı</Text>
          {currentUser?.role === 'student' && (
            <Text style={styles.subtitle}>Katılabileceğiniz dersler</Text>
          )}
          {currentUser?.role === 'admin' && (
            <Text style={styles.subtitle}>Tüm dersler ve kayıtlı öğrenciler</Text>
          )}
        </View>

        {visibleClasses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {currentUser?.role === 'student' 
                ? 'Şu anda katılabileceğiniz uygun ders bulunmuyor.'
                : 'Henüz ders bulunmuyor.'}
            </Text>
          </View>
        ) : (
          <View style={styles.classList}>
            {visibleClasses.map(cls => (
              <View key={cls.id} style={styles.classCard}>
                <View style={styles.classHeader}>
                  <Text style={styles.className}>{cls.name}</Text>
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>₺{cls.price}</Text>
                  </View>
                </View>

                <View style={styles.classDetails}>
                  <View style={styles.detailRow}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{cls.time}</Text>
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

                {(currentUser?.role === 'admin' || currentUser?.role === 'instructor') && (
                  <View style={styles.enrolledStudents}>
                    <Text style={styles.enrolledStudentsTitle}>Kayıtlı Öğrenciler:</Text>
                    {getEnrolledStudents(cls.studentsAssigned).map((student) => (
                      <View key={student.id} style={styles.studentRow}>
                        <View style={styles.studentInfo}>
                          <Text style={styles.studentName}>{student.name}</Text>
                          <Text style={styles.studentContact}>{student.phone}</Text>
                        </View>
                        {renderAttendanceStatus(cls.id, student.id)}
                      </View>
                    ))}
                  </View>
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
    padding: 16,
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
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: '500',
  },
  instructorList: {
    gap: 12,
  },
  instructorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  instructorContact: {
    fontSize: 14,
    color: '#6B7280',
  },
  removeButton: {
    padding: 8,
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
  enrolledStudents: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  enrolledStudentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
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
});