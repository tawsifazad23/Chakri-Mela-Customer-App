// import * as React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// export default function TripDetails({ route }) {
//   const trip = route?.params?.trip;

//   // Dummy trip details data
//   const tripDetails = trip ? {
//     driverName: trip.driverName,
//     driverLicense: 'D123456789',
//     driverRating: 4.8,
//     destination: trip.destination,
//     rate: '$50',
//     daysToGo: trip.daysToGo,
//   } : {
//     driverName: 'Driver Name',
//     driverLicense: 'D123456789',
//     driverRating: 4.8,
//     destination: 'Destination',
//     rate: '$50',
//     daysToGo: 'Days to go',
//   };

//   // Dummy payment receipt data
//   const paymentReceipt = {
//     amount: '$50',
//     paymentMethod: 'Credit Card',
//     transactionId: '1234567890',
//     paymentDate: '2024-06-01',
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Trip Details</Text>
//       <Text style={styles.label}>Driver:</Text>
//       <Text style={styles.value}>{tripDetails.driverName}</Text>
      
//       <Text style={styles.label}>Driver License:</Text>
//       <Text style={styles.value}>{tripDetails.driverLicense}</Text>
      
//       <Text style={styles.label}>Driver Rating:</Text>
//       <Text style={styles.value}>{tripDetails.driverRating}</Text>
      
//       <Text style={styles.label}>Destination:</Text>
//       <Text style={styles.value}>{tripDetails.destination}</Text>
      
//       <Text style={styles.label}>Rate:</Text>
//       <Text style={styles.value}>{tripDetails.rate}</Text>
      
//       <Text style={styles.label}>Days to go:</Text>
//       <Text style={styles.value}>{tripDetails.daysToGo}</Text>
      
//       <View style={styles.receipt}>
//         <Text style={styles.receiptHeading}>Payment Receipt</Text>
        
//         <Text style={styles.label}>Amount:</Text>
//         <Text style={styles.value}>{paymentReceipt.amount}</Text>
        
//         <Text style={styles.label}>Payment Method:</Text>
//         <Text style={styles.value}>{paymentReceipt.paymentMethod}</Text>
        
//         <Text style={styles.label}>Transaction ID:</Text>
//         <Text style={styles.value}>{paymentReceipt.transactionId}</Text>
        
//         <Text style={styles.label}>Payment Date:</Text>
//         <Text style={styles.value}>{paymentReceipt.paymentDate}</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 8,
//   },
//   value: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   receipt: {
//     marginTop: 16,
//     padding: 16,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//   },
//   receiptHeading: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
// });

import * as React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TripDetails({ route }) {
  const trip = route?.params?.trip;

  // Dummy trip details data
  const tripDetails = trip ? {
    driverName: trip.driverName,
    driverLicense: 'D123456789',
    driverRating: 4.8,
    destination: trip.destination,
    rate: '$50',
    daysToGo: trip.daysToGo,
  } : {
    driverName: 'Driver Name',
    driverLicense: 'D123456789',
    driverRating: 4.8,
    destination: 'Destination',
    rate: '$50',
    daysToGo: 'Days to go',
  };

  // Dummy payment receipt data
  const paymentReceipt = {
    amount: '$50',
    paymentMethod: 'Credit Card',
    transactionId: '1234567890',
    paymentDate: '2024-06-01',
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Trip Details</Text>
      <Text style={styles.label}>Driver:</Text>
      <Text style={styles.value}>{tripDetails.driverName}</Text>
      
      <Text style={styles.label}>Driver License:</Text>
      <Text style={styles.value}>{tripDetails.driverLicense}</Text>
      
      <Text style={styles.label}>Driver Rating:</Text>
      <Text style={styles.value}>{tripDetails.driverRating}</Text>
      
      <Text style={styles.label}>Destination:</Text>
      <Text style={styles.value}>{tripDetails.destination}</Text>
      
      <Text style={styles.label}>Rate:</Text>
      <Text style={styles.value}>{tripDetails.rate}</Text>
      
      <Text style={styles.label}>Days to go:</Text>
      <Text style={styles.value}>{tripDetails.daysToGo}</Text>
      
      <View style={styles.receipt}>
        <Text style={styles.receiptHeading}>Payment Receipt</Text>
        
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>{paymentReceipt.amount}</Text>
        
        <Text style={styles.label}>Payment Method:</Text>
        <Text style={styles.value}>{paymentReceipt.paymentMethod}</Text>
        
        <Text style={styles.label}>Transaction ID:</Text>
        <Text style={styles.value}>{paymentReceipt.transactionId}</Text>
        
        <Text style={styles.label}>Payment Date:</Text>
        <Text style={styles.value}>{paymentReceipt.paymentDate}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
    
  },
  receipt: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignSelf: 'center',
  },
  receiptHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
