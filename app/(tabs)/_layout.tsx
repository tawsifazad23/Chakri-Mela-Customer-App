// firstreactapp/app/(tabs)/_layout.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import Messages from './Messages';
import Confirmation from './Confirmation';
import Requests from './Requests';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: isDarkTheme ? '#FFF' : '#000',
        tabBarInactiveTintColor: isDarkTheme ? '#888' : '#888',
        tabBarStyle: {
          backgroundColor: isDarkTheme ? '#000' : '#FFF',
          borderTopColor: isDarkTheme ? '#333' : '#EEE',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" color={color} size={size || 20} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={Requests}
        options={{
          title: 'Requests',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="paper-plane" color={color} size={size || 20} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="envelope" color={color} size={size || 20} />
          ),
        }}
      />
      <Tab.Screen
        name="Confirmation"
        component={Confirmation}
        options={{
          title: 'Confirmation',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="check-circle" color={color} size={size || 20} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
