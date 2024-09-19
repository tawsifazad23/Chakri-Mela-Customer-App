import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); // Ignore all log notifications

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
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Chat deleted successfully!',
          visibilityTime: 4000,
        });
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
          <View style={styles.infoContainer}>
            <Ionicons name="document-text" size={20} color="black" style={styles.icon} />
            <Text style={styles.label}>Job Summary:</Text>
            <Text style={styles.value}>{tripInfo.job_summary}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, isBooked ? styles.bookedButton : styles.bookButton]}
            onPress={handleBook}
            disabled={isBooked || isClosed}
          >
            <Ionicons name="car" size={24} color={isBooked ? '#888' : '#fff'} />
            <Text style={[styles.actionButtonText, { color: isBooked ? '#888' : '#fff' }]}>
              {isBooked ? 'Booked' : 'Book Now'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDeleteConversation}>
            <Ionicons name="trash" size={24} color="#000" />
            <Text style={[styles.actionButtonText, { color: '#000' }]}>Delete Chat</Text>
          </TouchableOpacity>
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
    right: 60,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  driverCard: {
    marginTop: 20,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButton: {
    backgroundColor: '#000',
    marginRight: 10,
  },
  bookedButton: {
    backgroundColor: '#ccc', // Gray color for the booked button
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
  },
  actionButtonText: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  loadingText: {
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
});

export default TripInfo;
