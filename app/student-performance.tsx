import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, X, Calendar, TrendingUp, Clock, ChevronDown, Home } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';

const studentPerformance = {
  overview: {
    totalStudents: 156,
    activeStudents: 142,
    averageAttendance: 87,
    classOccupancy: 82
  },
  students: [
    {
      id: 3,
      name: 'Zeynep Kaya',
      metrics: {
        attendanceRate: 95,
        totalClasses: 48,
        classTypes: {
          pilatesBasic: 24,
          pilatesAdvanced: 16,
          yoga: 8
        },
        lastMonth: {
          attendance: 92,
          improvement: 3
        }
      }
    },
    {
      id: 4,
      name: 'Ali Özkan',
      metrics: {
        attendanceRate: 88,
        totalClasses: 36,
        classTypes: {
          pilatesBasic: 20,
          yoga: 16
        },
        lastMonth: {
          attendance: 85,
          improvement: 2
        }
      }
    },
    {
      id: 5,
      name: 'Fatma Şahin',
      metrics: {
        attendanceRate: 92,
        totalClasses: 42,
        classTypes: {
          pilatesAdvanced: 28,
          personalTraining: 14
        },
        lastMonth: {
          attendance: 90,
          improvement: 4
        }
      }
    }
  ],
  classOccupancy: [
    { name: 'Temel Pilates', rate: 85 },
    { name: 'İleri Pilates', rate: 78 },
    { name: 'Yoga', rate: 82 },
    { name: 'Özel Ders', rate: 95 }
  ]
};

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
    outputRange: [0, 250],
  });

  const rotateZ = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

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
            <Text style={styles.metricValue}>{student.metrics.totalClasses}</Text>
            <Text style={styles.metricLabel}>Toplam Ders</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Clock size={20} color="#10B981" />
            <Text style={styles.metricValue}>%{student.metrics.attendanceRate}</Text>
            <Text style={styles.metricLabel}>Katılım Oranı</Text>
          </View>
          
          <View style={styles.metricCard}>
            <TrendingUp size={20} color="#8B5CF6" />
            <Text style={styles.metricValue}>%{student.metrics.lastMonth.improvement}</Text>
            <Text style={styles.metricLabel}>Gelişim</Text>
          </View>
        </View>

        <View style={styles.classTypeBreakdown}>
          <Text style={styles.breakdownTitle}>Ders Dağılımı</Text>
          {Object.entries(student.metrics.classTypes).map(([type, count]) => (
            <View key={type} style={styles.classTypeItem}>
              <Text style={styles.classTypeName}>
                {type === 'pilatesBasic' ? 'Temel Pilates' :
                 type === 'pilatesAdvanced' ? 'İleri Pilates' :
                 type === 'yoga' ? 'Yoga' : 'Özel Ders'}
              </Text>
              <View style={styles.classTypeBar}>
                <View 
                  style={[
                    styles.classTypeBarFill,
                    { width: `${(count / student.metrics.totalClasses) * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.classTypeCount}>{count} ders</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

export default function StudentPerformanceScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { setCurrentUser } = useContext(UserContext);
  const [openAccordion, setOpenAccordion] = useState(null);

  const handleGoHome = () => {
    setCurrentUser(null);
    router.replace('/');
  };

  const toggleAccordion = (studentId) => {
    setOpenAccordion(openAccordion === studentId ? null : studentId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Users size={24} color="#8B5CF6" />
            <Text style={styles.title}>Öğrenci Performansı</Text>
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

        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Genel Bakış</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewCard}>
              <Users size={20} color="#3B82F6" />
              <Text style={styles.overviewValue}>{studentPerformance.overview.totalStudents}</Text>
              <Text style={styles.overviewLabel}>Toplam Öğrenci</Text>
            </View>
            
            <View style={styles.overviewCard}>
              <Calendar size={20} color="#10B981" />
              <Text style={styles.overviewValue}>%{studentPerformance.overview.averageAttendance}</Text>
              <Text style={styles.overviewLabel}>Ortalama Katılım</Text>
            </View>
            
            <View style={styles.overviewCard}>
              <Clock size={20} color="#8B5CF6" />
              <Text style={styles.overviewValue}>%{studentPerformance.overview.classOccupancy}</Text>
              <Text style={styles.overviewLabel}>Doluluk Oranı</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ders Doluluk Oranları</Text>
          <View style={styles.occupancyList}>
            {studentPerformance.classOccupancy.map((classType) => (
              <View key={classType.name} style={styles.occupancyItem}>
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
          <Text style={styles.sectionTitle}>Öğrenci Detayları</Text>
          {studentPerformance.students.map((student) => (
            <StudentAccordion
              key={student.id}
              student={student}
              isOpen={openAccordion === student.id}
              onToggle={() => toggleAccordion(student.id)}
            />
          ))}
        </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  closeButton: {
    padding: 8,
  },
  overviewSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
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
  occupancyList: {
    gap: 16,
  },
  occupancyItem: {
    marginBottom: 12,
  },
  occupancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  className: {
    fontSize: 14,
    color: '#4B5563',
  },
  occupancyRate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  studentCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
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
    textAlign: 'center',
  },
  classTypeBreakdown: {
    marginTop: 16,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
  },
  classTypeItem: {
    marginBottom: 12,
  },
  classTypeName: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  classTypeBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  classTypeBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
  },
  classTypeCount: {
    fontSize: 12,
    color: '#6B7280',
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
  }
});