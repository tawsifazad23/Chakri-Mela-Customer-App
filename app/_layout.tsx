// RootLayout.js
import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false, // Hide header by default for all screens
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/HomeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="JobPostings" options={{ title: 'Job Postings' }} />
      <Stack.Screen name="JobDetail" options={{ title: 'Job Detail' }} />
      <Stack.Screen name="(tabs)/Requests" options={{ title: 'Requests' }} />
      <Stack.Screen name="RequestDetails" options={{ title: 'Request Details' }} />
    </Stack>
  );
}
