import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JobDetail() {
  const route = useRoute();
  const { job } = route.params;
  const navigation = useNavigation();

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No token found, please log in again.');
        navigation.replace('Login');
        return;
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/delete_job_posting/${job.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Alert.alert('Success', 'Job posting deleted successfully!');
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to delete job posting.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Job Detail</Text>
      </View>
      <View style={styles.card}>
        <ImageBackground 
          source={require('/Users/tawsifibneazad/Documents/Kormo Mela/firstapp/firstreactapp/assets/images/driverq.jpg')} 
          style={styles.image} 
          onError={() => Alert.alert('Error', 'Image not found')}
        >
          <View style={styles.overlay}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{job.service_type}</Text>
              <Text style={styles.period}>{job.service_period}</Text>
              <Text style={styles.rate}>{job.service_rate} Taka</Text>
              <Text style={styles.location}>{job.onboarding_location}</Text>
              <Text style={styles.summary}>{job.job_summary}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleDelete}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#000',
  },
  card: {
    flex: 2,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 500,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Darker overlay for better text visibility
    padding: 25,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  textContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.7)', // Adding text shadow for better visibility
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  period: {
    fontSize: 18,
    color: '#ddd',
    marginBottom: 8,
    fontWeight: 'bold',  // Increased font weight
  },
  rate: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
    fontWeight: 'bold',  // Increased font weight
  },
  location: {
    fontSize: 18,
    color: '#ddd',
    marginBottom: 8,
    fontWeight: 'bold',  // Increased font weight
  },
  summary: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 12,
    lineHeight: 24,
    fontWeight: 'bold',  // Increased font weight
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    backgroundColor: '#ff4d4d',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
