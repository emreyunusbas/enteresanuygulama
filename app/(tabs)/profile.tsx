import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, CreditCard, Clock, CheckCircle, XCircle, ChevronDown } from 'lucide-react-native';
import { UserContext } from '../context/UserContext';

const studentData = {
  3: {
    classHistory: [
      {
        date: '2025-05-26',
        className: 'Pilates Temel',
        instructor: 'Ayşe Yılmaz',
        time: '09:00',
        attended: true,
        price: 150
      },
      {
        date: '2025-05-25',
        className: 'Yoga Flow',
        instructor: 'Mehmet Demir',
        time: '10:30',
        attended: true,
        price: 120
      },
      {
        date: '2025-05-24',
        className: 'Pilates İleri',
        instructor: 'Ayşe Yılmaz',
        time: '18:00',
        attended: false,
        price: 180
      }
    ],
    payments: [
      {
        id: 1,
        date: '2025-05-20',
        amount: 450,
        method: 'creditCard',
        description: 'Mayıs Ayı 3 Ders Paketi'
      },
      {
        id: 2,
        date: '2025-04-15',
        amount: 600,
        method: 'bankTransfer',
        description: 'Nisan Ayı 4 Ders Paketi'
      },
      {
        id: 3,
        date: '2025-03-10',
        amount: 300,
        method: 'cash',
        description: 'Mart Ayı 2 Ders Paketi'
      }
    ],
    classOccupancy: [
      { name: 'Temel Pilates', rate: 85 },
      { name: 'İleri Pilates', rate: 78 },
      { name: 'Yoga', rate: 82 },
      { name: 'Özel Ders', rate: 95 }
    ]
  },
  4: {
    classHistory: [
      {
        date: '2025-05-26',
        className: 'Pilates Temel',
        instructor: 'Ayşe Yılmaz',
        time: '09:00',
        attended: true,
        price: 150
      },
      {
        date: '2025-05-25',
        className: 'Yoga Flow',
        instructor: 'Mehmet Demir',
        time: '10:30',
        attended: false,
        price: 120
      }
    ],
    payments: [
      {
        id: 1,
        date: '2025-05-20',
        amount: 300,
        method: 'creditCard',
        description: 'Mayıs Ayı 2 Ders Paketi'
      }
    ],
    classOccupancy: [
      { name: 'Temel Pilates', rate: 82 },
      { name: 'Yoga', rate: 75 },
      { name: 'Özel Ders', rate: 90 }
    ]
  }
};

const students = [
  { id: 3, name: 'Zeynep Kaya' },
  { id: 4, name: 'Ali Özkan' }
];

