import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Phone, Mail, Calendar, CheckCircle, X } from 'lucide-react-native';

const students = [
  {
    id: 1,
    name: 'Zeynep Kaya',
    email: 'zeynep@email.com',
    phone: '0534 555 1234',
    startDate: '2025-01-15',
    totalClasses: 48,
    attendedClasses: 45,
    activePackage: 'Aylık Sınırsız'
  },
  {
    id: 2,
    name: 'Ali Özkan',
    email: 'ali@email.com',
    phone: '0535 444 5678',
    startDate: '2025-02-01',
    totalClasses: 24,
    attendedClasses: 20,
    activePackage: '10 Ders Paketi'
  }
];

export default function StudentsScreen() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    package: ''
  });

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    setShowForm(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      package: ''
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Öğrenciler</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>Yeni Öğrenci</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.studentList}>
          {students.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <View style={styles.packageBadge}>
                    <Text style={styles.packageText}>{student.activePackage}</Text>
                  </View>
                </View>
                <View style={styles.attendanceContainer}>
                  <CheckCircle size={16} color="#059669" />
                  <Text style={styles.attendanceText}>
                    {student.attendedClasses}/{student.totalClasses} Ders
                  </Text>
                </View>
              </View>

              <View style={styles.contactInfo}>
                <View style={styles.contactItem}>
                  <Phone size={16} color="#6B7280" />
                  <Text style={styles.contactText}>{student.phone}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Mail size={16} color="#6B7280" />
                  <Text style={styles.contactText}>{student.email}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.contactText}>
                    Başlangıç: {formatDate(student.startDate)}
                  </Text>
                </View>
              </View>

              <View style={styles.statsContainer}>
                <Text style={styles.statsText}>
                  Katılım Oranı: %{((student.attendedClasses / student.totalClasses) * 100).toFixed(0)}
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
              <Text style={styles.formTitle}>Yeni Öğrenci Ekle</Text>
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
                <Text style={styles.label}>Paket Seçimi</Text>
                <TextInput
                  style={styles.input}
                  value={formData.package}
                  onChangeText={(text) => setFormData({ ...formData, package: text })}
                  placeholder="Paket seçiniz"
                />
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
  studentList: {
    padding: 16,
    gap: 16,
  },
  studentCard: {
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
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  packageBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  packageText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '500',
  },
  attendanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendanceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
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