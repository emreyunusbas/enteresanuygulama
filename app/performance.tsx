import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, TrendingUp, Users, Calendar, X, ChevronDown, CheckCircle, XCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './context/UserContext';

const instructorPerformance = [
  {
    id: 1,
    name: 'Ayşe Yılmaz',
    metrics: {
      weekly: {
        classes: 24,
        attendance: 92,
        revenue: 20000,
        studentSatisfaction: 4.8
      },
      monthly: {
        classes: 96,
        attendance: 89,
        revenue: 78000,
        studentSatisfaction: 4.7
      }
    },
    students: [
      {
        id: 3,
        name: 'Zeynep Kaya',
        attendance: [
          { date: '2025-05-26', className: 'Pilates Temel', attended: true },
          { date: '2025-05-24', className: 'Pilates İleri', attended: false },
          { date: '2025-05-22', className: 'Pilates Temel', attended: true },
          { date: '2025-05-20', className: 'Pilates İleri', attended: true }
        ],
        performance: {
          attendanceRate: 75,
          improvement: 8,
          totalClasses: 4
        }
      },
      {
        id: 4,
        name: 'Ali Özkan',
        attendance: [
          { date: '2025-05-26', className: 'Pilates Temel', attended: true },
          { date: '2025-05-23', className: 'Pilates Temel', attended: true },
          { date: '2025-05-21', className: 'Pilates Temel', attended: false }
        ],
        performance: {
          attendanceRate: 67,
          improvement: 5,
          totalClasses: 3
        }
      }
    ]
  },
  {
    id: 2,
    name: 'Mehmet Demir',
    metrics: {
      weekly: {
        classes: 20,
        attendance: 88,
        revenue: 16500,
        studentSatisfaction: 4.6
      },
      monthly: {
        classes: 82,
        attendance: 87,
        revenue: 65000,
        studentSatisfaction: 4.5
      }
    },
    students: [
      {
        id: 5,
        name: 'Fatma Şahin',
        attendance: [
          { date: '2025-05-25', className: 'Yoga Flow', attended: true },
          { date: '2025-05-23', className: 'Yoga Flow', attended: true },
          { date: '2025-05-21', className: 'Yoga Flow', attended: true }
        ],
        performance: {
          attendanceRate: 100,
          improvement: 10,
          totalClasses: 3
        }
      }
    ]
  }
];

