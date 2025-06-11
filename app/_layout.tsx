import { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { UserProvider } from './context/UserContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { DataProvider } from './context/DataContext';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';

function DrawerContent() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const router = useRouter();
  const isAdmin = currentUser?.role === 'admin';
  const isInstructor = currentUser?.role === 'instructor';

  const handleLogout = () => {
    setCurrentUser(null);
    router.replace('/');
  };

  return (
    <Drawer 
      screenOptions={{ 
        headerShown: false,
        headerRight: () => (
          isAdmin ? (
            <TouchableOpacity
              style={styles.headerLogoutButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color="white" />
              <Text style={styles.headerLogoutText}>Çıkış</Text>
            </TouchableOpacity>
          ) : null
        )
      }}
    >
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          drawerLabel: 'Ana Sayfa',
          drawerItemStyle: { 
            display: !isAdmin ? 'flex' : 'none'
          }
        }} 
      />
      <Drawer.Screen 
        name="admin" 
        options={{ 
          drawerLabel: 'Admin Paneli',
          drawerItemStyle: { 
            display: isAdmin ? 'flex' : 'none'
          }
        }} 
      />
      <Drawer.Screen 
        name="performance" 
        options={{ 
          drawerLabel: 'Eğitmen Performansı',
          drawerItemStyle: { 
            display: (isAdmin || isInstructor) ? 'flex' : 'none'
          }
        }} 
      />
      <Drawer.Screen 
        name="student-performance" 
        options={{ 
          drawerLabel: 'Öğrenci Performansı',
          drawerItemStyle: { 
            display: isAdmin ? 'flex' : 'none'
          }
        }} 
      />
      <Drawer.Screen 
        name="attendance-history" 
        options={{ 
          drawerLabel: 'Katılım Geçmişi',
          drawerItemStyle: { 
            display: (isAdmin || isInstructor) ? 'flex' : 'none'
          }
        }} 
      />
      <Drawer.Screen 
        name="revenue" 
        options={{ 
          drawerLabel: 'Ciro Analizi',
          drawerItemStyle: { 
            display: isAdmin ? 'flex' : 'none'
          }
        }} 
      />
      <Drawer.Screen name="+not-found" options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <DataProvider>
      <UserProvider>
        <AttendanceProvider>
          <DrawerContent />
          <StatusBar style="light" backgroundColor="#4F46E5" />
        </AttendanceProvider>
      </UserProvider>
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  headerLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 16,
    gap: 6,
  },
  headerLogoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});