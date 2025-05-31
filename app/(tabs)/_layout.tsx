import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { BarChart3, Calendar, CreditCard, User, Menu, Settings } from 'lucide-react-native';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { DrawerActions, useNavigation } from '@react-navigation/native';

export default function TabLayout() {
  const { currentUser } = useContext(UserContext);
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: 'white',
        },
        headerRight: () => 
          currentUser?.role === 'admin' ? (
            <TouchableOpacity 
              onPress={openDrawer}
              style={{ padding: 12 }}
            >
              <Menu size={24} color="#4B5563" />
            </TouchableOpacity>
          ) : null,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280'
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
        name="payments"
        options={{
          title: 'Ödemeler',
          tabBarIcon: ({ color, size }) => <CreditCard size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />
        }}
      />
      {currentUser?.role === 'admin' && (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Yönetim',
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />
          }}
        />
      )}
    </Tabs>
  );
}