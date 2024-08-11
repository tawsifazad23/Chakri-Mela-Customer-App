import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JobPostings() {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchJobPostings = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No token found, please log in again.');
        navigation.replace('Login');
        return;
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/job_postings/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJobPostings(data);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to fetch job postings.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchJobPostings();

      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Your Job Postings</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : jobPostings.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No job postings found.</Text>
        </View>
      ) : (
        <ScrollView>
          {jobPostings.map((job, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate('JobDetail', { job })}
            >
              <Text style={styles.title}>{job.service_type}</Text>
              <Text style={styles.period}>{job.service_period}</Text>
              <Text style={styles.rate}>{job.service_rate} Taka</Text>
              <Text style={styles.location}>{job.onboarding_location}</Text>
              <Text style={styles.summary}>{job.job_summary}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
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
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  period: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  rate: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#777',
  },
});
