import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, X, Check, AlertCircle, Home } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './context/UserContext';
import { useRouter } from 'expo-router';

const attendanceHistory = [
  {
    studentId: 3,
    name: 'Zeynep Kaya',
    history: [
      {
        date: '2025-05-26',
        className: 'Pilates Temel',
        instructor: 'Ayşe Yılmaz',
        time: '09:00',
        attended: true
      },
      {
        date: '2025-05-25',
        className: 'Yoga Flow',
        instructor: 'Mehmet Demir',
        time: '10:30',
        attended: true
      },
      {
        date: '2025-05-24',
        className: 'Pilates İleri',
        instructor: 'Ayşe Yılmaz',
        time: '18:00',
        attended: false
      }
    ]
  },
  {
    studentId: 4,
    name: 'Ali Özkan',
    history: [
      {
        date: '2025-05-26',
        className: 'Pilates Temel',
        instructor: 'Ayşe Yılmaz',
        time: '09:00',
        attended: true
      },
      {
        date: '2025-05-25',
        className: 'Yoga Flow',
        instructor: 'Mehmet Demir',
        time: '10:30',
        attended: false
      }
    ]
  }
];

export default function AttendanceHistoryScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const handleGoHome = () => {
    setCurrentUser(null);
    router.replace('/');
  };

  // Filter attendance history based on user role
  const filteredHistory = attendanceHistory.filter(student => {
    if (currentUser?.role === 'admin') {
      return true; // Admin sees all
    }
    if (currentUser?.role === 'instructor') {
      // Instructor only sees their students
      return student.history.some(record => record.instructor === currentUser.name);
    }
    return false;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'instructor')) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Calendar size={24} color="#8B5CF6" />
            <Text style={styles.title}>Katılım Geçmişi</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={handleGoHome}
            >
              <Home size={20} color="white" />
              <Text style={styles.homeButtonText}>Ana Sayfa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <X size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Bu bölümü görüntüleme yetkiniz bulunmamaktadır.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Calendar size={24} color="#8B5CF6" />
            <Text style={styles.title}>Katılım Geçmişi</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={handleGoHome}
            >
              <Home size={20} color="white" />
              <Text style={styles.homeButtonText}>Ana Sayfa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <X size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        {filteredHistory.map((student) => (
          <View key={student.studentId} style={styles.studentSection}>
            <Text style={styles.studentName}>{student.name}</Text>
            
            {student.history.map((record, index) => (
              <View key={index} style={styles.attendanceRecord}>
                <View style={styles.recordHeader}>
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.date}>{formatDate(record.date)}</Text>
                    <Text style={styles.time}>{record.time}</Text>
                  </View>
                  {record.attended ? (
                    <View style={styles.attendedBadge}>
                      <Check size={16} color="#059669" />
                      <Text style={styles.attendedText}>Katıldı</Text>
                    </View>
                  ) : (
                    <View style={styles.absentBadge}>
                      <AlertCircle size={16} color="#DC2626" />
                      <Text style={styles.absentText}>Katılmadı</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.classDetails}>
                  <Text style={styles.className}>{record.className}</Text>
                  <Text style={styles.instructor}>Eğitmen: {record.instructor}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
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
  studentSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
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
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  attendanceRecord: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateTimeContainer: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  time: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  attendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  attendedText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '500',
  },
  absentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  absentText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  classDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  className: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  instructor: {
    fontSize: 14,
    color: '#6B7280',
  },
});