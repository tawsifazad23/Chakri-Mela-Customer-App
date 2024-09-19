import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './HomeScreen';
import Messages from './Messages';
import Confirmation from './Confirmation';
import Requests from './Requests';
import RequestDetails from '../RequestDetails';
import TripDetails from '../TripDetails';
import ChatScreen from '../ChatScreen'; 
import ProfileScreen from '../Profile';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import LoginScreen from './index';  // Assuming this is the correct path
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function RequestsStack() {
  return (
    <Stack.Navigator initialRouteName="Requests">
    <Stack.Screen name="Requests" component={Requests} />
    <Stack.Screen name="RequestDetails" component={RequestDetails} options={{ headerBackTitle: 'Back' }} />
  </Stack.Navigator>
  );
}

function ConfirmationStack() {
  return (
    <Stack.Navigator initialRouteName="Confirmation">
      <Stack.Screen name="Confirmation" component={Confirmation} />
      <Stack.Screen name="TripDetails" component={TripDetails} />
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator initialRouteName="Messages">
      <Stack.Screen name="Messages" component={Messages} />
      <Stack.Screen 
        name="ChatScreen" 
        component={ChatScreen} 
        options={({ route }) => ({ title: route.params.chat.name })} 
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerBackTitle: 'Back' }} />
    </Stack.Navigator>
  );
}

function LogOutStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="index" component={LoginScreen} />
      <Stack.Screen name="profile" component={ProfileScreen} />
      {/* Add other screens here */}
    </Stack.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Explore') {
                iconName = 'search';
              } else if (route.name === 'Messages') {
                iconName = 'chat';
              } else if (route.name === 'Confirmation') {
                iconName = 'check-circle';
              }

              return <TabBarIcon name={iconName} color={color} size={size} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: Colors[scheme].tint,
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Messages" component={MessagesStack} />
          <Tab.Screen name="Explore" component={RequestsStack} />
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Confirmation" component={ConfirmationStack} />
          <Tab.Screen name="Logout" component={LogOutStack} />
        </Tab.Navigator>
      </NavigationContainer>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </GestureHandlerRootView>
  );
}
