import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BarChart3, TrendingUp, Users, Calendar, Activity } from 'lucide-react-native';

const dailyStats = {
  totalRevenue: 32450,
  totalClasses: 12,
  totalStudents: 156,
  attendanceRate: 92
};

const recentActivities = [
  {
    id: 1,
    type: 'student_enrolled',
    message: 'Yeni öğrenci kaydı: Elif Yılmaz',
    time: '2 saat önce',
    color: '#10B981'
  },
  {
    id: 2,
    type: 'class_completed',
    message: 'Pilates Temel dersi tamamlandı',
    time: '3 saat önce',
    color: '#3B82F6'
  },
  {
    id: 3,
    type: 'payment_received',
    message: 'Ödeme alındı: ₺450 - Zeynep Kaya',
    time: '5 saat önce',
    color: '#8B5CF6'
  },
  {
    id: 4,
    type: 'instructor_added',
    message: 'Yeni eğitmen eklendi: Can Demir',
    time: '1 gün önce',
    color: '#F59E0B'
  }
];

export default function AdminPanel() {
  const router = useRouter();

  const quickActions = [
    {
      title: 'Hızlı Öğrenci Ekle',
      description: 'Yeni öğrenci kaydı oluştur',
      icon: Users,
      route: '/admin/data-management',
      color: '#10B981'
    },
    {
      title: 'Ders Programı',
      description: 'Bugünkü dersleri görüntüle',
      icon: Calendar,
      route: '/admin/classes',
      color: '#3B82F6'
    },
    {
      title: 'Performans Raporu',
      description: 'Güncel performans analizi',
      icon: BarChart3,
      route: '/performance',
      color: '#8B5CF6'
    },
    {
      title: 'Gelir Analizi',
      description: 'Finansal durum özeti',
      icon: TrendingUp,
      route: '/revenue',
      color: '#EC4899'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Yönetim Paneli</Text>
          <Text style={styles.subtitle}>
            Stüdyonuzun güncel durumunu buradan takip edebilirsiniz.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#3B82F6' }]}>
            <View>
              <Text style={styles.statLabel}>Günlük Ciro</Text>
              <Text style={styles.statValue}>₺{dailyStats.totalRevenue.toLocaleString()}</Text>
            </View>
            <TrendingUp size={24} color="white" />
          </View>

          <View style={[styles.statCard, { backgroundColor: '#10B981' }]}>
            <View>
              <Text style={styles.statLabel}>Bugün Dersler</Text>
              <Text style={styles.statValue}>{dailyStats.totalClasses}</Text>
            </View>
            <Calendar size={24} color="white" />
          </View>

          <View style={[styles.statCard, { backgroundColor: '#8B5CF6' }]}>
            <View>
              <Text style={styles.statLabel}>Toplam Öğrenci</Text>
              <Text style={styles.statValue}>{dailyStats.totalStudents}</Text>
            </View>
            <Users size={24} color="white" />
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F59E0B' }]}>
            <View>
              <Text style={styles.statLabel}>Katılım Oranı</Text>
              <Text style={styles.statValue}>%{dailyStats.attendanceRate}</Text>
            </View>
            <Activity size={24} color="white" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <Text style={styles.sectionSubtitle}>
            Sık kullanılan işlemlere hızlı erişim için burger menüyü kullanın
          </Text>
          
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.quickActionCard}
                  onPress={() => router.push(action.route)}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}10` }]}>
                    <Icon size={24} color={action.color} />
                  </View>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionDescription}>{action.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
          <View style={styles.activitiesList}>
            {recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[styles.activityIndicator, { backgroundColor: activity.color }]} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityMessage}>{activity.message}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Yardım</Text>
          <Text style={styles.helpText}>
            Sağ üst köşedeki menü butonunu kullanarak tüm yönetim işlemlerine erişebilirsiniz.
          </Text>
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
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 16,
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
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
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
    margin: 16,
    borderRadius: 12,
    padding: 20,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  activitiesList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  helpSection: {
    backgroundColor: '#EFF6FF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});