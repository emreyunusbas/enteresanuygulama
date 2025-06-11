import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Users, Calendar, TrendingUp, BarChart3, Clock, CreditCard, Wallet, Banknote as BanknoteIcon } from 'lucide-react-native';
import { UserContext } from '../context/UserContext';
import { useRouter } from 'expo-router';

const users = [
  { id: 1, name: 'Ayşe Yılmaz', role: 'instructor', email: 'ayse@studio.com', phone: '0532 123 4567' },
  { id: 2, name: 'Mehmet Demir', role: 'instructor', email: 'mehmet@studio.com', phone: '0533 987 6543' },
  { id: 3, name: 'Zeynep Kaya', role: 'student', email: 'zeynep@email.com', phone: '0534 555 1234' },
  { id: 4, name: 'Ali Özkan', role: 'student', email: 'ali@email.com', phone: '0535 444 5678' },
  { id: 5, name: 'Admin User', role: 'admin', email: 'admin@studio.com', phone: '0536 111 2222' }
];

const dailyPayments = {
  total: 32450,
  creditCard: 18750,
  bankTransfer: 8700,
  cash: 5000,
  byInstructor: {
    'Ayşe Yılmaz': {
      total: 20000,
      creditCard: 12000,
      bankTransfer: 5000,
      cash: 3000
    },
    'Mehmet Demir': {
      total: 12450,
      creditCard: 6750,
      bankTransfer: 3700,
      cash: 2000
    }
  }
};

const weeklyRevenue = {
  total: 156780,
  days: [
    { day: 'Pazartesi', amount: 32450 },
    { day: 'Salı', amount: 28900 },
    { day: 'Çarşamba', amount: 31200 },
    { day: 'Perşembe', amount: 25800 },
    { day: 'Cuma', amount: 38430 }
  ]
};

const monthlyRevenue = {
  total: 687450,
  months: [
    { month: 'Ocak', amount: 582300 },
    { month: 'Şubat', amount: 623450 },
    { month: 'Mart', amount: 598700 },
    { month: 'Nisan', amount: 645200 },
    { month: 'Mayıs', amount: 687450 }
  ],
  categories: {
    pilatesBasic: 245000,
    pilatesAdvanced: 198450,
    yoga: 156000,
    personalTraining: 88000
  }
};

const PaymentMethodIcon = ({ type }: { type: 'creditCard' | 'bankTransfer' | 'cash' }) => {
  const icons = {
    creditCard: {
      icon: CreditCard,
      label: 'Kredi/Banka Kartı',
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      description: 'POS cihazı ile yapılan ödemeler'
    },
    bankTransfer: {
      icon: BanknoteIcon,
      label: 'Havale/EFT',
      color: '#10B981',
      bgColor: '#F0FDF4',
      description: 'Banka transferi ile yapılan ödemeler'
    },
    cash: {
      icon: Wallet,
      label: 'Nakit',
      color: '#EC4899',
      bgColor: '#FDF2F8',
      description: 'Elden yapılan nakit ödemeler'
    }
  };

  const IconComponent = icons[type].icon;

  return (
    <View style={[styles.paymentMethodCard, { backgroundColor: icons[type].bgColor }]}>
      <View style={styles.paymentIconContainer}>
        <IconComponent size={20} color={icons[type].color} />
        <View style={[styles.tooltip, { backgroundColor: icons[type].color }]}>
          <Text style={styles.tooltipText}>{icons[type].description}</Text>
        </View>
      </View>
      <Text style={[styles.paymentMethodAmount, { color: icons[type].color }]}>
        ₺{dailyPayments[type].toLocaleString()}
      </Text>
      <Text style={styles.paymentMethodLabel}>{icons[type].label}</Text>
    </View>
  );
};