function StudentAccordion({ student, isOpen, onToggle }) {
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const bodyHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 350], // Increased height to accommodate attendance list
  });

  const rotateZ = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.studentName}>{student.name}</Text>
        <Animated.View style={{ transform: [{ rotateZ }] }}>
          <ChevronDown size={20} color="#6B7280" />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.accordionBody, { height: bodyHeight }]}>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Calendar size={20} color="#3B82F6" />
            <Text style={styles.metricValue}>{student.performance.totalClasses}</Text>
            <Text style={styles.metricLabel}>Toplam Ders</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Users size={20} color="#10B981" />
            <Text style={styles.metricValue}>%{student.performance.attendanceRate}</Text>
            <Text style={styles.metricLabel}>Katılım Oranı</Text>
          </View>
          
          <View style={styles.metricCard}>
            <TrendingUp size={20} color="#8B5CF6" />
            <Text style={styles.metricValue}>%{student.performance.improvement}</Text>
            <Text style={styles.metricLabel}>Gelişim</Text>
          </View>
        </View>

        <View style={styles.attendanceList}>
          <Text style={styles.attendanceTitle}>Ders Katılım Geçmişi</Text>
          {student.attendance.map((record, index) => (
            <View key={index} style={styles.attendanceRecord}>
              <View style={styles.attendanceInfo}>
                <Text style={styles.attendanceDate}>{formatDate(record.date)}</Text>
                <Text style={styles.className}>{record.className}</Text>
              </View>
              {record.attended ? (
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
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

export default function PerformanceScreen() {
  const navigation = useNavigation();
  const { currentUser } = useContext(UserContext);
  const [openAccordion, setOpenAccordion] = useState(null);

  // Filter instructors based on user role and ID
  const visibleInstructors = instructorPerformance.filter(instructor => {
    if (currentUser?.role === 'admin') {
      return true; // Admin sees all
    }
    if (currentUser?.role === 'instructor') {
      return instructor.id === currentUser.id; // Instructor only sees their own data
    }
    return false;
  });

  const toggleAccordion = (studentId) => {
    setOpenAccordion(openAccordion === studentId ? null : studentId);
  };

  if (visibleInstructors.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Award size={24} color="#8B5CF6" />
            <Text style={styles.title}>Performans Analizi</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <X size={24} color="#4B5563" />
          </TouchableOpacity>
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
            <Award size={24} color="#8B5CF6" />
            <Text style={styles.title}>Performans Analizi</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <X size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {visibleInstructors.map((instructor) => (
          <View key={instructor.id}>
            <View style={styles.instructorCard}>
              <Text style={styles.instructorName}>{instructor.name}</Text>
              
              <View style={styles.periodSection}>
                <Text style={styles.periodTitle}>Haftalık Performans</Text>
                <View style={styles.metricsGrid}>
                  <View style={styles.metricCard}>
                    <Calendar size={20} color="#3B82F6" />
                    <Text style={styles.metricValue}>{instructor.metrics.weekly.classes}</Text>
                    <Text style={styles.metricLabel}>Ders</Text>
                  </View>
                  
                  <View style={styles.metricCard}>
                    <Users size={20} color="#10B981" />
                    <Text style={styles.metricValue}>%{instructor.metrics.weekly.attendance}</Text>
                    <Text style={styles.metricLabel}>Katılım</Text>
                  </View>
                  
                  <View style={styles.metricCard}>
                    <TrendingUp size={20} color="#8B5CF6" />
                    <Text style={styles.metricValue}>₺{instructor.metrics.weekly.revenue.toLocaleString()}</Text>
                    <Text style={styles.metricLabel}>Gelir</Text>
                  </View>
                </View>
              </View>

              <View style={styles.periodSection}>
                <Text style={styles.periodTitle}>Aylık Performans</Text>
                <View style={styles.metricsGrid}>
                  <View style={styles.metricCard}>
                    <Calendar size={20} color="#3B82F6" />
                    <Text style={styles.metricValue}>{instructor.metrics.monthly.classes}</Text>
                    <Text style={styles.metricLabel}>Ders</Text>
                  </View>
                  
                  <View style={styles.metricCard}>
                    <Users size={20} color="#10B981" />
                    <Text style={styles.metricValue}>%{instructor.metrics.monthly.attendance}</Text>
                    <Text style={styles.metricLabel}>Katılım</Text>
                  </View>
                  
                  <View style={styles.metricCard}>
                    <TrendingUp size={20} color="#8B5CF6" />
                    <Text style={styles.metricValue}>₺{instructor.metrics.monthly.revenue.toLocaleString()}</Text>
                    <Text style={styles.metricLabel}>Gelir</Text>
                  </View>
                </View>
              </View>

              <View style={styles.satisfactionSection}>
                <Text style={styles.satisfactionLabel}>Öğrenci Memnuniyeti</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingValue}>{instructor.metrics.monthly.studentSatisfaction}</Text>
                  <View style={styles.starContainer}>
                    {[...Array(5)].map((_, index) => (
                      <Text 
                        key={index} 
                        style={[
                          styles.star,
                          { color: index < Math.floor(instructor.metrics.monthly.studentSatisfaction) ? '#F59E0B' : '#E5E7EB' }
                        ]}
                      >
                        ★
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Öğrenci Performansları</Text>
              {instructor.students.map((student) => (
                <StudentAccordion
                  key={student.id}
                  student={student}
                  isOpen={openAccordion === student.id}
                  onToggle={() => toggleAccordion(student.id)}
                />
              ))}
            </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
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
  instructorCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  periodSection: {
    marginBottom: 24,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  satisfactionSection: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  satisfactionLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  starContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 20,
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  accordionContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  accordionBody: {
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  attendanceList: {
    marginTop: 16,
  },
  attendanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  attendanceRecord: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  attendanceInfo: {
    flex: 1,
  },
  attendanceDate: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 2,
  },
  className: {
    fontSize: 14,
    color: '#6B7280',
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
});