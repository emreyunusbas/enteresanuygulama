import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Users, BookOpen, Calendar, Award, TrendingUp, Database } from 'lucide-react-native';

export default function AdminPanel() {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Veri Yönetimi',
      description: 'Öğrenci, eğitmen ve ders bilgilerini yönetin',
      icon: Database,
      route: '/admin/data-management',
      color: '#EC4899'
    },
    {
      title: 'Eğitmenler',
      description: 'Eğitmen yönetimi ve performans takibi',
      icon: Users,
      route: '/admin/instructors',
      color: '#3B82F6'
    },
    {
      title: 'Öğrenciler',
      description: 'Öğrenci kayıtları ve katılım takibi',
      icon: BookOpen,
      route: '/admin/students',
      color: '#10B981'
    },
    {
      title: 'Dersler',
      description: 'Ders programı ve kapasite yönetimi',
      icon: Calendar,
      route: '/admin/classes',
      color: '#8B5CF6'
    },
    {
      title: 'Performans',
      description: 'Eğitmen ve öğrenci performans analizi',
      icon: Award,
      route: '/performance',
      color: '#F59E0B'
    },
    {
      title: 'Gelir Takibi',
      description: 'Finansal raporlar ve analiz',
      icon: TrendingUp,
      route: '/revenue',
      color: '#EC4899'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
          <Text style={styles.subtitle}>Yönetim panelinizden tüm işlemleri gerçekleştirebilirsiniz.</Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => router.push(item.route)}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}10` }]}>
                  <Icon size={24} color={item.color} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  menuGrid: {
    padding: 16,
    gap: 16,
  },
  menuItem: {
    backgroundColor: 'white',
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  menuDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});