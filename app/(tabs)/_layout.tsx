import { Tabs } from 'expo-router';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { BarChart3, Calendar, User, Menu } from 'lucide-react-native';
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
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
            position: 'absolute',
            bottom: 40, // Move tabs up to make room for footer
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
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  registered: {
    fontSize: 8,
    verticalAlign: 'top',
    marginLeft: 1,
  },
});