export default function HomeScreen() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const router = useRouter();

  // Admin kullanıcısını otomatik olarak admin paneline yönlendir
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      router.replace('/admin');
    }
  }, [currentUser, router]);

  const AdminDashboard = () => (
    <>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#3B82F6' }]}>
          <View>
            <Text style={styles.statLabel}>Toplam Öğrenci</Text>
            <Text style={styles.statValue}>156</Text>
          </View>
          <Users size={24} color="white" />
        </View>

        <View style={[styles.statCard, { backgroundColor: '#10B981' }]}>
          <View>
            <Text style={styles.statLabel}>Bugün Dersler</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
          <Calendar size={24} color="white" />
        </View>

        <View style={[styles.statCard, { backgroundColor: '#8B5CF6' }]}>
          <View>
            <Text style={styles.statLabel}>Günlük Ciro</Text>
            <Text style={styles.statValue}>₺{dailyPayments.total.toLocaleString()}</Text>
          </View>
          <TrendingUp size={24} color="white" />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <BarChart3 size={20} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Günlük Ödeme Detayları</Text>
        </View>
        
        <View style={styles.paymentMethodsContainer}>
          <PaymentMethodIcon type="creditCard" />
          <PaymentMethodIcon type="bankTransfer" />
          <PaymentMethodIcon type="cash" />
        </View>

        <View style={styles.instructorPayments}>
          <Text style={styles.subsectionTitle}>Eğitmen Bazlı Ödemeler</Text>
          {Object.entries(dailyPayments.byInstructor).map(([instructor, payments]) => (
            <View key={instructor} style={styles.instructorPaymentCard}>
              <View style={styles.instructorPaymentHeader}>
                <Text style={styles.instructorName}>{instructor}</Text>
                <Text style={styles.instructorTotal}>₺{payments.total.toLocaleString()}</Text>
              </View>
              
              <View style={styles.paymentBreakdown}>
                <View style={styles.paymentBreakdownItem}>
                  <CreditCard size={16} color="#3B82F6" />
                  <Text style={styles.breakdownText}>₺{payments.creditCard.toLocaleString()}</Text>
                </View>
                
                <View style={styles.paymentBreakdownItem}>
                  <BanknoteIcon size={16} color="#10B981" />
                  <Text style={styles.breakdownText}>₺{payments.bankTransfer.toLocaleString()}</Text>
                </View>
                
                <View style={styles.paymentBreakdownItem}>
                  <Wallet size={16} color="#EC4899" />
                  <Text style={styles.breakdownText}>₺{payments.cash.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={20} color="#8B5CF6" />
          <Text style={styles.sectionTitle}>Haftalık Ciro Analizi</Text>
        </View>
        
        <Text style={styles.weeklyTotal}>
          Toplam: ₺{weeklyRevenue.total.toLocaleString()}
        </Text>
        
        <View style={styles.weeklyChart}>
          {weeklyRevenue.days.map((day, index) => (
            <View key={day.day} style={styles.chartBar}>
              <View style={[styles.barFill, { height: `${(day.amount / 40000) * 100}%` }]} />
              <Text style={styles.barLabel}>{day.day.slice(0, 3)}</Text>
              <Text style={styles.barAmount}>₺{day.amount.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={20} color="#8B5CF6" />
          <Text style={styles.sectionTitle}>Aylık Ciro Analizi</Text>
        </View>
        
        <Text style={styles.monthlyTotal}>
          Bu Ay: ₺{monthlyRevenue.months[4].amount.toLocaleString()}
        </Text>
        
        <View style={styles.monthlyChart}>
          {monthlyRevenue.months.map((month, index) => (
            <View key={month.month} style={styles.chartBar}>
              <View 
                style={[
                  styles.barFill, 
                  { 
                    height: `${(month.amount / 700000) * 100}%`,
                    backgroundColor: index === 4 ? '#8B5CF6' : '#CBD5E1'
                  }
                ]} 
              />
              <Text style={styles.barLabel}>{month.month}</Text>
              <Text style={styles.barAmount}>₺{(month.amount / 1000).toFixed(0)}K</Text>
            </View>
          ))}
        </View>

        <View style={styles.categoryBreakdown}>
          <Text style={styles.breakdownTitle}>Kategori Bazlı Gelir Dağılımı</Text>
          <View style={styles.categories}>
            {Object.entries(monthlyRevenue.categories).map(([category, amount]) => (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>
                    {category === 'pilatesBasic' ? 'Temel Pilates' :
                     category === 'pilatesAdvanced' ? 'İleri Pilates' :
                     category === 'yoga' ? 'Yoga' : 'Özel Ders'}
                  </Text>
                  <Text style={styles.categoryAmount}>₺{amount.toLocaleString()}</Text>
                </View>
                <View style={styles.categoryProgress}>
                  <View 
                    style={[
                      styles.categoryProgressFill,
                      { width: `${(amount / monthlyRevenue.total) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.categoryPercentage}>
                  {((amount / monthlyRevenue.total) * 100).toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.monthlyStats}>
          <View style={styles.statComparisonCard}>
            <Text style={styles.comparisonLabel}>Geçen Aya Göre</Text>
            <View style={styles.comparisonValue}>
              <TrendingUp size={16} color="#059669" />
              <Text style={styles.positiveChange}>+6.5%</Text>
            </View>
          </View>

          <View style={styles.statComparisonCard}>
            <Text style={styles.comparisonLabel}>Yıllık Ortalama</Text>
            <Text style={styles.averageValue}>₺627,420</Text>
          </View>
        </View>
      </View>
    </>
  );

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Activity size={32} color="white" />
            </View>
            <Text style={styles.title}>Studio Manager</Text>
            <Text style={styles.subtitle}>Pilates & Spor Stüdyosu</Text>
          </View>

          <View style={styles.userList}>
            {users.map(user => (
              <TouchableOpacity
                key={user.id}
                style={styles.userCard}
                onPress={() => setCurrentUser(user)}
              >
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userRole}>{user.role}</Text>
                </View>
                <View style={[
                  styles.roleBadge,
                  user.role === 'admin' ? styles.adminBadge :
                  user.role === 'instructor' ? styles.instructorBadge :
                  styles.studentBadge
                ]}>
                  <Text style={styles.roleBadgeText}>
                    {user.role === 'admin' ? 'Admin' :
                     user.role === 'instructor' ? 'Eğitmen' : 'Öğrenci'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Admin kullanıcısı için bu sayfa gösterilmez, admin paneline yönlendirilir
  if (currentUser.role === 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Admin paneline yönlendiriliyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.dashboardHeader}>
          <View style={styles.userProfile}>
            <Text style={styles.welcomeText}>Hoş geldin,</Text>
            <Text style={styles.userName}>{currentUser.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setCurrentUser(null)}
          >
            <Text style={styles.logoutText}>Çıkış</Text>
          </TouchableOpacity>
        </View>

        {currentUser.role === 'instructor' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BarChart3 size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Eğitmen Performansı</Text>
            </View>
            <View style={styles.performanceCard}>
              <View>
                <Text style={styles.instructorName}>Ayşe Yılmaz</Text>
                <Text style={styles.performanceStats}>24 ders • %92 katılım</Text>
              </View>
              <View>
                <Text style={styles.bonus}>₺3,680</Text>
                <Text style={styles.bonusLabel}>Prim</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Ders Doluluk Oranları</Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4F46E5',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userList: {
    padding: 16,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
      default: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    }),
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadge: {
    backgroundColor: '#FEE2E2',
  },
  instructorBadge: {
    backgroundColor: '#DBEAFE',
  },
  studentBadge: {
    backgroundColor: '#D1FAE5',
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  userProfile: {},
  welcomeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  logoutText: {
    color: '#4B5563',
    fontSize: 14,
  },
  statsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  performanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  instructorName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  performanceStats: {
    fontSize: 13,
    color: '#6B7280',
  },
  bonus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  bonusLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  paymentMethodCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ':hover .tooltip': {
      opacity: 1,
    },
  },
  paymentMethodAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  paymentMethodLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  instructorPayments: {
    marginTop: 24,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  instructorPaymentCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  instructorPaymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructorTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  paymentBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentBreakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  breakdownText: {
    fontSize: 14,
    color: '#6B7280',
  },
  weeklyTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    paddingTop: 20,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '60%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  barAmount: {
    fontSize: 10,
    color: '#6B7280',
    transform: [{ rotate: '-45deg' }],
  },
  paymentIconContainer: {
    position: 'relative',
    padding: 8,
  },
  tooltip: {
    position: 'absolute',
    top: -40,
    left: '50%',
    transform: [{ translateX: -75 }],
    width: 150,
    padding: 8,
    borderRadius: 8,
    opacity: 0,
    zIndex: 1,
    ...Platform.select({
      web: {
        opacity: 0,
        transition: 'opacity 0.2s',
        ':hover': {
          opacity: 1,
        },
      },
    }),
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  monthlyTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  monthlyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    marginBottom: 32,
  },
  categoryBreakdown: {
    marginTop: 32,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  categories: {
    gap: 16,
  },
  categoryItem: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#4B5563',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  categoryProgress: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  monthlyStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  statComparisonCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  comparisonValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  positiveChange: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  averageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});