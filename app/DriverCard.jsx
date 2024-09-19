import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Ensure you have expo/vector-icons installed
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const DriverCard = ({ driver }) => {
  const navigation = useNavigation();

  const handleConfirm = () => {
    Alert.alert(
      "Confirm Request",
      `Are you sure you want to confirm the request from ${driver.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => console.log(`Confirmed request from ${driver.name}`) },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Request",
      `Are you sure you want to delete the request from ${driver.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => console.log(`Deleted request from ${driver.name}`) },
      ]
    );
  };

  const handleSave = () => {
    console.log('Saved request');
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DriverDetails', { driver });
      }}
      activeOpacity={0.7}
    >
      <View style={styles.card}>
        <View style={styles.leftContainer}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: driver.profilePicture }} style={styles.profilePicture} />
            {driver.policeVerified && (
              <Ionicons name="shield-checkmark" size={24} color="green" style={styles.verifiedIcon} />
            )}
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <MaterialIcons name="bookmark-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.driverName}>{driver.name}</Text>
          <Text style={styles.info}>Rating: {driver.rating}</Text>
          <Text style={styles.info}>Location: {driver.location}</Text>
          <Text style={styles.info}>Trip: {driver.tripName}</Text>
          <Text style={styles.info}>Experience: {driver.experienceYears} years</Text>
          <Text style={styles.info}>Hometown: {driver.hometown || 'Dhaka'}</Text>
          <Text style={styles.info}>Pay: {driver.pay || '5000'} BDT</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Ionicons name="checkmark-circle-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="close-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 15,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  verifiedIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  infoContainer: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    marginBottom: 2,
    textAlign: 'left',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default DriverCard;
