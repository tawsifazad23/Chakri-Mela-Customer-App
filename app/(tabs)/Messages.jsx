// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, SafeAreaView, Alert, TouchableOpacity, Image, FlatList, TextInput } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';
// import { EventSourcePolyfill } from 'event-source-polyfill';

// const Messages = () => {
//   const [conversations, setConversations] = useState([]);
//   const [filteredConversations, setFilteredConversations] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigation = useNavigation();

//   useEffect(() => {
//     let eventSource;  // Declare a variable to hold the event source
  
//     const setupSSE = async () => {
//       try {
//         const token = await AsyncStorage.getItem('authToken');
//         if (!token) {
//           Alert.alert('Error', 'No token found');
//           return;
//         }
  
//         eventSource = new EventSourcePolyfill(`${process.env.EXPO_PUBLIC_API_URL}/api/user/conversations/`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
  
//         eventSource.onmessage = (event) => {
//           const data = JSON.parse(event.data);
//           // Sort conversations: empty conversations at the top, then by last message time
//           const sortedConversations = data.sort((a, b) => {
//             if (a.last_message.message === 'Tap to Start Chat!') return -1;
//             if (b.last_message.message === 'Tap to Start Chat!') return 1;
//             return new Date(b.last_message.time) - new Date(a.last_message.time);
//           });
//           setConversations(sortedConversations);
//           setFilteredConversations(sortedConversations);
//         };
  
//         eventSource.onerror = (error) => {
//           console.error('EventSource error:', error);
//           eventSource.close();
//         };
  
//       } catch (error) {
//         console.error('SSE setup error:', error);
//         Alert.alert('Error', 'Failed to set up real-time updates');
//       }
//     };
  
//     setupSSE();  // Call the setup function
  
//     return () => {
//       if (eventSource) {
//         eventSource.close();  // Clean up the event source when the component unmounts
//       }
//     };
//   }, []);
  

