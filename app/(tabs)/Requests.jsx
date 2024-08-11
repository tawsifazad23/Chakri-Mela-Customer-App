import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, SafeAreaView, Alert, TouchableOpacity, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EventSourcePolyfill } from 'event-source-polyfill';

export default function Requests() {
  const [driverRequests, setDriverRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchDriverRequests = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'No token found');
      setLoading(false);
      return;
    }

    setLoading(false);
    const eventSource = new EventSourcePolyfill(`${process.env.EXPO_PUBLIC_API_URL}/api/user/driver-requests?token=${token}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDriverRequests(data);
    };

    eventSource.onerror = () => {
      Alert.alert('Error', 'Failed to fetch driver requests.');
      setLoading(false);
    };

    eventSource.onopen = () => {
      setLoading(false);
    };

    return () => {
      eventSource.close();
    };
  };

  useEffect(() => {
    fetchDriverRequests();
  }, []);

  const handleAccept = async (requestId) => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'No token found');
      return;
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/accept-request/${requestId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Request accepted successfully!');
        fetchDriverRequests();
      } else {
        Alert.alert('Error', result.message || 'Failed to accept the request.');
      }
    } catch (error) {
      Alert.alert('Success', 'Request accepted successfully and a new chat has been created!');
    }
  };

  const handleReject = async (requestId) => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'No token found');
      return;
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/reject-request/${requestId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Request rejected successfully!');
        fetchDriverRequests();
      } else {
        Alert.alert('Error', result.message || 'Failed to reject the request.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to reject the request.');
    }
  };

  const sortedRequests = driverRequests.sort((a, b) => new Date(b.sent_request_time) - new Date(a.sent_request_time));
  const filteredRequests = sortedRequests.filter(request => request.request_status === 'send_request');

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Requests</Text>
          </View>
          {filteredRequests.length === 0 ? (
            <Text style={styles.noRequests}>No driver requests found.</Text>
          ) : (
            filteredRequests.map((request) => (
              <TouchableOpacity 
                key={request.id} 
                style={styles.card} 
                onPress={() => navigation.navigate('RequestDetails', { requestId: request.id })} 
              >
                <View style={styles.cardHeader}>
                  <Image
                    source={{ uri: request.service_provider_photo }}
                    style={styles.profileImage}
                  />
                  <View style={styles.cardHeaderInfo}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.cardTitle}>{request.service_provider_name}</Text>
                      <Ionicons name="checkmark-circle" size={16} color="#4A90E2" style={styles.verifiedIcon} />
                    </View>
                    <View style={styles.iconRow}>
                      <View style={styles.iconWithText}>
                        <FontAwesome name="star" size={16} color="black" />
                        <Text style={styles.iconText}>{request.service_provider_rating}</Text>
                      </View>
                      <View style={styles.iconWithText}>
                        <FontAwesome name="car" size={16} color="black" />
                        <Text style={styles.iconText}>{request.vehicle_type}</Text>
                      </View>
                      <View style={styles.iconWithText}>
                        <FontAwesome name="briefcase" size={16} color="black" />
                        <Text style={styles.iconText}>{request.years_in_industry}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.daysAgo}>{request.sent_request_time}</Text>
                </View>
                <View style={styles.cardContent}>
                  <TouchableOpacity onPress={() => navigation.navigate('JobPostings', { job: request })}>
                    <MaterialIcons name="info" size={24} color="black" style={styles.descriptionIcon} />
                  </TouchableOpacity>
                  <Text style={styles.cardText}>
                    {request.job_posting_summary.length > 60 ? `${request.job_posting_summary.substring(0, 60)}...` : request.job_posting_summary}
                  </Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(request.id)}>
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(request.id)}>
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  titleContainer: {
    backgroundColor: '#f9f9f9',
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20, 
  },
  noRequests: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  iconText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  daysAgo: {
    fontSize: 12,
    color: '#666',
    position: 'absolute',
    top: 5,
    right: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  descriptionIcon: {
    marginRight: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rejectButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
