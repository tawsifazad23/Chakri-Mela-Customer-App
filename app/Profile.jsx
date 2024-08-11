
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, Image, SafeAreaView, Alert, TouchableOpacity, ActivityIndicator, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/profile/customer`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      // Alert.alert('Error', 'An error occurred while fetching the profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (!/^[3-9]\d{8}$/.test(user.phone.replace('+880', ''))) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid Bangladeshi phone number.');
      return;
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('authToken');
    Alert.alert('Logged Out', 'You have been logged out successfully.');
    navigation.replace('index'); // Navigate to the login screen
  };

  const handlePhoneChange = (text) => {
    const newText = text.startsWith('880') ? text : text.replace(/^0+/, '');
    setUser({ ...user, phone: '+880' + newText });
  };

  const handleProfilePhotoUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'You need to grant photo library permissions to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('user_id', user.id.toString());
      formData.append('profile_photo', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: `profile_photo_${user.id}.jpg`,
      });

      try {
        const uploadResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/upload-profile-photo/serviceprovider`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadResponse.ok) {
          Alert.alert('Success', 'Profile photo updated successfully.');
          fetchProfile();  // Refetch profile to get the updated photo
        } else {
          Alert.alert('Error', uploadData.message);
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while uploading the profile photo.');
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error loading profile. Please try again later.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={handleEditToggle}>
        <Ionicons name="pencil" size={24} color="black" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: user.profile_photo || 'https://via.placeholder.com/120' }} 
              style={styles.profileImage} 

            />
            <TouchableOpacity style={styles.editPhotoButton} onPress={handleProfilePhotoUpload}>
              <Ionicons name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{`${user.first_name} ${user.last_name}`}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <FontAwesome name="phone" size={24} color="black" style={styles.infoIcon} />
            <Text style={styles.title}>Phone:</Text>
            {isEditing ? (
              <View style={styles.phoneInputContainer}>
                <Text style={styles.phonePrefix}>+880</Text>
                <TextInput
                  style={styles.input}
                  value={user.phone.replace('+880', '')}
                  onChangeText={handlePhoneChange}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>
            ) : (
              <Text style={styles.info}>+880 {user.phone.replace('+880', '')}</Text>
            )}
          </View>
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <FontAwesome name="home" size={24} color="black" style={styles.infoIcon} />
            <Text style={styles.title}>Address:</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={user.address}
                onChangeText={(text) => setUser({ ...user, address: text })}
                placeholder="Enter address"
              />
            ) : (
              <Text style={styles.info}>{user.address}</Text>
            )}
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <FontAwesome name="briefcase" size={24} color="black" style={styles.infoIcon} />
            <Text style={styles.title}>Occupation:</Text>
            <Text style={styles.info}>{user.occupation}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <FontAwesome name="star" size={24} color="black" style={styles.infoIcon} />
            <Text style={styles.title}>Rating:</Text>
            <Text style={styles.info}>{user.rating}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <FontAwesome name="id-card" size={24} color="black" style={styles.infoIcon} />
            <Text style={styles.title}>NID:</Text>
            <Text style={styles.info}>{user.nid}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <FontAwesome name="birthday-cake" size={24} color="black" style={styles.infoIcon} />
            <Text style={styles.title}>Date of Birth:</Text>
            <Text style={styles.info}>{user.date_of_birth}</Text>
          </View>
          <View style={styles.divider} />

          {isEditing ? (
            <>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <Text style={[styles.buttonText, styles.saveButtonText]}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleSignOut}>
                <Text style={[styles.buttonText, styles.logoutButtonText]}>Log Out</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    marginLeft: 16,
    marginTop: 16,
  },
  editButton: {
    position: 'absolute',
    top: 25,
    right: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    marginTop: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007bff',
    borderRadius: 15,
    padding: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  infoContainer: {
    width: '90%',
    padding: 16,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 10,
  },
  info: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  phonePrefix: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    padding: 5,
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#000',
  },
  saveButtonText: {
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  cancelButtonText: {
    color: '#000',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  logoutButtonText: {
    color: '#000',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