export default function ProfileScreen() {
  const { currentUser } = useContext(UserContext);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0].id);

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Lütfen giriş yapın.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isAdmin = currentUser.role === 'admin';
  const isStudent = currentUser.role === 'student';
  
  if (!isAdmin && !isStudent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Öğrenci paneline erişim yetkiniz bulunmamaktadır.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const activeStudentId = isAdmin ? selectedStudentId : currentUser.id;
  const userData = studentData[activeStudentId];
  const totalSpent = userData.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const attendedClasses = userData.classHistory.filter(cls => cls.attended).length;
  const totalClasses = userData.classHistory.length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'creditCard':
        return { icon: CreditCard, color: '#3B82F6', label: 'Kredi Kartı' };
      case 'bankTransfer':
        return { icon: Clock, color: '#10B981', label: 'Havale/EFT' };
      default:
        return { icon: CreditCard, color: '#EC4899', label: 'Nakit' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          {isAdmin && (
            <View style={styles.studentSelector}>
              <Text style={styles.selectorLabel}>Öğrenci Seçin</Text>
              <View style={styles.dropdown}>
                {students.map((student) => (
                  <TouchableOpacity
                    key={student.id}
                    style={[
                      styles.dropdownItem,
                      selectedStudentId === student.id && styles.dropdownItemSelected
                    ]}
                    onPress={() => setSelectedStudentId(student.id)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedStudentId === student.id && styles.dropdownItemTextSelected
                    ]}>
                      {student.name}
                    </Text>
                    {selectedStudentId === student.id && (
                      <ChevronDown size={20} color="#3B82F6" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          {!isAdmin && (
            <>
              <Text style={styles.welcomeText}>Hoş geldin,</Text>
              <Text style={styles.userName}>{currentUser.name}</Text>
            </>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₺{totalSpent.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Toplam Ödeme</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{attendedClasses}/{totalClasses}</Text>
            <Text style={styles.statLabel}>Katılım Oranı</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ders Doluluk Oranları</Text>
          <View style={styles.occupancyList}>
            {userData.classOccupancy.map((classType, index) => (
              <View key={index} style={styles.occupancyItem}>
                <View style={styles.occupancyHeader}>
                  <Text style={styles.className}>{classType.name}</Text>
                  <Text style={styles.occupancyRate}>%{classType.rate}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${classType.rate}%`,
                        backgroundColor: 
                          classType.rate >= 90 ? '#059669' :
                          classType.rate >= 80 ? '#3B82F6' :
                          '#F59E0B'
                      }
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ders Geçmişi</Text>
          {userData.classHistory.map((cls, index) => (
            <View key={index} style={styles.classCard}>
              <View style={styles.classHeader}>
                <View>
                  <Text style={styles.className}>{cls.className}</Text>
                  <Text style={styles.classInfo}>{formatDate(cls.date)} • {cls.time}</Text>
                </View>
                {cls.attended ? (
                  <View style={styles.attendedBadge}>
                    <CheckCircle size={16} color="#059669" />
                    <Text style={styles.attendedText}>Katıldı</Text>
                  </View>
                ) : (
                  <View style={styles.absentBadge}>
                    <XCircle size={16} color="#DC2626" />
                    <Text style={styles.absentText}>Katılmadı</Text>
                  </View>
                )}
              </View>
              <View style={styles.classDetails}>
                <Text style={styles.instructorName}>Eğitmen: {cls.instructor}</Text>
                <Text style={styles.classPrice}>₺{cls.price}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={styles.sectionTitle}>Ödeme Geçmişi</Text>
          {userData.payments.map((payment) => {
            const { icon: PaymentIcon, color, label } = getPaymentMethodIcon(payment.method);
            return (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentAmount}>₺{payment.amount.toLocaleString()}</Text>
                    <Text style={styles.paymentDate}>{formatDate(payment.date)}</Text>
                  </View>
                  <View style={[styles.paymentMethod, { backgroundColor: `${color}10` }]}>
                    <PaymentIcon size={16} color={color} />
                    <Text style={[styles.paymentMethodText, { color }]}>{label}</Text>
                  </View>
                </View>
                <Text style={styles.paymentDescription}>{payment.description}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  scrollView: {
    flex: 1
  },
  header: {
    padding: 16,
    backgroundColor: 'white'
  },
  studentSelector: {
    marginBottom: 8
  },
  selectorLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8
  },
  dropdown: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden'
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  dropdownItemSelected: {
    backgroundColor: '#EFF6FF'
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1F2937'
  },
  dropdownItemTextSelected: {
    color: '#3B82F6',
    fontWeight: '600'
  },
  welcomeText: {
    fontSize: 14,
    color: '#6B7280'
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 4
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center'
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
  },
  section: {
    margin: 16,
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16
  },
  occupancyList: {
    gap: 12
  },
  occupancyItem: {
    marginBottom: 12
  },
  occupancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  className: {
    fontSize: 14,
    color: '#4B5563'
  },
  occupancyRate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937'
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 4
  },
  classCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  classInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2
  },
  attendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4
  },
  attendedText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '500'
  },
  absentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4
  },
  absentText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500'
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12
  },
  instructorName: {
    fontSize: 14,
    color: '#6B7280'
  },
  classPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669'
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  paymentInfo: {
    flex: 1
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  paymentDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '500'
  },
  paymentDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4
  }
});