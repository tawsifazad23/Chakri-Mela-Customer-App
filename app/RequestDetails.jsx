
// export default RequestDetails;
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ActivityIndicator, Image, ScrollView, Alert, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video } from 'expo-av';
import moment from 'moment';

const RequestDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { requestId } = route.params;
  const [requestDetails, setRequestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showJobDetails, setShowJobDetails] = useState(false);
  const scrollViewRef = useRef(null);

  const fetchRequestDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setErrorMessage('No token found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/request-details/${requestId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequestDetails(data);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to fetch request details.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setErrorMessage('');
    fetchRequestDetails();
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('D MMM YYYY');
  };

  const formatDateRange = (dateRange) => {
    const [startDate, endDate] = dateRange.split(' - ');
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const toggleJobDetails = () => {
    setShowJobDetails(!showJobDetails);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <Button title="Retry" onPress={handleRetry} />
      </SafeAreaView>
    );
  }

  if (!requestDetails) {
    return (
      <SafeAreaView style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No request details found.</Text>
        <Button title="Retry" onPress={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} ref={scrollViewRef}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Request Details</Text>
        </View>
        <Text style={styles.driverName}>
          {requestDetails.service_provider.first_name} {requestDetails.service_provider.last_name}
        </Text>
        <View style={styles.profileContainer}>
          <View style={styles.profileDetails}>
            <View style={styles.iconWithText}>
              <Ionicons name="star" size={16} color="black" />
              <Text style={styles.iconText}>Rating: {requestDetails.service_provider.rating || 'N/A'}</Text>
            </View>
            <View style={styles.iconWithText}>
              <Ionicons name="briefcase" size={16} color="black" />
              <Text style={styles.iconText}>Years in Industry: {requestDetails.service_provider.years_in_industry}</Text>
            </View>
            <View style={styles.iconWithText}>
              <Ionicons name="car" size={16} color="black" />
              <Text style={styles.iconText}>Vehicle Type: {requestDetails.service_provider.vehicle_type}</Text>
            </View>
            <View style={styles.iconWithText}>
              <Ionicons name="checkmark-circle" size={16} color="black" />
              <Text style={styles.iconText}>App Verified Date: {formatDate(requestDetails.service_provider.app_verified_date)}</Text>
            </View>
          </View>
          <Image
            source={{ uri: requestDetails.service_provider.profile_photo || 'https://dummyimage.com/100x100/000/fff' }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.sectionTitle}>Interview Video</Text>
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: 'https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rCR4u8bygiud1h6sl/business-man-sits-and-talks-to-camera-interview-green-screen-studio_h73bpcn1e__e6185f30f5d958c25ded442ecf294055__P360.mp4' }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            useNativeControls
            style={styles.video}
          />
        </View>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleJobDetails}>
          <Text style={styles.toggleButtonText}>{showJobDetails ? 'Hide' : 'Show'} Job Details</Text>
        </TouchableOpacity>
        {showJobDetails && (
          <View style={styles.jobDetailsContainer}>
            <View style={styles.detailItem}>
              <FontAwesome5 name="id-badge" size={16} color="black" />
              <Text style={styles.jobDetail}>Job ID: {requestDetails.job_posting.id}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <FontAwesome5 name="tools" size={16} color="black" />
              <Text style={styles.jobDetail}>Service Type: {requestDetails.job_posting.service_type}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <FontAwesome5 name="calendar-alt" size={16} color="black" />
              <Text style={styles.jobDetail}>Service Period: {formatDateRange(requestDetails.job_posting.service_period)}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <FontAwesome5 name="money-bill-wave" size={16} color="black" />
              <Text style={styles.jobDetail}>Service Rate: {requestDetails.job_posting.service_rate} ৳</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Ionicons name="location-sharp" size={16} color="black" />
              <Text style={styles.jobDetail}>Location: {requestDetails.job_posting.onboarding_location}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Ionicons name="document-text" size={16} color="black" />
              <Text style={styles.jobDetail}>Summary: {requestDetails.job_posting.job_summary}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <FontAwesome5 name="clock" size={16} color="black" />
              <Text style={styles.jobDetail}>
                Requested On: {formatDate(requestDetails.sent_request_time)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#888',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileDetails: {
    flex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 10,
  },
  driverName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  videoContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  toggleButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  jobDetailsContainer: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  jobDetail: {
    fontSize: 18,
    marginLeft: 10,
  },
});

export default RequestDetails;
