import { Tabs } from 'expo-router';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { BarChart3, Calendar, User, Menu, LogOut } from 'lucide-react-native';
import { useContext, useEffect } from 'react';
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

  // Admin kullanıcısı için otomatik yönlendirme
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      const timer = setTimeout(() => {
        router.replace('/admin');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentUser, router]);

  // Admin kullanıcısı için sekmeleri gizle ve yönlendirme ekranı göster
  if (currentUser?.role === 'admin') {
    return null; // Admin için hiçbir şey render etme, yönlendirme otomatik olacak
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