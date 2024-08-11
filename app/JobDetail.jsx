import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        Alert.alert('Success', 'Job posting deleted successfully!');
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Job Detail</Text>
      </View>
      <View style={styles.card}>
        <ImageBackground 
          source={require('/Users/tawsifibneazad/firstapp/firstreactapp/assets/images/driverq.jpg')} 
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
    marginTop: 8,
  },
  backButton: {
    marginRight: 16,
    marginTop: 8,
    marginLeft: 8,
    marginBottom: 3,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    flex:2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    margin: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,

  },
  image: {
    width: '100%',
    height: 500, // Adjust height to fit content naturally
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  textContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  period: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 4,
  },
  rate: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#ff4d4d',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

