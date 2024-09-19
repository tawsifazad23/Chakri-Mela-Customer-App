import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TripDetails() {
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const hiringId = route.params.hiringId;

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/trip-details/${hiringId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTripDetails(data);
        } else {
          const errorData = await response.json();
          Alert.alert('Error', errorData.message || 'Failed to fetch trip details.');
        }
      } catch (error) {
        console.error('Error fetching trip details:', error);
        Alert.alert('Error', 'An error occurred while fetching trip details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [hiringId]);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    const options = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  const formatServicePeriod = (servicePeriodString) => {
    if (!servicePeriodString) return 'N/A';
    const [start, end] = servicePeriodString.split(' - ');
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedStart = startDate.toLocaleDateString('en-GB', options);
    const formattedEnd = endDate.toLocaleDateString('en-GB', options);
    return `${formattedStart} to ${formattedEnd}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!tripDetails) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorMessage}>No trip details available. Please try again later.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>Job Posting Details</Text>
          <View style={styles.detailContainer}>
            <FontAwesome name="wrench" size={24} color="black" />
            <Text style={styles.value}>{tripDetails.jobPosting?.serviceType || 'N/A'}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Ionicons name="calendar" size={24} color="black" />
            <Text style={styles.value}>{formatServicePeriod(tripDetails.jobPosting?.servicePeriod)}</Text>
          </View>
          <View style={styles.detailContainer}>
            <FontAwesome name="money" size={24} color="black" />
            <Text style={styles.value}>{tripDetails.jobPosting?.serviceRate || 'N/A'}</Text>
          </View>
          <View style={styles.detailContainer}>
            <MaterialIcons name="location-on" size={24} color="black" />
            <Text style={styles.value}>{tripDetails.jobPosting?.onboardingLocation || 'N/A'}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Ionicons name="information-circle" size={24} color="black" />
            <Text style={styles.value}>{tripDetails.jobPosting?.jobSummary || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>Transaction Details</Text>
          <View style={styles.detailContainer}>
            <FontAwesome name="money" size={24} color="black" />
            <Text style={styles.value}>{tripDetails.transaction?.rate || 'N/A'}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Ionicons name="time" size={24} color="black" />
            <Text style={styles.value}>{formatDateTime(tripDetails.transaction?.datetime)}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Ionicons name="card" size={24} color="black" />
            <Text style={styles.value}>{tripDetails.transaction?.paymentMethod || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 18,
    color: 'black',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  value: {
    fontSize: 16,
    marginLeft: 16,
    color: '#555',
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    marginTop: 20,
  },
});
