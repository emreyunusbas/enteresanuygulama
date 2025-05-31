import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, TrendingUp, Users, Calendar, X } from 'lucide-react-native';
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
    }
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
    }
  }
];

export default function PerformanceScreen() {
  const navigation = useNavigation();
  const { currentUser } = useContext(UserContext);

  // Filter instructors based on user role and ID
  const visibleInstructors = instructorPerformance.filter(instructor => {
    if (currentUser?.role === 'admin') {
      return true; // Admin sees all
    }
    if (currentUser?.role === 'instructor') {
      // Instructor only sees their own performance
      return instructor.id === currentUser.id;
    }
    return false; // Other roles see nothing
  });

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
          <View key={instructor.name} style={styles.instructorCard}>
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
});