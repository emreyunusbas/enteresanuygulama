import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Menu, X, Users, BookOpen, Calendar, Database, Award, TrendingUp } from 'lucide-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

function CustomDrawerContent() {
  const navigation = useNavigation();
  const { currentUser } = useContext(UserContext);

  const closeDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

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
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
          <X size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text style={styles.drawerTitle}>Yönetim Paneli</Text>
        <Text style={styles.drawerSubtitle}>Hoş geldin, {currentUser?.name}</Text>
      </View>

      <View style={styles.menuList}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate(item.route);
                closeDrawer();
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${item.color}10` }]}>
                <Icon size={20} color={item.color} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function AdminLayout() {
  return (
    <Drawer
      drawerContent={() => <CustomDrawerContent />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4F46E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerPosition: 'right',
        drawerStyle: {
          width: 320,
          backgroundColor: '#F9FAFB',
        },
        headerRight: ({ navigation }) => (
          <TouchableOpacity
            style={styles.burgerButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Menu size={24} color="#fff" />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen 
        name="index" 
        options={{ 
          title: 'Yönetim Paneli',
          drawerItemStyle: { display: 'none' }
        }} 
      />
      <Drawer.Screen 
        name="instructors" 
        options={{ 
          title: 'Eğitmenler',
          drawerItemStyle: { display: 'none' }
        }} 
      />
      <Drawer.Screen 
        name="students" 
        options={{ 
          title: 'Öğrenciler',
          drawerItemStyle: { display: 'none' }
        }} 
      />
      <Drawer.Screen 
        name="classes" 
        options={{ 
          title: 'Dersler',
          drawerItemStyle: { display: 'none' }
        }} 
      />
      <Drawer.Screen 
        name="data-management" 
        options={{ 
          title: 'Veri Yönetimi',
          drawerItemStyle: { display: 'none' }
        }} 
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  burgerButton: {
    marginRight: 16,
    padding: 8,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  drawerHeader: {
    backgroundColor: '#4F46E5',
    padding: 24,
    paddingTop: 60,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  drawerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuList: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
});