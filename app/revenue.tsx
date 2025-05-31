import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart3, TrendingUp, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

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

const yearlyRevenue = {
  total: 7845600,
  netTotal: 6276480, // %80 net kar
  years: [
    { year: '2021', amount: 5234500, net: 4187600 },
    { year: '2022', amount: 6123400, net: 4898720 },
    { year: '2023', amount: 6987300, net: 5589840 },
    { year: '2024', amount: 7456200, net: 5964960 },
    { year: '2025', amount: 7845600, net: 6276480 }
  ],
  categories: {
    pilatesBasic: 2845000,
    pilatesAdvanced: 2198450,
    yoga: 1856000,
    personalTraining: 946150
  }
};

export default function RevenueScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <BarChart3 size={24} color="#8B5CF6" />
            <Text style={styles.title}>Ciro Analizi</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <X size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yıllık Ciro</Text>
          <View style={styles.yearlyTotals}>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Brüt Ciro</Text>
              <Text style={styles.totalAmount}>₺{yearlyRevenue.total.toLocaleString()}</Text>
            </View>
            <View style={[styles.totalCard, styles.netTotalCard]}>
              <Text style={styles.totalLabel}>Net Ciro</Text>
              <Text style={[styles.totalAmount, styles.netAmount]}>
                ₺{yearlyRevenue.netTotal.toLocaleString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.chart}>
            {yearlyRevenue.years.map((yearData, index) => (
              <View key={yearData.year} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar,
                      { 
                        height: `${(yearData.amount / 8000000) * 100}%`,
                        backgroundColor: index === 4 ? '#8B5CF6' : '#CBD5E1'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{yearData.year}</Text>
                <Text style={styles.barAmount}>₺{(yearData.amount / 1000000).toFixed(1)}M</Text>
                <Text style={styles.netBarAmount}>Net: ₺{(yearData.net / 1000000).toFixed(1)}M</Text>
              </View>
            ))}
          </View>

          <View style={styles.categoryBreakdown}>
            <Text style={styles.breakdownTitle}>Yıllık Kategori Dağılımı</Text>
            <View style={styles.categories}>
              {Object.entries(yearlyRevenue.categories).map(([category, amount]) => (
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
                        { width: `${(amount / yearlyRevenue.total) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.categoryPercentage}>
                    {((amount / yearlyRevenue.total) * 100).toFixed(1)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Haftalık Ciro</Text>
          <Text style={styles.totalAmount}>
            ₺{weeklyRevenue.total.toLocaleString()}
          </Text>
          
          <View style={styles.chart}>
            {weeklyRevenue.days.map((day, index) => (
              <View key={day.day} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar,
                      { height: `${(day.amount / 40000) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{day.day.slice(0, 3)}</Text>
                <Text style={styles.barAmount}>₺{day.amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aylık Ciro</Text>
          <Text style={styles.totalAmount}>
            ₺{monthlyRevenue.total.toLocaleString()}
          </Text>
          
          <View style={styles.chart}>
            {monthlyRevenue.months.map((month, index) => (
              <View key={month.month} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar,
                      { 
                        height: `${(month.amount / 700000) * 100}%`,
                        backgroundColor: index === 4 ? '#8B5CF6' : '#CBD5E1'
                      }
                    ]} 
                  />
                </View>
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
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
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
  yearlyTotals: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  totalCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  netTotalCard: {
    backgroundColor: '#F0FDF4',
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  netAmount: {
    color: '#059669',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    marginBottom: 32,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    width: '60%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    backgroundColor: '#8B5CF6',
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  barAmount: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  netBarAmount: {
    fontSize: 10,
    color: '#059669',
    marginTop: 2,
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