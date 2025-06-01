import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users, Clock, Calendar, User, X } from 'lucide-react-native';

const classes = [
  {
    id: 1,
    name: 'Pilates Temel',
    instructor: 'Ayşe Yılmaz',
    time: '09:00',
    date: '2025-05-26',
    capacity: 5,
    enrolled: 4,
    price: 150
  },
  {
    id: 2,
    name: 'Yoga Flow',
    instructor: 'Mehmet Demir',
    time: '10:30',
    date: '2025-05-26',
    capacity: 5,
    enrolled: 5,
    price: 120
  }
];

export default function ClassesScreen() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    time: '',
    date: '',
    capacity: '',
    price: ''
  });

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    setShowForm(false);
    setFormData({
      name: '',
      instructor: '',
      time: '',
      date: '',
      capacity: '',
      price: ''
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
          <Text style={styles.title}>Dersler</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Plus size={20} color="white" />
            <Text style={styles.addButtonText}>Yeni Ders</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.classList}>
          {classes.map((cls) => (
            <View key={cls.id} style={styles.classCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.className}>{cls.name}</Text>
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>₺{cls.price}</Text>
                </View>
              </View>

              <View style={styles.classDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{formatDate(cls.date)}</Text>
                </View>

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
                  Doluluk: %{Math.round((cls.enrolled / cls.capacity) * 100)}
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
              <Text style={styles.formTitle}>Yeni Ders Ekle</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <X size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <View style={styles.formBody}>
              <View style={styles.formField}>
                <Text style={styles.label}>Ders Adı</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Ders adı giriniz"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>Eğitmen</Text>
                <TextInput
                  style={styles.input}
                  value={formData.instructor}
                  onChangeText={(text) => setFormData({ ...formData, instructor: text })}
                  placeholder="Eğitmen seçiniz"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>Tarih</Text>
                <TextInput
                  style={styles.input}
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                  placeholder="Tarih seçiniz"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>Saat</Text>
                <TextInput
                  style={styles.input}
                  value={formData.time}
                  onChangeText={(text) => setFormData({ ...formData, time: text })}
                  placeholder="Saat seçiniz"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>Kapasite</Text>
                <TextInput
                  style={styles.input}
                  value={formData.capacity}
                  onChangeText={(text) => setFormData({ ...formData, capacity: text })}
                  placeholder="Kapasite giriniz"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>Ücret</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(text) => setFormData({ ...formData, price: text })}
                  placeholder="Ücret giriniz"
                  keyboardType="numeric"
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
  classList: {
    padding: 16,
    gap: 16,
  },
  classCard: {
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
    alignItems: 'center',
    marginBottom: 16,
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
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
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