import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#4F46E5',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Yönetim Paneli',
        }} 
      />
      <Stack.Screen 
        name="instructors" 
        options={{ 
          title: 'Eğitmenler',
        }} 
      />
      <Stack.Screen 
        name="students" 
        options={{ 
          title: 'Öğrenciler',
        }} 
      />
      <Stack.Screen 
        name="classes" 
        options={{ 
          title: 'Dersler',
        }} 
      />
      <Stack.Screen 
        name="data-management" 
        options={{ 
          title: 'Veri Yönetimi',
        }} 
      />
    </Stack>
  );
}