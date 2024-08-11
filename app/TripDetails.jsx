import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, ActivityIndicator, Alert
} from 'react-native';
import { FontAwesome, MaterialIcons, AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TripDetails({ route }) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const [receiptDetails, setReceiptDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const hiringId = route?.params?.hiringId;

  useEffect(() => {
    if (!hiringId) {
      Alert.alert('Error', 'Hiring ID is not provided.');
      navigation.goBack();  // Navigate back if there's no hiringId
      return;
    }

    const fetchTripDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'No token found');
          return;
        }

        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/user/trip-details/${hiringId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setTripDetails(response.data.trip);
          setReceiptDetails(response.data.receipt);
        } else {
          Alert.alert('Error', 'Failed to fetch trip details');
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
        Alert.alert('Error', 'Failed to fetch trip details. Please check if the hiring ID is correct.');
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [hiringId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!tripDetails || !receiptDetails) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorMessage}>No trip information available. Please try again later.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Trip Details</Text>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Driver:</Text>
          <Text style={styles.value}>{tripDetails.driverName}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Driver License:</Text>
          <Text style={styles.value}>{tripDetails.driverLicense}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Driver Phone:</Text>
          <Text style={styles.value}>{tripDetails.driverPhone}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Driver Rating:</Text>
          <Text style={styles.value}>{tripDetails.driverRating}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Destination:</Text>
          <Text style={styles.value}>{tripDetails.destination}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Rate:</Text>
          <Text style={styles.value}>{tripDetails.rate}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Days to go:</Text>
          <Text style={styles.value}>{tripDetails.daysToGo}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Service Provider Type:</Text>
          <Text style={styles.value}>{tripDetails.serviceProviderType}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Job Summary:</Text>
          <Text style={styles.value}>{tripDetails.jobSummary}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.viewReceiptButton]} onPress={() => setShowReceipt(true)}>
            <FontAwesome name="file-text" size={20} color="white" />
            <Text style={styles.buttonText}>View Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.editTripButton]} onPress={() => {}}>
            <MaterialIcons name="edit" size={20} color="white" />
            <Text style={styles.buttonText}>Edit Trip (Disabled)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.termsButton]} onPress={() => {}}>
            <AntDesign name="infocirlce" size={20} color="white" />
            <Text style={styles.buttonText}>Terms and Conditions</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showReceipt}
          onRequestClose={() => {
            setShowReceipt(!showReceipt);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.receipt}>
              <Text style={styles.receiptHeading}>Payment Receipt</Text>
              <View style={styles.detailContainer}>
                <Text style={styles.label}>Amount:</Text>
                <Text style={styles.value}>{receiptDetails.amount}</Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.label}>Payment Method:</Text>
                <Text style={styles.value}>{receiptDetails.paymentMethod}</Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.label}>Transaction ID:</Text>
                <Text style={styles.value}>{receiptDetails.transactionId}</Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.label}>Payment Date:</Text>
                <Text style={styles.value}>{receiptDetails.paymentDate}</Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.label}>Customer:</Text>
                <Text style={styles.value}>{receiptDetails.customerName}</Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.label}>Service Provider:</Text>
                <Text style={styles.value}>{receiptDetails.serviceProviderName}</Text>
              </View>
              <TouchableOpacity style={[styles.button, styles.printButton]} onPress={() => {}}>
                <Entypo name="printer" size={20} color="white" />
                <Text style={styles.buttonText}>Print Receipt</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={() => setShowReceipt(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Optional: a background color for the safe area
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: 200,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  viewReceiptButton: {
    backgroundColor: '#1e90ff',
    left: 70,
  },
  editTripButton: {
    backgroundColor: '#28a745',
    left: 70,
  },
  termsButton: {
    backgroundColor: '#ff6347',
    left: 70,
  },
  printButton: {
    backgroundColor: '#000',
    alignSelf: 'center',
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#ff6347',
    alignSelf: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  receipt: {
    width: 300,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  receiptHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    marginTop: 20,
  },
});
