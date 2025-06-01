import { Tabs } from 'expo-router';
import { TouchableOpacity, View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
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
            backgroundColor: '#4F46E5',
            borderTopWidth: 0,
            paddingBottom: 8,
            paddingTop: 8,
            height: Platform.select({
              ios: 80,
              android: 60,
              default: 60
            }),
            position: 'absolute',
            bottom: Platform.select({
              ios: 40,
              android: 24,
              default: 24
            }),
            left: '5%',
            right: '5%',
            borderRadius: 16,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
              },
              android: {
                elevation: 8,
              },
              default: {
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }
            }),
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

const { width } = Dimensions.get('window');

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
    height: Platform.select({
      ios: 40,
      android: 24,
      default: 24
    }),
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0,
    width: '100%',
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: width < 375 ? 10 : 12,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
  },
  registered: {
    fontSize: width < 375 ? 6 : 8,
    verticalAlign: 'top',
    marginLeft: 1,
    color: '#ffffff',
  },
});