//   const handleChatPress = async (conversation) => {
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       if (!token) {
//         Alert.alert('Error', 'No token found');
//         return;
//       }
//       await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/conversations/${conversation.id}/mark_seen/`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       navigation.navigate('ChatScreen', { conversation });
//     } catch (error) {
//       console.error('Error marking messages as seen:', error);
//     }
//   };

//   const formatTime = (time) => {
//     if (!time) return '';
//     const now = new Date();
//     const messageTime = new Date(time);
//     const today = now.toDateString() === messageTime.toDateString();
//     const yesterday = new Date(now);
//     yesterday.setDate(now.getDate() - 1);
//     const isYesterday = yesterday.toDateString() === messageTime.toDateString();

//     const hours = messageTime.getHours();
//     const minutes = messageTime.getMinutes();
//     const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;

//     if (today) {
//       return `Today • ${formattedTime}`;
//     } else if (isYesterday) {
//       return `Yesterday • ${formattedTime}`;
//     } else {
//       return `${messageTime.getDate()}/${messageTime.getMonth() + 1}/${messageTime.getFullYear()} • ${formattedTime}`;
//     }
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     if (query === '') {
//       setFilteredConversations(conversations);
//     } else {
//       const filteredData = conversations.filter((item) =>
//         `${item.service_provider_request.service_provider.first_name} ${item.service_provider_request.service_provider.last_name}`
//           .toLowerCase()
//           .includes(query.toLowerCase())
//       );
//       setFilteredConversations(filteredData);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Chats</Text>
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchBar}
//             placeholder="Search"
//             value={searchQuery}
//             onChangeText={handleSearch}
//           />
//         </View>
//       </View>
//       {filteredConversations.length === 0 ? (
//         <View style={styles.noConversationsContainer}>
//           <Text style={styles.noConversationsText}>No conversations found.</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredConversations}
//           renderItem={({ item }) => (
//             <View style={styles.chatItemContainer}>
//               <TouchableOpacity onPress={() => handleChatPress(item)} style={styles.chatItem}>
//                 <Image
//                   source={{ uri: item.service_provider_request.service_provider.profile_photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs10cupyp3Wf-pZvdPjGQuKne14ngVZbYdDQ&s' }}
//                   style={styles.profilePic}
//                 />
//                 <View style={styles.chatContent}>
//                   <Text style={styles.chatTitle}>
//                     {item.service_provider_request.service_provider.first_name} {item.service_provider_request.service_provider.last_name}
//                   </Text>
//                   {item.last_message && item.last_message.message ? (
//                     <Text style={styles.chatMessage}>
//                       {item.last_message.message.length > 17 ? `${item.last_message.message.substring(0, 17)}...` : item.last_message.message}
//                       <Text style={styles.messageTime}> • {formatTime(item.last_message.time)}</Text>
//                     </Text>
//                   ) : (
//                     <Text style={styles.tapToStartText}>Tap to Start Chat!</Text>
//                   )}
//                   {item.unseen_count > 0 && (
//                     <View style={styles.unseenCount}>
//                       <Text style={styles.unseenCountText}>{item.unseen_count}</Text>
//                     </View>
//                   )}
//                 </View>
//               </TouchableOpacity>
//             </View>
//           )}
//           keyExtractor={(item) => item.id.toString()}
//           contentContainerStyle={styles.chatList}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     padding: 10,
//     backgroundColor: '#f9f9f9',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'left',
//     marginBottom: 10,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchBar: {
//     flex: 1,
//     height: 40,
//   },
//   noConversationsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noConversationsText: {
//     fontSize: 18,
//     color: '#777',
//   },
//   chatList: {
//     padding: 10,
//   },
//   chatItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#f9f9f9',
//     marginBottom: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     position: 'relative',
//   },
//   chatItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   profilePic: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   chatContent: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   chatTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   chatMessage: {
//     marginTop: 3,
//     fontSize: 14,
//     color: '#777',
//   },
//   messageTime: {
//     fontSize: 12,
//     color: '#888',
//   },
//   tapToStartText: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 5,
//   },
//   unseenCount: {
//     backgroundColor: '#316FF6',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'absolute',
//     top: 5,
//     right: 10,
//   },
//   unseenCountText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
// });

// export default Messages;

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Alert, TouchableOpacity, Image, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { EventSourcePolyfill } from 'event-source-polyfill';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    let eventSource;  // Declare a variable to hold the event source
  
    const setupSSE = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'No token found');
          return;
        }
  
        eventSource = new EventSourcePolyfill(`${process.env.EXPO_PUBLIC_API_URL}/api/user/conversations/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          // Sort conversations: empty conversations at the top, then by last message time
          const sortedConversations = data.sort((a, b) => {
            if (a.last_message.message === 'Tap to Start Chat!') return -1;
            if (b.last_message.message === 'Tap to Start Chat!') return 1;
            return new Date(b.last_message.time) - new Date(a.last_message.time);
          });
          setConversations(sortedConversations);
          setFilteredConversations(sortedConversations);
        };
  
        eventSource.onerror = (error) => {
          console.error('EventSource error:', error);
          eventSource.close();
        };
  
      } catch (error) {
        console.error('SSE setup error:', error);
        Alert.alert('Error', 'Failed to set up real-time updates');
      }
    };
  
    setupSSE();  // Call the setup function
  
    return () => {
      if (eventSource) {
        eventSource.close();  // Clean up the event source when the component unmounts
      }
    };
  }, []);
  

  const handleChatPress = async (conversation) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/conversations/${conversation.id}/mark_seen/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      navigation.navigate('ChatScreen', { conversation });
    } catch (error) {
      console.error('Error marking messages as seen:', error);
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const now = new Date();
    const messageTime = new Date(time);
    const today = now.toDateString() === messageTime.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = yesterday.toDateString() === messageTime.toDateString();

    const hours = messageTime.getHours();
    const minutes = messageTime.getMinutes();
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;

    if (today) {
      return `Today • ${formattedTime}`;
    } else if (isYesterday) {
      return `Yesterday • ${formattedTime}`;
    } else {
      return `${messageTime.getDate()}/${messageTime.getMonth() + 1}/${messageTime.getFullYear()} • ${formattedTime}`;
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredConversations(conversations);
    } else {
      const filteredData = conversations.filter((item) =>
        `${item.service_provider_request.service_provider.first_name} ${item.service_provider_request.service_provider.last_name}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredConversations(filteredData);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      {filteredConversations.length === 0 ? (
        <View style={styles.noConversationsContainer}>
          <Text style={styles.noConversationsText}>No conversations found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={({ item }) => (
            <View style={styles.chatItemContainer}>
              <TouchableOpacity onPress={() => handleChatPress(item)} style={styles.chatItem}>
                <Image
                  source={{ uri: item.service_provider_request.service_provider.profile_photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs10cupyp3Wf-pZvdPjGQuKne14ngVZbYdDQ&s' }}
                  style={styles.profilePic}
                />
                <View style={styles.chatContent}>
                  <Text style={styles.chatTitle}>
                    {item.service_provider_request.service_provider.first_name} {item.service_provider_request.service_provider.last_name}
                  </Text>
                  {item.last_message && item.last_message.message ? (
                    <Text style={styles.chatMessage}>
                      {item.last_message.message.length > 17 ? `${item.last_message.message.substring(0, 17)}...` : item.last_message.message}
                      <Text style={styles.messageTime}> • {formatTime(item.last_message.time)}</Text>
                    </Text>
                  ) : (
                    <Text style={styles.tapToStartText}>Tap to Start Chat!</Text>
                  )}
                  {item.unseen_count > 0 && (
                    <View style={styles.unseenCount}>
                      <Text style={styles.unseenCountText}>{item.unseen_count}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.chatList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  noConversationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noConversationsText: {
    fontSize: 18,
    color: '#777',
  },
  chatList: {
    padding: 10,
  },
  chatItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatMessage: {
    marginTop: 3,
    fontSize: 14,
    color: '#777',
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
  },
  tapToStartText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    fontWeight: 'bold', // Make the "Tap to Start Chat!" text bold
  },
  unseenCount: {
    backgroundColor: '#316FF6',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 5,
    right: 10,
  },
  unseenCountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default Messages;
