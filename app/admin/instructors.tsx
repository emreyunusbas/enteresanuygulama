import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Phone, Mail, Award, X } from 'lucide-react-native';

const instructors = [
  {
    id: 1,
    name: 'Ayşe Yılmaz',
    email: 'ayse@studio.com',
    phone: '0532 123 4567',
    specialties: ['Pilates', 'Yoga'],
    rating: 4.8,
    totalClasses: 245
  },
  {
    id: 2,
    name: 'Mehmet Demir',
    email: 'mehmet@studio.com',
    phone: '0533 987 6543',
    specialties: ['Yoga', 'Meditasyon'],
    rating: 4.6,
    totalClasses: 189
  }
];

export default function InstructorsScreen() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialties: ''
  });
  const [instructorsList, setInstructorsList] = useState(instructors);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.specialties) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    const newInstructor = {
      id: instructorsList.length + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialties: formData.specialties.split(',').map(s => s.trim()),
      rating: 0,
      totalClasses: 0
    };

    setInstructorsList([...instructorsList, newInstructor]);
    setShowForm(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialties: ''
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Eğitmenler</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>Yeni Eğitmen</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructorList}>
          {instructorsList.map((instructor) => (
            <View key={instructor.id} style={styles.instructorCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.instructorName}>{instructor.name}</Text>
                  <View style={styles.specialties}>
                    {instructor.specialties.map((specialty, index) => (
                      <View key={index} style={styles.specialtyBadge}>
                        <Text style={styles.specialtyText}>{specialty}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.ratingContainer}>
                  <Award size={16} color="#F59E0B" />
                  <Text style={styles.rating}>{instructor.rating}</Text>
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
              <Text style={styles.formTitle}>Yeni Eğitmen Ekle</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <X size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

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

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
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
    padding: 24,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  formBody: {
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