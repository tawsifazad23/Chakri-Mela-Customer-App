import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importing FontAwesome5 for car icon
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function Trips() {
  const [trips, setTrips] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken'); // Retrieve the token from AsyncStorage
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/customer_trips/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the headers
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        // If the token is invalid or expired, handle the unauthorized access
        Alert.alert('Session Expired', 'Please log in again.');
        await AsyncStorage.removeItem('authToken');
        navigation.replace('Login'); // Navigate to the login screen
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }

      const data = await response.json();
      setTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>Upcoming</Text>
        {trips.upcoming.length > 0 ? (
          trips.upcoming.map((trip) => (
            <View key={trip.id} style={styles.cardVertical}>
              <View style={styles.profileContainer}>
                <Image source={{ uri: trip.driverProfilePic }} style={styles.profilePicLarge} />
                {trip.serviceProviderType === 'Driver' && (
                  <FontAwesome5 name="car" size={24} color="#666" style={styles.carIcon} />
                )}
              </View>
              <Text style={styles.driverName}>{trip.driverName}</Text>
              <Text style={styles.daysToGo}>{trip.daysToGo} days to go</Text>
              <Text style={styles.serviceRate}>{trip.serviceRate} BDT</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.infoButton}
                  onPress={() => navigation.navigate('TripDetails', { hiringId: trip.id })}
                >
                  <Text style={styles.buttonText}>View Info</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => navigation.navigate('Messages', { hiringId: trip.id })}
                >
                  <Text style={styles.buttonText}>Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noTripsText}>No upcoming trips.</Text>
        )}

        <Text style={styles.heading}>Completed</Text>
        {trips.past.length > 0 ? (
          trips.past.map((trip) => (
            <View key={trip.id} style={styles.cardRow}>
              <Image source={{ uri: trip.driverProfilePic }} style={styles.profilePicSmall} />
              <View style={styles.tripDetailsRow}>
                <Text style={styles.driverNameRow}>{trip.driverName}</Text>
                <Text style={styles.servicePeriod}>{trip.servicePeriod}</Text>
              </View>
              <Text style={styles.serviceRateRow}>{trip.serviceRate} BDT</Text>
              <TouchableOpacity
                style={styles.infoButtonRow}
                onPress={() => navigation.navigate('TripDetails', { hiringId: trip.id })}
              >
                <Text style={styles.buttonTextRow}>View Info</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noTripsText}>No past trips.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  noTripsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 16,
  },
  cardVertical: {
    backgroundColor: '#fff',
    padding: 24,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'column', // Vertical layout for upcoming trips
    alignItems: 'center',
  },
  cardRow: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row', // Row layout for past trips
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // Added margin for spacing
  },
  profilePicLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profilePicSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  carIcon: {
    marginLeft: 8,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  driverNameRow: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  servicePeriod: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  daysToGo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  serviceRate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  serviceRateRow: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 16,
  },
  tripDetailsRow: {
    flex: 1,
    marginLeft: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  infoButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  chatButton: {
    backgroundColor: '#32cd32',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  infoButtonRow: {
    backgroundColor: '#1e90ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonTextRow: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
