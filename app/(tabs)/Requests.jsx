import * as React from 'react';
import { StyleSheet, View, Text, Image, Button, ScrollView, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const dummyDrivers = [
  {
    id: '1',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    name: 'Rahim Uddin',
    rating: 4.5,
    location: 'Dhaka',
    tripName: 'Trip to Cox\'s Bazar',
    experienceYears: 5,
  },
  {
    id: '2',
    profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
    name: 'Kamal Hossain',
    rating: 4.0,
    location: 'Chittagong',
    tripName: 'Trip to Sylhet',
    experienceYears: 3,
  },
  {
    id: '3',
    profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
    name: 'Jamal Ahmed',
    rating: 4.7,
    location: 'Khulna',
    tripName: 'Trip to Sundarbans',
    experienceYears: 7,
  },
  {
    id: '4',
    profilePicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    name: 'Salam Khan',
    rating: 4.2,
    location: 'Rajshahi',
    tripName: 'Trip to Rangpur',
    experienceYears: 4,
  },
  {
    id: '5',
    profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg',
    name: 'Hafizur Rahman',
    rating: 4.3,
    location: 'Barisal',
    tripName: 'Trip to Kuakata',
    experienceYears: 6,
  },
  {
    id: '6',
    profilePicture: 'https://randomuser.me/api/portraits/men/6.jpg',
    name: 'Shafiqul Islam',
    rating: 4.1,
    location: 'Sylhet',
    tripName: 'Trip to Jaflong',
    experienceYears: 5,
  },
  {
    id: '7',
    profilePicture: 'https://randomuser.me/api/portraits/men/7.jpg',
    name: 'Nazmul Haque',
    rating: 4.6,
    location: 'Dhaka',
    tripName: 'Trip to Bandarban',
    experienceYears: 8,
  },
  {
    id: '8',
    profilePicture: 'https://randomuser.me/api/portraits/men/8.jpg',
    name: 'Faruq Mia',
    rating: 4.0,
    location: 'Mymensingh',
    tripName: 'Trip to Gazipur',
    experienceYears: 2,
  },
  {
    id: '9',
    profilePicture: 'https://randomuser.me/api/portraits/men/9.jpg',
    name: 'Habib Ullah',
    rating: 4.4,
    location: 'Comilla',
    tripName: 'Trip to Feni',
    experienceYears: 4,
  },
];

const DriverCard = ({ driver }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('DriverDetails', { driver })}>
      <View style={styles.card}>
        <Image source={{ uri: driver.profilePicture }} style={styles.profilePicture} />
        <View style={styles.infoContainer}>
          <Text style={styles.driverName}>{driver.name}</Text>
          <Text>Rating: {driver.rating}</Text>
          <Text>Location: {driver.location}</Text>
          <Text>Trip: {driver.tripName}</Text>
          <Text>Experience: {driver.experienceYears} years</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Accept" onPress={() => Alert.alert('Request Accepted')} />
          <Button title="Decline" onPress={() => Alert.alert('Request Declined')} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function Requests() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Driver Requests</ThemedText>
        </ThemedView>
        <ThemedText style={styles.description}>
          The following drivers have responded to you. Confirm at your earliest convenience to secure the service provider.
        </ThemedText>
        {dummyDrivers.map((driver) => (
          <DriverCard key={driver.id} driver={driver} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    alignSelf: 'center',
  },
  description: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  infoContainer: {
    alignItems: 'center',
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});
