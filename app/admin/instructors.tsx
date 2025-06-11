import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Phone, Mail, Award, X, FileEdit as Edit, Trash, Home } from 'lucide-react-native';
import { useData } from '../context/DataContext';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function InstructorsScreen() {
  const { instructors, addInstructor, updateInstructor, deleteInstructor } = useData();
  const router = useRouter();
  const { setCurrentUser } = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialties: '',
    rating: ''
  });

  const handleGoHome = () => {
    setCurrentUser(null);
    router.replace('/');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialties: '',
      rating: ''
    });
    setEditingInstructor(null);
    setShowForm(false);
  };

  const handleEdit = (instructor) => {
    setEditingInstructor(instructor);
    setFormData({
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone,
      specialties: instructor.specialties.join(', '),
      rating: instructor.rating.toString()
    });
    setShowForm(true);
  };

  const handleDelete = (instructor) => {
    Alert.alert(
      'Eğitmen Sil',
      `${instructor.name} eğitmenini silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteInstructor(instructor.id);
            Alert.alert('Başarılı', 'Eğitmen silindi!');
          }
        }
      ]
    );
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.specialties) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const instructorData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialties: formData.specialties.split(',').map(s => s.trim()),
        rating: parseFloat(formData.rating) || 0,
        totalClasses: editingInstructor?.totalClasses || 0,
        metrics: editingInstructor?.metrics || {
          weekly: { classes: 0, attendance: 0, revenue: 0, studentSatisfaction: 0 },
          monthly: { classes: 0, attendance: 0, revenue: 0, studentSatisfaction: 0 }
        },
        students: editingInstructor?.students || []
      };

      if (editingInstructor) {
        updateInstructor(editingInstructor.id, instructorData);
        Alert.alert('Başarılı', 'Eğitmen güncellendi!');
      } else {
        addInstructor(instructorData);
        Alert.alert('Başarılı', 'Yeni eğitmen eklendi!');
      }

      resetForm();
    } catch (error) {
      Alert.alert('Hata', 'İşlem sırasında bir hata oluştu.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Eğitmenler</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={handleGoHome}
            >
              <Home size={20} color="white" />
              <Text style={styles.homeButtonText}>Ana Sayfa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowForm(true)}
            >
              <Plus size={20} color="white" />
              <Text style={styles.addButtonText}>Yeni Eğitmen</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.instructorList}>
          {instructors.map((instructor) => (
            <View key={instructor.id} style={styles.instructorCard}>
              <View style={styles.cardHeader}>
                <View style={styles.instructorInfo}>
                  <Text style={styles.instructorName}>{instructor.name}</Text>
                  <View style={styles.specialties}>
                    {instructor.specialties.map((specialty, index) => (
                      <View key={index} style={styles.specialtyBadge}>
                        <Text style={styles.specialtyText}>{specialty}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.cardActions}>
                  <View style={styles.ratingContainer}>
                    <Award size={16} color="#F59E0B" />
                    <Text style={styles.rating}>{instructor.rating}</Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEdit(instructor)}
                    >
                      <Edit size={16} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(instructor)}
                    >
                      <Trash size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.contactInfo}>
                <View style={styles.contactItem}>
                  <Phone size={16} color="#6B7280" />
                  <Text style={styles.contactText}>{instructor.phone}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Mail size={16} color="#6B7280" />
                  <Text style={styles.contactText}>{instructor.email}</Text>
                </View>
              </View>

              <View style={styles.statsContainer}>
                <Text style={styles.statsText}>
                  Toplam {instructor.totalClasses} ders verdi
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {showForm && (
        <View style={styles.formOverlay}>
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingInstructor ? 'Eğitmen Düzenle' : 'Yeni Eğitmen Ekle'}
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <X size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScrollView}>
              <View style={styles.formBody}>
                <View style={styles.formField}>
                  <Text style={styles.label}>Ad Soyad</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Ad Soyad giriniz"
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.label}>E-posta</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
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
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    placeholder="Telefon giriniz"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.label}>Uzmanlık Alanları</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.specialties}
                    onChangeText={(text) => setFormData({ ...formData, specialties: text })}
                    placeholder="Uzmanlık alanlarını virgülle ayırarak giriniz"
                  />
                  <Text style={styles.helperText}>Örnek: Pilates, Yoga, Meditasyon</Text>
                </View>

                <View style={styles.formField}>
                  <Text style={styles.label}>Değerlendirme</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.rating}
                    onChangeText={(text) => setFormData({ ...formData, rating: text })}
                    placeholder="4.8"
                    keyboardType="decimal-pad"
                  />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>
                    {editingInstructor ? 'Güncelle' : 'Kaydet'}
                  </Text>
                </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerRight: {
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
  instructorList: {
    padding: 16,
    gap: 16,
  },
  instructorCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '500',
  },
  cardActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
  },
  actionButtons: {
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
  contactInfo: {
    gap: 8,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  statsText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
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
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});