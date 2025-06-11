import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, CreditCard, Clock, CheckCircle, XCircle, ChevronDown, User, Phone, Mail, Award, TrendingUp, Users, BarChart3, Home } from 'lucide-react-native';
import { UserContext } from '../context/UserContext';
import { useData } from '../context/DataContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { students, instructors, classes } = useData();
  const router = useRouter();
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id);
  const [expandedSection, setExpandedSection] = useState(null);

  const handleGoHome = () => {
    setCurrentUser(null);
    router.replace('/');
  };

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
  const isInstructor = currentUser.role === 'instructor';

  // Instructor Profile Component
  const InstructorProfile = () => {
    const instructorData = instructors.find(inst => inst.name === currentUser.name) || {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      specialties: ['Pilates', 'Yoga'],
      rating: 4.8,
      totalClasses: 245,
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
    };

    const myClasses = classes.filter(cls => cls.instructor === currentUser.name);
    const totalStudents = myClasses.reduce((sum, cls) => sum + cls.enrolled, 0);
    const averageOccupancy = myClasses.length > 0 
      ? Math.round(myClasses.reduce((sum, cls) => sum + (cls.enrolled / cls.capacity * 100), 0) / myClasses.length)
      : 0;

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const toggleSection = (section) => {
      setExpandedSection(expandedSection === section ? null : section);
    };

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.profileImageContainer}>
              <User size={40} color="#4F46E5" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.userName}>{instructorData.name}</Text>
              <Text style={styles.userRole}>Eğitmen</Text>
              <View style={styles.ratingContainer}>
                <Award size={16} color="#F59E0B" />
                <Text style={styles.rating}>{instructorData.rating}/5</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleGoHome}
          >
            <Home size={20} color="white" />
            <Text style={styles.homeButtonText}>Ana Sayfa</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Mail size={20} color="#6B7280" />
                <Text style={styles.contactText}>{instructorData.email}</Text>
              </View>
              <View style={styles.contactItem}>
                <Phone size={20} color="#6B7280" />
                <Text style={styles.contactText}>{instructorData.phone}</Text>
              </View>
            </View>
          </View>

          {/* Specialties */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uzmanlık Alanları</Text>
            <View style={styles.specialties}>
              {instructorData.specialties.map((specialty, index) => (
                <View key={index} style={styles.specialtyBadge}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Calendar size={24} color="#3B82F6" />
              <Text style={styles.statValue}>{instructorData.totalClasses}</Text>
              <Text style={styles.statLabel}>Toplam Ders</Text>
            </View>
            <View style={styles.statCard}>
              <Users size={24} color="#10B981" />
              <Text style={styles.statValue}>{totalStudents}</Text>
              <Text style={styles.statLabel}>Toplam Öğrenci</Text>
            </View>
            <View style={styles.statCard}>
              <BarChart3 size={24} color="#8B5CF6" />
              <Text style={styles.statValue}>%{averageOccupancy}</Text>
              <Text style={styles.statLabel}>Ortalama Doluluk</Text>
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.expandableHeader}
              onPress={() => toggleSection('performance')}
            >
              <Text style={styles.sectionTitle}>Performans Metrikleri</Text>
              <ChevronDown 
                size={20} 
                color="#6B7280" 
                style={[
                  styles.chevron,
                  expandedSection === 'performance' && styles.chevronExpanded
                ]}
              />
            </TouchableOpacity>
            
            {expandedSection === 'performance' && (
              <View style={styles.expandableContent}>
                <View style={styles.periodSection}>
                  <Text style={styles.periodTitle}>Haftalık Performans</Text>
                  <View style={styles.metricsGrid}>
                    <View style={styles.metricCard}>
                      <Calendar size={20} color="#3B82F6" />
                      <Text style={styles.metricValue}>{instructorData.metrics.weekly.classes}</Text>
                      <Text style={styles.metricLabel}>Ders</Text>
                    </View>
                    
                    <View style={styles.metricCard}>
                      <Users size={20} color="#10B981" />
                      <Text style={styles.metricValue}>%{instructorData.metrics.weekly.attendance}</Text>
                      <Text style={styles.metricLabel}>Katılım</Text>
                    </View>
                    
                    <View style={styles.metricCard}>
                      <TrendingUp size={20} color="#8B5CF6" />
                      <Text style={styles.metricValue}>₺{instructorData.metrics.weekly.revenue.toLocaleString()}</Text>
                      <Text style={styles.metricLabel}>Gelir</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.periodSection}>
                  <Text style={styles.periodTitle}>Aylık Performans</Text>
                  <View style={styles.metricsGrid}>
                    <View style={styles.metricCard}>
                      <Calendar size={20} color="#3B82F6" />
                      <Text style={styles.metricValue}>{instructorData.metrics.monthly.classes}</Text>
                      <Text style={styles.metricLabel}>Ders</Text>
                    </View>
                    
                    <View style={styles.metricCard}>
                      <Users size={20} color="#10B981" />
                      <Text style={styles.metricValue}>%{instructorData.metrics.monthly.attendance}</Text>
                      <Text style={styles.metricLabel}>Katılım</Text>
                    </View>
                    
                    <View style={styles.metricCard}>
                      <TrendingUp size={20} color="#8B5CF6" />
                      <Text style={styles.metricValue}>₺{instructorData.metrics.monthly.revenue.toLocaleString()}</Text>
                      <Text style={styles.metricLabel}>Gelir</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* My Classes */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.expandableHeader}
              onPress={() => toggleSection('classes')}
            >
              <Text style={styles.sectionTitle}>Derslerim ({myClasses.length})</Text>
              <ChevronDown 
                size={20} 
                color="#6B7280" 
                style={[
                  styles.chevron,
                  expandedSection === 'classes' && styles.chevronExpanded
                ]}
              />
            </TouchableOpacity>
            
            {expandedSection === 'classes' && (
              <View style={styles.expandableContent}>
                {myClasses.map((cls) => (
                  <View key={cls.id} style={styles.classCard}>
                    <View style={styles.classHeader}>
                      <Text style={styles.className}>{cls.name}</Text>
                      <View style={styles.priceBadge}>
                        <Text style={styles.priceText}>₺{cls.price}</Text>
                      </View>
                    </View>
                    <View style={styles.classDetails}>
                      <Text style={styles.classInfo}>{cls.date} • {cls.time}</Text>
                      <Text style={styles.classInfo}>
                        Doluluk: {cls.enrolled}/{cls.capacity} (%{Math.round((cls.enrolled / cls.capacity) * 100)})
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Student Performance */}
          <View style={[styles.section, styles.lastSection]}>
            <TouchableOpacity 
              style={styles.expandableHeader}
              onPress={() => toggleSection('students')}
            >
              <Text style={styles.sectionTitle}>Öğrenci Performansları</Text>
              <ChevronDown 
                size={20} 
                color="#6B7280" 
                style={[
                  styles.chevron,
                  expandedSection === 'students' && styles.chevronExpanded
                ]}
              />
            </TouchableOpacity>
            
            {expandedSection === 'students' && (
              <View style={styles.expandableContent}>
                {instructorData.students.map((student) => (
                  <View key={student.id} style={styles.studentCard}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    
                    <View style={styles.studentMetrics}>
                      <View style={styles.studentMetricItem}>
                        <Text style={styles.studentMetricValue}>{student.performance.totalClasses}</Text>
                        <Text style={styles.studentMetricLabel}>Toplam Ders</Text>
                      </View>
                      <View style={styles.studentMetricItem}>
                        <Text style={styles.studentMetricValue}>%{student.performance.attendanceRate}</Text>
                        <Text style={styles.studentMetricLabel}>Katılım Oranı</Text>
                      </View>
                      <View style={styles.studentMetricItem}>
                        <Text style={styles.studentMetricValue}>%{student.performance.improvement}</Text>
                        <Text style={styles.studentMetricLabel}>Gelişim</Text>
                      </View>
                    </View>

                    <View style={styles.attendanceHistory}>
                      <Text style={styles.attendanceTitle}>Son Katılımlar</Text>
                      {student.attendance.slice(0, 3).map((record, index) => (
                        <View key={index} style={styles.attendanceRecord}>
                          <View style={styles.attendanceInfo}>
                            <Text style={styles.attendanceDate}>{formatDate(record.date)}</Text>
                            <Text style={styles.attendanceClass}>{record.className}</Text>
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
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  // Student Profile Component (existing code)
  const StudentProfile = () => {
    const activeStudentId = isAdmin ? selectedStudentId : currentUser.id;
    const userData = students.find(s => s.id === activeStudentId);

    if (!userData) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Öğrenci verisi bulunamadı.
          </Text>
        </View>
      );
    }

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
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleGoHome}
          >
            <Home size={20} color="white" />
            <Text style={styles.homeButtonText}>Ana Sayfa</Text>
          </TouchableOpacity>
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
    );
  };

  // Main render logic
  if (!isAdmin && !isStudent && !isInstructor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Profil sayfasına erişim yetkiniz bulunmamaktadır.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isInstructor ? <InstructorProfile /> : <StudentProfile />}
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
  scrollContent: {
    paddingBottom: 120, // Extra padding for bottom content
  },
  header: {
    padding: 16,
    backgroundColor: 'white'
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-end',
  },
  homeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
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
  userRole: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
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
  section: {
    margin: 16,
    marginTop: 0,
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
  lastSection: {
    marginBottom: 32, // Extra margin for last section
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  expandableContent: {
    marginTop: 16,
  },
  contactInfo: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#4B5563',
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '500',
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
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
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
  classCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  className: {
    fontSize: 16,
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
    fontSize: 12,
    fontWeight: '500',
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  classInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  studentCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  studentMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  studentMetricItem: {
    alignItems: 'center',
  },
  studentMetricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  studentMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  attendanceHistory: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  attendanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  attendanceRecord: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  attendanceInfo: {
    flex: 1,
  },
  attendanceDate: {
    fontSize: 14,
    color: '#1F2937',
  },
  attendanceClass: {
    fontSize: 12,
    color: '#6B7280',
  },
  attendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  attendedText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '500',
  },
  absentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  absentText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '500',
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