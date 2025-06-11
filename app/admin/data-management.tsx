import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, X, Edit, Trash, Users, BookOpen, Calendar, Save } from 'lucide-react-native';
import { useData, Student, Instructor, Class } from '../context/DataContext';

type TabType = 'students' | 'instructors' | 'classes';

export default function DataManagementScreen() {
  const { 
    students, 
    instructors, 
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    addClass,
    updateClass,
    deleteClass
  } = useData();

  const [activeTab, setActiveTab] = useState<TabType>('students');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    try {
      if (activeTab === 'students') {
        if (editingItem) {
          updateStudent(editingItem.id, formData);
        } else {
          const newStudent: Omit<Student, 'id'> = {
            name: formData.name || '',
            email: formData.email || '',
            phone: formData.phone || '',
            startDate: formData.startDate || new Date().toISOString().split('T')[0],
            totalClasses: parseInt(formData.totalClasses) || 0,
            attendedClasses: parseInt(formData.attendedClasses) || 0,
            activePackage: formData.activePackage || '',
            classHistory: [],
            payments: [],
            classOccupancy: [
              { name: 'Temel Pilates', rate: 80 },
              { name: 'İleri Pilates', rate: 75 },
              { name: 'Yoga', rate: 85 }
            ]
          };
          addStudent(newStudent);
        }
      } else if (activeTab === 'instructors') {
        if (editingItem) {
          updateInstructor(editingItem.id, {
            ...formData,
            specialties: formData.specialties ? formData.specialties.split(',').map((s: string) => s.trim()) : []
          });
        } else {
          const newInstructor: Omit<Instructor, 'id'> = {
            name: formData.name || '',
            email: formData.email || '',
            phone: formData.phone || '',
            specialties: formData.specialties ? formData.specialties.split(',').map((s: string) => s.trim()) : [],
            rating: parseFloat(formData.rating) || 0,
            totalClasses: parseInt(formData.totalClasses) || 0,
            metrics: {
              weekly: {
                classes: 0,
                attendance: 0,
                revenue: 0,
                studentSatisfaction: 0
              },
              monthly: {
                classes: 0,
                attendance: 0,
                revenue: 0,
                studentSatisfaction: 0
              }
            },
            students: []
          };
          addInstructor(newInstructor);
        }
      } else if (activeTab === 'classes') {
        if (editingItem) {
          updateClass(editingItem.id, {
            ...formData,
            capacity: parseInt(formData.capacity) || 0,
            enrolled: parseInt(formData.enrolled) || 0,
            price: parseInt(formData.price) || 0
          });
        } else {
          const newClass: Omit<Class, 'id'> = {
            name: formData.name || '',
            instructor: formData.instructor || '',
            time: formData.time || '',
            date: formData.date || new Date().toISOString().split('T')[0],
            capacity: parseInt(formData.capacity) || 0,
            enrolled: parseInt(formData.enrolled) || 0,
            price: parseInt(formData.price) || 0,
            studentsAssigned: []
          };
          addClass(newClass);
        }
      }
      resetForm();
      Alert.alert('Başarılı', 'Kayıt başarıyla güncellendi!');
    } catch (error) {
      Alert.alert('Hata', 'Kayıt sırasında bir hata oluştu.');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'instructors') {
      setFormData({
        ...item,
        specialties: item.specialties.join(', ')
      });
    } else {
      setFormData(item);
    }
    setShowForm(true);
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert(
      'Silme Onayı',
      `${name} kaydını silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            if (activeTab === 'students') {
              deleteStudent(id);
            } else if (activeTab === 'instructors') {
              deleteInstructor(id);
            } else if (activeTab === 'classes') {
              deleteClass(id);
            }
            Alert.alert('Başarılı', 'Kayıt silindi!');
          }
        }
      ]
    );
  };

  const renderStudentForm = () => (
    <View style={styles.formBody}>
      <View style={styles.formField}>
        <Text style={styles.label}>Ad Soyad</Text>
        <TextInput
          style={styles.input}
          value={formData.name || ''}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Ad Soyad giriniz"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>E-posta</Text>
        <TextInput
          style={styles.input}
          value={formData.email || ''}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="E-posta giriniz"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Telefon</Text>
        <TextInput
          style={styles.input}
          value={formData.phone || ''}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Telefon giriniz"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Başlangıç Tarihi</Text>
        <TextInput
          style={styles.input}
          value={formData.startDate || ''}
          onChangeText={(text) => setFormData({ ...formData, startDate: text })}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Toplam Ders Sayısı</Text>
        <TextInput
          style={styles.input}
          value={formData.totalClasses?.toString() || ''}
          onChangeText={(text) => setFormData({ ...formData, totalClasses: text })}
          placeholder="Toplam ders sayısı"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Katıldığı Ders Sayısı</Text>
        <TextInput
          style={styles.input}
          value={formData.attendedClasses?.toString() || ''}
          onChangeText={(text) => setFormData({ ...formData, attendedClasses: text })}
          placeholder="Katıldığı ders sayısı"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Aktif Paket</Text>
        <TextInput
          style={styles.input}
          value={formData.activePackage || ''}
          onChangeText={(text) => setFormData({ ...formData, activePackage: text })}
          placeholder="Aktif paket"
        />
      </View>
    </View>
  );

  const renderInstructorForm = () => (
    <View style={styles.formBody}>
      <View style={styles.formField}>
        <Text style={styles.label}>Ad Soyad</Text>
        <TextInput
          style={styles.input}
          value={formData.name || ''}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Ad Soyad giriniz"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>E-posta</Text>
        <TextInput
          style={styles.input}
          value={formData.email || ''}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="E-posta giriniz"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Telefon</Text>
        <TextInput
          style={styles.input}
          value={formData.phone || ''}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Telefon giriniz"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Uzmanlık Alanları</Text>
        <TextInput
          style={styles.input}
          value={formData.specialties || ''}
          onChangeText={(text) => setFormData({ ...formData, specialties: text })}
          placeholder="Pilates, Yoga, Meditasyon"
        />
        <Text style={styles.helperText}>Virgülle ayırarak giriniz</Text>
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Değerlendirme</Text>
        <TextInput
          style={styles.input}
          value={formData.rating?.toString() || ''}
          onChangeText={(text) => setFormData({ ...formData, rating: text })}
          placeholder="4.8"
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Toplam Ders Sayısı</Text>
        <TextInput
          style={styles.input}
          value={formData.totalClasses?.toString() || ''}
          onChangeText={(text) => setFormData({ ...formData, totalClasses: text })}
          placeholder="Toplam ders sayısı"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderClassForm = () => (
    <View style={styles.formBody}>
      <View style={styles.formField}>
        <Text style={styles.label}>Ders Adı</Text>
        <TextInput
          style={styles.input}
          value={formData.name || ''}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Ders adı giriniz"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Eğitmen</Text>
        <TextInput
          style={styles.input}
          value={formData.instructor || ''}
          onChangeText={(text) => setFormData({ ...formData, instructor: text })}
          placeholder="Eğitmen adı"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Saat</Text>
        <TextInput
          style={styles.input}
          value={formData.time || ''}
          onChangeText={(text) => setFormData({ ...formData, time: text })}
          placeholder="09:00"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Tarih</Text>
        <TextInput
          style={styles.input}
          value={formData.date || ''}
          onChangeText={(text) => setFormData({ ...formData, date: text })}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Kapasite</Text>
        <TextInput
          style={styles.input}
          value={formData.capacity?.toString() || ''}
          onChangeText={(text) => setFormData({ ...formData, capacity: text })}
          placeholder="Kapasite"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Kayıtlı Öğrenci Sayısı</Text>
        <TextInput
          style={styles.input}
          value={formData.enrolled?.toString() || ''}
          onChangeText={(text) => setFormData({ ...formData, enrolled: text })}
          placeholder="Kayıtlı öğrenci sayısı"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Ücret</Text>
        <TextInput
          style={styles.input}
          value={formData.price?.toString() || ''}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
          placeholder="Ücret"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderStudentList = () => (
    <View style={styles.listContainer}>
      {students.map((student) => (
        <View key={student.id} style={styles.listItem}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{student.name}</Text>
            <Text style={styles.itemDetail}>{student.email}</Text>
            <Text style={styles.itemDetail}>{student.phone}</Text>
            <Text style={styles.itemDetail}>Paket: {student.activePackage}</Text>
          </View>
          <View style={styles.itemActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(student)}
            >
              <Edit size={16} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(student.id, student.name)}
            >
              <Trash size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderInstructorList = () => (
    <View style={styles.listContainer}>
      {instructors.map((instructor) => (
        <View key={instructor.id} style={styles.listItem}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{instructor.name}</Text>
            <Text style={styles.itemDetail}>{instructor.email}</Text>
            <Text style={styles.itemDetail}>{instructor.phone}</Text>
            <Text style={styles.itemDetail}>
              Uzmanlık: {instructor.specialties.join(', ')}
            </Text>
            <Text style={styles.itemDetail}>
              Değerlendirme: {instructor.rating}/5
            </Text>
          </View>
          <View style={styles.itemActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(instructor)}
            >
              <Edit size={16} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(instructor.id, instructor.name)}
            >
              <Trash size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderClassList = () => (
    <View style={styles.listContainer}>
      {classes.map((cls) => (
        <View key={cls.id} style={styles.listItem}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{cls.name}</Text>
            <Text style={styles.itemDetail}>Eğitmen: {cls.instructor}</Text>
            <Text style={styles.itemDetail}>Tarih: {cls.date} - {cls.time}</Text>
            <Text style={styles.itemDetail}>
              Kapasite: {cls.enrolled}/{cls.capacity}
            </Text>
            <Text style={styles.itemDetail}>Ücret: ₺{cls.price}</Text>
          </View>
          <View style={styles.itemActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(cls)}
            >
              <Edit size={16} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(cls.id, cls.name)}
            >
              <Trash size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Veri Yönetimi</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Plus size={20} color="white" />
          <Text style={styles.addButtonText}>Yeni Ekle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'students' && styles.activeTab]}
          onPress={() => setActiveTab('students')}
        >
          <Users size={20} color={activeTab === 'students' ? '#3B82F6' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'students' && styles.activeTabText]}>
            Öğrenciler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'instructors' && styles.activeTab]}
          onPress={() => setActiveTab('instructors')}
        >
          <BookOpen size={20} color={activeTab === 'instructors' ? '#3B82F6' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'instructors' && styles.activeTabText]}>
            Eğitmenler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'classes' && styles.activeTab]}
          onPress={() => setActiveTab('classes')}
        >
          <Calendar size={20} color={activeTab === 'classes' ? '#3B82F6' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'classes' && styles.activeTabText]}>
            Dersler
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'students' && renderStudentList()}
        {activeTab === 'instructors' && renderInstructorList()}
        {activeTab === 'classes' && renderClassList()}
      </ScrollView>

      {showForm && (
        <View style={styles.formOverlay}>
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingItem ? 'Düzenle' : 'Yeni Ekle'} - {
                  activeTab === 'students' ? 'Öğrenci' :
                  activeTab === 'instructors' ? 'Eğitmen' : 'Ders'
                }
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <X size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScrollView}>
              {activeTab === 'students' && renderStudentForm()}
              {activeTab === 'instructors' && renderInstructorForm()}
              {activeTab === 'classes' && renderClassForm()}

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Save size={20} color="white" />
                <Text style={styles.submitButtonText}>Kaydet</Text>
              </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  formOverlay: {
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
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  formScrollView: {
    maxHeight: 400,
  },
  formBody: {
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
  helperText: {
    fontSize: 12,
    color: '#6B7280',
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
});