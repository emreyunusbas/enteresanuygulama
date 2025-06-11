import { Tabs } from 'expo-router';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { BarChart3, Calendar, User, Menu, LogOut } from 'lucide-react-native';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigation = useNavigation();
  const router = useRouter();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleLogout = () => {
    setCurrentUser(null);
    router.replace('/');
  };

  // Admin kullanıcısı için sekmeleri gizle
  if (currentUser?.role === 'admin') {
    return (
      <View style={styles.adminContainer}>
        <View style={styles.adminHeader}>
          <Text style={styles.adminTitle}>Admin Paneli</Text>
          <TouchableOpacity
            style={styles.adminLogoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color="white" />
            <Text style={styles.adminLogoutText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.adminContent}>
          <Text style={styles.adminMessage}>
            Admin paneline yönlendiriliyorsunuz...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#4F46E5',
            borderTopWidth: 0,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
            position: 'absolute',
            bottom: 40, // Move tabs up to make room for footer
          },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)'
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Ana Sayfa',
            tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="classes"
          options={{
            title: 'Dersler',
            tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />
          }}
        />
      </Tabs>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Designed by Ubey Solutions<Text style={styles.registered}>®</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  adminContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  adminHeader: {
    backgroundColor: '#4F46E5',
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  adminLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  adminLogoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  adminContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  adminMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0,
  },
  footerText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  registered: {
    fontSize: 8,
    verticalAlign: 'top',
    marginLeft: 1,
    color: '#ffffff',
  },
});