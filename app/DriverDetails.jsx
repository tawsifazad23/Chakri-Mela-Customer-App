// // // import * as React from 'react';
// // // import { StyleSheet, View, Text, Image, Button, ScrollView, Alert } from 'react-native';
// // // import { useRoute } from '@react-navigation/native';

// // // export default function DriverDetails() {
// // //   const route = useRoute();
// // //   const { driver } = route.params;

// // //   return (
// // //     <ScrollView style={styles.container}>
// // //       <Image source={{ uri: driver.profilePicture }} style={styles.profilePicture} />
// // //       <Text style={styles.name}>{driver.name}</Text>
// // //       <Text style={styles.info}>Rating: {driver.rating}</Text>

// import * as React from 'react';
// import { StyleSheet, View, Text, Image, Button, ScrollView, Alert } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import Video from 'react-native-video';

// export default function DriverDetails() {
//   const route = useRoute();
//   const { driver } = route.params;

//   return (
//     <ScrollView style={styles.container}>
//       <Image source={{ uri: driver.profilePicture }} style={styles.profilePicture} />
//       <Text style={styles.name}>{driver.name}</Text>
//       <Text style={styles.info}>Rating: {driver.rating}</Text>
//       <Text style={styles.info}>Location: {driver.location}</Text>
//       <Text style={styles.info}>Trip: {driver.tripName}</Text>
//       <Text style={styles.info}>Experience: {driver.experienceYears} years</Text>
//       <Text style={styles.info}>Verified on app: {new Date().toLocaleDateString()}</Text>
//       <Text style={styles.description}>Driver's introduction video:</Text>
//       <View style={styles.videoContainer}>
//         <Video 
//           source={{ uri: 'https://path-to-your-video-file.mp4' }} 
//           style={styles.video}
//           controls={true}
//         />
//       </View>
//       <Button title="Contact Driver" onPress={() => Alert.alert('Contact Driver')} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   profilePicture: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   info: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   description: {
//     fontSize: 18,
//     marginVertical: 10,
//     fontWeight: 'bold',
//   },
//   videoContainer: {
//     height: 200,
//     backgroundColor: '#ccc',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderRadius: 10,
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 10,
//   },
// });

import * as React from 'react';
import { StyleSheet, View, Text, Image, Button, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import YouTube from 'react-native-youtube-iframe';

export default function DriverDetails() {
  const route = useRoute();
  const { driver } = route.params;
  const [playing, setPlaying] = React.useState(false);

  const onStateChange = (state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("Video has finished playing!");
    }
  };

  const togglePlaying = () => {
    setPlaying((prev) => !prev);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: driver.profilePicture }} style={styles.profilePicture} />
      <Text style={styles.name}>{driver.name}</Text>
      <Text style={styles.info}>Rating: {driver.rating}</Text>
      <Text style={styles.info}>Location: {driver.location}</Text>
      <Text style={styles.info}>Trip: {driver.tripName}</Text>
      <Text style={styles.info}>Experience: {driver.experienceYears} years</Text>
      <Text style={styles.info}>Verified on app: {new Date().toLocaleDateString()}</Text>
      <Text style={styles.description}>Driver's introduction video:</Text>
      <View style={styles.videoContainer}>
        <YouTube
          videoId="QeLL2I3kG5g" // The YouTube video ID
          height={200}
          play={playing}
          onChangeState={onStateChange}
        />
        <Button title={playing ? "Pause" : "Play"} onPress={togglePlaying} />
      </View>
      <Button title="Contact Driver" onPress={() => Alert.alert('Contact Driver')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  profilePicture: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  videoContainer: {
    marginBottom: 20,
    borderRadius: 10,
  },
});

