import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Trips() {
  const [trips, setTrips] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchTrips = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (!token) {
            throw new Error('No token found');
          }

          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/customer_trips/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();

            // Sort the upcoming trips by the number of days remaining
            const sortedUpcoming = data.upcoming.sort((a, b) => a.daysToGo - b.daysToGo);

            setTrips({ upcoming: sortedUpcoming, past: data.past });
          } else {
            console.error('Failed to fetch trips:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching trips:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTrips(); // Fetch trips when the screen is focused

      return () => {
        setLoading(true); // Reset loading state when leaving the screen
      };
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Upcoming Trips */}
        <Text style={styles.heading}>Upcoming Trips</Text>
        {trips.upcoming.length > 0 ? (
          trips.upcoming.map((trip) => (
            <View key={trip.id} style={styles.cardVertical}>
              <View style={styles.tripHeader}>
                <Image source={{ uri: trip.driverProfilePic }} style={styles.profilePicLarge} />
                <View style={styles.tripInfo}>
                  <Text style={styles.daysToGo}>
                    {trip.daysToGo} more days to go
                  </Text>
                  <Text style={styles.driverName}>{trip.driverName}</Text>
                </View>
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('TripDetails', { hiringId: trip.id })}
                >
                  <Ionicons name="information-circle-outline" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('Messages', { hiringId: trip.id })}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noTripsText}>No upcoming trips.</Text>
        )}

        {/* Completed Trips */}
        <Text style={styles.heading}>Completed Trips</Text>
        {trips.past.length > 0 ? (
          trips.past.map((trip) => (
            <View key={trip.id} style={styles.cardRow}>
              <Image source={{ uri: trip.driverProfilePic }} style={styles.profilePicSmall} />
              <View style={styles.tripDetailsRow}>
                <Text style={styles.driverNameRow}>{trip.driverName}</Text>
                <Text style={styles.servicePeriod}>{trip.servicePeriod}</Text>
              </View>
              <TouchableOpacity
                style={styles.iconButtonRow}
                onPress={() => navigation.navigate('TripDetails', { hiringId: trip.id })}
              >
                <Ionicons name="information-circle-outline" size={24} color="#000" />
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
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingVertical: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
    marginLeft:12,
  },
  noTripsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 16,
  },
  cardVertical: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 24, // Increased margin on the left and right
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tripInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
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
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  daysToGo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B99C2', // Changed to a less bright color
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  iconButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  tripDetailsRow: {
    flex: 1,
    marginLeft: 16,
  },
  servicePeriod: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  iconButtonRow: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
});
