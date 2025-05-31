import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Calendar, Award, CreditCard, Plus, X, Check } from 'lucide-react-native';
import { UserContext } from '../context/UserContext';

type FormData = {
  name: string;
  email: string;
  phone: string;
  role: 'instructor' | 'student';
};

type ClassFormData = {
  name: string;
  instructor: string;
  time: string;
  date: string;
  capacity: string;
  price: string;
};

export default function AdminPanel() {
  const { currentUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('users');
  const [showForm, setShowForm] = useState(false);
  const [showClassForm, setShowClassForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    role: 'student',
  });
  const [classFormData, setClassFormData] = useState<ClassFormData>({
    name: '',
    instructor: '',
    time: '',
    date: '',
    capacity: '',
    price: '',
  });

  if (currentUser?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Bu bölümü görüntüleme yetkiniz bulunmamaktadır.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    setShowForm(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'student',
    });
  };

  const handleClassSubmit = () => {
    // Handle class form submission
    console.log('Class form submitted:', classFormData);
    setShowClassForm(false);
    setClassFormData({
      name: '',
      instructor: '',
      time: '',
      date: '',
      capacity: '',
      price: '',
    });
  };

  const renderUserForm = () => (
    <View style={styles.formOverlay}>
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Yeni Kullanıcı Ekle</Text>
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
            <Text style={styles.label}>Rol</Text>
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === 'student' && styles.roleButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, role: 'student' })}
              >
                <Text style={[
                  styles.roleButtonText,
                  formData.role === 'student' && styles.roleButtonTextActive,
                ]}>Öğrenci</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === 'instructor' && styles.roleButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, role: 'instructor' })}
              >
                <Text style={[
                  styles.roleButtonText,
                  formData.role === 'instructor' && styles.roleButtonTextActive,
                ]}>Eğitmen</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Check size={20} color="white" />
            <Text style={styles.submitButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderClassForm = () => (
    <View style={styles.formOverlay}>
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Yeni Ders Ekle</Text>
          <TouchableOpacity onPress={() => setShowClassForm(false)}>
            <X size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <View style={styles.formBody}>
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
            <Text style={styles.label}>Eğitmen</Text>
            <TextInput
              style={styles.input}
              value={classFormData.instructor}
              onChangeText={(text) => setClassFormData({ ...classFormData, instructor: text })}
              placeholder="Eğitmen seçiniz"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Tarih</Text>
            <TextInput
              style={styles.input}
              value={classFormData.date}
              onChangeText={(text) => setClassFormData({ ...classFormData, date: text })}
              placeholder="Tarih seçiniz"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.label}>Saat</Text>
            <TextInput
              style={styles.input}
              value={classFormData.time}
              onChangeText={(text) => setClassFormData({ ...classFormData, time: text })}
              placeholder="Saat seçiniz"
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
            <Check size={20} color="white" />
            <Text style={styles.submitButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'users' && styles.activeTab]}
            onPress={() => setActiveTab('users')}
          >
            <Users size={20} color={activeTab === 'users' ? '#4F46E5' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
              Kullanıcılar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'classes' && styles.activeTab]}
            onPress={() => setActiveTab('classes')}
          >
            <Calendar size={20} color={activeTab === 'classes' ? '#4F46E5' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'classes' && styles.activeTabText]}>
              Dersler
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'performance' && styles.activeTab]}
            onPress={() => setActiveTab('performance')}
          >
            <Award size={20} color={activeTab === 'performance' ? '#4F46E5' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'performance' && styles.activeTabText]}>
              Performans
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'payments' && styles.activeTab]}
            onPress={() => setActiveTab('payments')}
          >
            <CreditCard size={20} color={activeTab === 'payments' ? '#4F46E5' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'payments' && styles.activeTabText]}>
              Ödemeler
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>
              {activeTab === 'users' && 'Kullanıcı Yönetimi'}
              {activeTab === 'classes' && 'Ders Yönetimi'}
              {activeTab === 'performance' && 'Performans Yönetimi'}
              {activeTab === 'payments' && 'Ödeme Yönetimi'}
            </Text>
            {(activeTab === 'users' || activeTab === 'classes') && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (activeTab === 'users') setShowForm(true);
                  if (activeTab === 'classes') setShowClassForm(true);
                }}
              >
                <Plus size={20} color="white" />
                <Text style={styles.addButtonText}>
                  {activeTab === 'users' ? 'Yeni Kullanıcı' : 'Yeni Ders'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Content will be added here based on active tab */}
        </View>
      </ScrollView>

      {showForm && renderUserForm()}
      {showClassForm && renderClassForm()}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 4,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    margin: 16,
    marginTop: 0,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contentTitle: {
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
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#EEF2FF',
  },
  roleButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  roleButtonTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});