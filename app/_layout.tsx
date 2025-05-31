import { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { UserProvider } from './context/UserContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';

function DrawerContent() {
  const { currentUser } = useContext(UserContext);
  const isAdmin = currentUser?.role === 'admin';
  const isInstructor = currentUser?.role === 'instructor';

  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          drawerLabel: 'Ana Sayfa',
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
            display: isAdmin ? 'flex' : 'none'
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
    <UserProvider>
      <AttendanceProvider>
        <DrawerContent />
        <StatusBar style="auto" />
      </AttendanceProvider>
    </UserProvider>
  );
}