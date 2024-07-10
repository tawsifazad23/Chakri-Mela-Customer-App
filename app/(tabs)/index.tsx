// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from './HomeScreen';
// import Messages from './Messages';
// import Confirmation from './confirmation';
// import Requests from './Requests';
// import DriverDetails from '../DriverDetails';
// import TripDetails from '../TripDetails';
// import ChatScreen from '../ChatScreen';  // Ensure ChatScreen is imported
// import { TabBarIcon } from '@/components/navigation/TabBarIcon';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { Colors } from '@/constants/Colors';
// import { DefaultTheme, DarkTheme } from '@react-navigation/native';
// import Toast from 'react-native-toast-message';

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// function RequestsStack() {
//   return (
//     <Stack.Navigator initialRouteName="Requests">
//       <Stack.Screen name="Requests" component={Requests} />
//       <Stack.Screen name="DriverDetails" component={DriverDetails} />
//     </Stack.Navigator>
//   );
// }

// function ConfirmationStack() {
//   return (
//     <Stack.Navigator initialRouteName="Confirmation">
//       <Stack.Screen name="Confirmation" component={Confirmation} />
//       <Stack.Screen name="TripDetails" component={TripDetails} />
//     </Stack.Navigator>
//   );
// }

// function MessagesStack() {
//   return (
//     <Stack.Navigator initialRouteName="Messages">
//       <Stack.Screen name="Messages" component={Messages} />
//       <Stack.Screen name="ChatScreen" component={ChatScreen} />
//     </Stack.Navigator>
//   );
// }

// export default function App() {
//   const scheme = useColorScheme();

//   return (
//     <>
//       <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
//         <Tab.Navigator
//           screenOptions={({ route }) => ({
//             tabBarIcon: ({ color, size }) => {
//               let iconName;

//               if (route.name === 'Home') {
//                 iconName = 'home';
//               } else if (route.name === 'Explore') {
//                 iconName = 'search';
//               } else if (route.name === 'Messages') {
//                 iconName = 'chat';
//               } else if (route.name === 'Confirmation') {
//                 iconName = 'check-circle';
//               }

//               return <TabBarIcon name={iconName} color={color} size={size} />;
//             },
//           })}
//           tabBarOptions={{
//             activeTintColor: Colors[scheme].tint,
//             inactiveTintColor: 'gray',
//           }}
//         >
//           <Tab.Screen name="Home" component={HomeScreen} />
//           <Tab.Screen name="Explore" component={RequestsStack} />
//           <Tab.Screen name="Messages" component={MessagesStack} />
//           <Tab.Screen name="Confirmation" component={ConfirmationStack} />
//         </Tab.Navigator>
//       </NavigationContainer>
//       <Toast ref={(ref) => Toast.setRef(ref)} />
//     </>
//   );
// }
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import Messages from './Messages';
import Confirmation from './confirmation';
import Requests from './Requests';
import DriverDetails from '../DriverDetails';
import TripDetails from '../TripDetails';
import ChatScreen from '../ChatScreen';  // Ensure ChatScreen is imported
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function RequestsStack() {
  return (
    <Stack.Navigator initialRouteName="Requests">
      <Stack.Screen name="Requests" component={Requests} />
      <Stack.Screen name="DriverDetails" component={DriverDetails} />
    </Stack.Navigator>
  );
}

function ConfirmationStack() {
  return (
    <Stack.Navigator initialRouteName="Confirmation">
      <Stack.Screen name="Confirmation" component={Confirmation} />
      <Stack.Screen name="TripDetails" component={TripDetails} />
    </Stack.Navigator>);
}

function MessagesStack() {
  return (
    <Stack.Navigator initialRouteName="Messages">
      <Stack.Screen name="Messages" component={Messages} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();

  return (
    <>
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
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Explore" component={RequestsStack} />
          <Tab.Screen name="Messages" component={MessagesStack} />
          <Tab.Screen name="Confirmation" component={ConfirmationStack} />
        </Tab.Navigator>
      </NavigationContainer>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}



