import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const TripInfo = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { conversation } = route.params;
  const [tripInfo, setTripInfo] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooked, setIsBooked] = useState(false); // Track booking status
  const [isClosed, setIsClosed] = useState(false); // Track if the job posting is closed

  useEffect(() => {
    const fetchTripInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'No token found');
          return;
        }

        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/user/trip-info/${conversation.id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.status === 200) {
          setTripInfo(response.data.trip);
          setDriverInfo(response.data.driver);
          setIsBooked(response.data.trip.is_booked); // Set booking status
          setIsClosed(response.data.trip.status === 'closed'); // Check if the job is closed
        } else {
          Alert.alert('Error', 'Failed to fetch trip info');
        }
      } catch (error) {
        console.error("Error fetching trip info:", error);
        Alert.alert('Error', 'Failed to fetch trip info');
      } finally {
        setLoading(false);
      }
    };

    fetchTripInfo();
  }, [conversation.id]);

  const handleDeleteConversation = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }

      const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/api/user/delete-chat/${conversation.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Chat deleted successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to delete chat');
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      Alert.alert('Error', 'Failed to delete chat');
    }
  };

  const handleBook = async () => {
    try {
        setLoading(true);
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'No token found');
          return;
        }

        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/user/book-trip/${conversation.id}/`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.status === 200) {
          setIsBooked(true); // Set booked status to true
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Booking confirmed!',
            visibilityTime: 4000,
          });
        } else {
          Alert.alert('Error', 'Failed to confirm booking');
        }
    } catch (error) {
        if (error.response && error.response.data.message) {
          Alert.alert('Error', error.response.data.message);
        } else {
          console.error("Error confirming booking:", error);
          Alert.alert('Error', 'Failed to confirm booking');
        }
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!tripInfo || !driverInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>No trip information available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip and Driver Info</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.driverCard}>
          <View style={styles.driverInfoContainer}>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{driverInfo.first_name} {driverInfo.last_name}</Text>
              <View style={styles.infoItem}>
                <Ionicons name="star" size={20} color="black" />
                <Text style={styles.infoText}>Rating: {driverInfo.rating}</Text>
              </View>
              <View style={styles.infoItem}>
                <FontAwesome5 name="industry" size={20} color="black" />
                <Text style={styles.infoText}>Years in Industry: {driverInfo.years_in_industry}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="car" size={20} color="black" />
                <Text style={styles.infoText}>Vehicle Type: {driverInfo.vehicle_type}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="checkmark-circle" size={20} color="black" />
                <Text style={styles.infoText}>App Verified: {driverInfo.app_verified_date}</Text>
              </View>
            </View>
            {driverInfo.profile_photo ? (
              <Image
                source={{ uri: driverInfo.profile_photo }}
                style={styles.profileImage}
                onError={(error) => {
                  console.error("Error loading image:", error.nativeEvent.error);
                  Alert.alert('Image Load Error', 'Failed to load the profile picture.');
                }}
                onLoad={() => console.log("Image loaded successfully:", driverInfo.profile_photo)}
              />
            ) : (
              <Ionicons name="person-circle" size={80} color="gray" style={styles.profileImagePlaceholder} />
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Trip Information</Text>
          <View style={styles.infoContainer}>
            <Ionicons name="id-card" size={20} color="black" style={styles.icon} />
            <Text style={styles.label}>Trip ID:</Text>
            <Text style={styles.value}>{tripInfo.id}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Ionicons name="construct" size={20} color="black" style={styles.icon} />
            <Text style={styles.label}>Service Type:</Text>
            <Text style={styles.value}>{tripInfo.service_type}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Ionicons name="time" size={20} color="black" style={styles.icon} />
            <Text style={styles.label}>Service Period:</Text>
            <Text style={styles.value}>{tripInfo.service_period}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Ionicons name="cash" size={20} color="black" style={styles.icon} />
            <Text style={styles.label}>Service Rate:</Text>
            <Text style={styles.value}>{tripInfo.service_rate}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Ionicons name="location" size={20} color="black" style={styles.icon} />
            <Text style={styles.label}>Onboarding Location:</Text>
            <Text style={styles.value}>{tripInfo.onboarding_location}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isClosed ? (
            <View style={[styles.bookButton, { backgroundColor: 'gray' }]}>
              <Ionicons name="close-circle" size={24} color="#fff" />
              <Text style={styles.bookButtonText}>Closed</Text>
            </View>
          ) : (
            isBooked ? (
              <View style={[styles.bookButton, { backgroundColor: 'gray' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.bookButtonText}>Booked</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
                <Ionicons name="car" size={24} color="#fff" />
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: 'black',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  driverCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  infoText: {
    marginLeft: 8,
    color: 'black',
    fontSize: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 10,
  },
  profileImagePlaceholder: {
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontWeight: 'bold',
    color: 'black',
    marginRight: 10,
    flex: 1,
  },
  value: {
    flex: 2,
    color: 'black',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 10,
  },
  bookButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default TripInfo;

