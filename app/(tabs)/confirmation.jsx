import * as React from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView, SafeAreaView } from 'react-native';

const trips = {
  upcoming: [
    {
      id: 1,
      driverName: 'John Doe',
      driverProfilePic: 'https://via.placeholder.com/100', // Replace with actual image URL
      daysToGo: 5,
      destination: 'New York',
    },
    {
      id: 2,
      driverName: 'Jane Smith',
      driverProfilePic: 'https://via.placeholder.com/100', // Replace with actual image URL
      daysToGo: 10,
      destination: 'Los Angeles',
    },
    {
      id: 3,
      driverName: 'Mike Johnson',
      driverProfilePic: 'https://via.placeholder.com/100', // Replace with actual image URL
      daysToGo: 15,
      destination: 'Chicago',
    },
  ],
  past: [
    {
      id: 4,
      destination: 'Boston',
      date: '2024-06-15',
    },
    {
      id: 5,
      destination: 'Miami',
      date: '2024-05-20',
    },
    {
      id: 6,
      destination: 'San Francisco',
      date: '2024-04-30',
    },
  ],
};

export default function Confirmation({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>Upcoming Trips</Text>
        {trips.upcoming.map((trip) => (
          <View key={trip.id} style={styles.card}>
            <Image source={{ uri: trip.driverProfilePic }} style={styles.profilePic} />
            <View style={styles.tripDetails}>
              <Text>Driver: {trip.driverName}</Text>
              <Text>Destination: {trip.destination}</Text>
              <Text>Days to go: {trip.daysToGo}</Text>
              <Button
                title="View More Info"
                onPress={() => navigation.navigate('TripDetails', { trip })}
              />
            </View>
          </View>
        ))}

        <Text style={styles.heading}>Past Trips</Text>
        {trips.past.map((trip) => (
          <View key={trip.id} style={[styles.card, styles.pastTripCard]}>
            <View style={styles.tripDetails}>
              <Text>Destination: {trip.destination}</Text>
              <Text>Date: {trip.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16, // Adds padding to the left and right
  },
  contentContainer: {
    paddingHorizontal: 16, // Adds margin to the left and right of the content
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  pastTripCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  tripDetails: {
    flex: 1,
  },
});
