import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, Button, ScrollView, ActivityIndicator, Image } from 'react-native';
import * as Sensors from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
const ApiContext = createContext();
const ApiProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE = 'https://jsonplaceholder.typicode.com';
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/posts`);
      const data = await response.json();
      setPosts(data.slice(0, 5)); 
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts. Check your connection');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Assignment Post',
          body: 'This post was created for Assignment 4',
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      alert(`Post created successfully!\nID: ${data.id}\nTitle: ${data.title}`);
      setError(null);
    } catch (err) {
      setError('Failed to create post. Check your connection');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/posts/1`, {
        method: 'PUT',
        body: JSON.stringify({
          id: 1,
          title: 'Updated Assignment Post',
          body: 'This post was updated for Assignment 4',
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      alert(`Post updated successfully!\nID: ${data.id}\nNew Title: ${data.title}`);
      setError(null);
    } catch (err) {
      setError('Failed to update post. Check your connection');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users`);
      const data = await response.json();
      setUsers(data.slice(0, 5));
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Check your connection');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ApiContext.Provider 
      value={{ 
        posts, 
        users,
        loading,
        error,
        fetchPosts, 
        createPost, 
        updatePost,
        fetchUsers
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

const useApi = () => useContext(ApiContext);

const ApiScreen = ({ navigation }) => {
  const { 
    posts, 
    users,
    loading, 
    error, 
    fetchPosts, 
    createPost, 
    updatePost,
    fetchUsers
  } = useApi();

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, [fetchPosts, fetchUsers]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>API Integration Demo</Text>
        <Text style={styles.subHeader}>Using JSONPlaceholder API</Text>
        <View style={styles.apiIcon}>
          <Ionicons name="cloud" size={36} color="#4A90E2" />
        </View>
      </View>
      
      {error && <View style={styles.errorContainer}><Text style={styles.error}>{error}</Text></View>}
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="options" size={24} color="#444" />
          <Text style={styles.sectionTitle}>API Endpoints</Text>
        </View>
        <View style={styles.buttonRow}>
          <Button 
            title="GET Posts" 
            onPress={fetchPosts} 
            color="#4CAF50" 
            disabled={loading}
          />
          <Button 
            title="POST Create" 
            onPress={createPost} 
            color="#FF9800" 
            disabled={loading}
          />
          <Button 
            title="PUT Update" 
            onPress={updatePost} 
            color="#2196F3" 
            disabled={loading}
          />
        </View>
        <Button 
          title="Refresh All Data" 
          onPress={() => {
            fetchPosts();
            fetchUsers();
          }} 
          color="#9C27B0" 
          disabled={loading}
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text" size={24} color="#444" />
          <Text style={styles.sectionTitle}>Posts (GET Response)</Text>
        </View>
        {posts.length > 0 ? (
          posts.map(post => (
            <View key={post.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{post.title}</Text>
                <Text style={styles.postId}>ID: {post.id}</Text>
              </View>
              <Text style={styles.cardBody}>{post.body}</Text>
              <Text style={styles.userId}>User ID: {post.userId}</Text>
            </View>
          ))
        ) : (
          !loading && <Text style={styles.noData}>No posts to display</Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="people" size={24} color="#444" />
          <Text style={styles.sectionTitle}>Users (GET Response)</Text>
        </View>
        {users.length > 0 ? (
          users.map(user => (
            <View key={user.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{user.name}</Text>
                <Text style={styles.userId}>ID: {user.id}</Text>
              </View>
              <Text style={styles.cardDetail}><Ionicons name="mail" size={16} color="#666" /> {user.email}</Text>
              <Text style={styles.cardDetail}><Ionicons name="call" size={16} color="#666" /> {user.phone}</Text>
              <Text style={styles.cardDetail}><Ionicons name="business" size={16} color="#666" /> {user.company.name}</Text>
            </View>
          ))
        ) : (
          !loading && <Text style={styles.noData}>No users to display</Text>
        )}
      </View>

      <View style={styles.sensorButtonContainer}>
        <Button 
          title="View Sensor Data" 
          onPress={() => navigation.navigate('Sensor')}
          color="#E91E63"
        />
      </View>
    </ScrollView>
  );
};

const SensorScreen = ({ navigation }) => {
  const [accelerometerData, setAccelerometerData] = useState({});
  const [isAvailable, setIsAvailable] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const subscriptionRef = useRef(null);
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const checkAvailability = async () => {
      const available = await Sensors.Accelerometer.isAvailableAsync();
      setIsAvailable(available);
      
      // Set initial orientation based on device dimensions
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
    };
    
    checkAvailability();

    // Listen for orientation changes
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
      subscription.remove();
    };
  }, []);

  const subscribe = () => {
    subscriptionRef.current = Sensors.Accelerometer.addListener(data => {
      setAccelerometerData(data);
    });
    setIsMonitoring(true);
    Sensors.Accelerometer.setUpdateInterval(100);
  };

  const unsubscribe = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    setIsMonitoring(false);
  };

  const getOrientationIcon = () => {
    if (!accelerometerData.x) return '📱';
    
    const { x, y } = accelerometerData;
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    
    if (absX > absY) {
      return x > 0 ? '⬅️' : '➡️';
    } else {
      return y > 0 ? '⬆️' : '⬇️';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.sensorContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Sensor Data Visualization</Text>
        <Text style={styles.subHeader}>Using Expo Accelerometer</Text>
        <View style={styles.sensorIcon}>
          <Ionicons name="phone-portrait" size={36} color="#4A90E2" />
        </View>
      </View>
      
      {!isAvailable ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>Accelerometer not available on this device</Text>
        </View>
      ) : (
        <>
          <View style={styles.sensorVisualization}>
            <View style={styles.deviceModel}>
              <Text style={styles.deviceText}>{getOrientationIcon()}</Text>
            </View>
            
            <View style={styles.dataContainer}>
              <View style={[styles.sensorDataBox, { backgroundColor: '#FFEBEE' }]}>
                <Text style={styles.sensorLabel}>X-axis:</Text>
                <Text style={styles.sensorValue}>
                  {accelerometerData.x ? accelerometerData.x.toFixed(4) : 0}
                </Text>
                <Text style={styles.sensorHint}>Left/Right tilt</Text>
              </View>
              
              <View style={[styles.sensorDataBox, { backgroundColor: '#E3F2FD' }]}>
                <Text style={styles.sensorLabel}>Y-axis:</Text>
                <Text style={styles.sensorValue}>
                  {accelerometerData.y ? accelerometerData.y.toFixed(4) : 0}
                </Text>
                <Text style={styles.sensorHint}>Front/Back tilt</Text>
              </View>
              
              <View style={[styles.sensorDataBox, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.sensorLabel}>Z-axis:</Text>
                <Text style={styles.sensorValue}>
                  {accelerometerData.z ? accelerometerData.z.toFixed(4) : 0}
                </Text>
                <Text style={styles.sensorHint}>Vertical movement</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.sensorButtons}>
            <Button 
              title="Start Sensor" 
              onPress={subscribe} 
              disabled={isMonitoring}
              color="#4CAF50"
            />
            <Button 
              title="Stop Sensor" 
              onPress={unsubscribe} 
              disabled={!isMonitoring}
              color="#F44336"
            />
          </View>
          
          <View style={styles.sensorExplanation}>
            <Text style={styles.explanationTitle}>How to Use the Accelerometer:</Text>
            <View style={styles.instruction}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.instructionText}>Click "Start Sensor" to begin monitoring</Text>
            </View>
            <View style={styles.instruction}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.instructionText}>Move your device to see values change</Text>
            </View>
            <View style={styles.instruction}>
              <Ionicons name="checkmark-circle" size= {18} color="#4CAF50" />
              <Text style={styles.instructionText}>X-axis: Measures left/right tilt (landscape)</Text>
            </View>
            <View style={styles.instruction}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.instructionText}>Y-axis: Measures front/back tilt (portrait)</Text>
            </View>
            <View style={styles.instruction}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.instructionText}>Z-axis: Measures vertical movement</Text>
            </View>
          </View>
          
          <View style={styles.navigationButton}>
            <Button 
              title="Back to API Demo" 
              onPress={() => navigation.goBack()}
              color="#9C27B0"
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApiProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4A90E2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="API" 
            component={ApiScreen} 
            options={{ 
              title: 'API Integration Demo',
              headerRight: () => (
                <Ionicons 
                  name="cloud" 
                  size={24} 
                  color="white" 
                  style={{ marginRight: 15 }} 
                />
              )
            }} 
          />
          <Stack.Screen 
            name="Sensor" 
            component={SensorScreen} 
            options={{ 
              title: 'Sensor Data',
              headerRight: () => (
                <Ionicons 
                  name="phone-portrait" 
                  size={24} 
                  color="white" 
                  style={{ marginRight: 15 }} 
                />
              )
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  apiIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  sensorIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  error: {
    color: '#f44336',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#444',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  postId: {
    backgroundColor: '#4A90E2',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
  },
  userId: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  cardBody: {
    color: '#555',
    marginBottom: 8,
  },
  cardDetail: {
    marginVertical: 3,
    color: '#555',
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 10,
  },
  sensorButtonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  
  // Sensor Screen Styles
  sensorContainer: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingBottom: 40,
  },
  sensorVisualization: {
    alignItems: 'center',
    marginVertical: 20,
  },
  deviceModel: {
    width: 150,
    height: 250,
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#bbdefb',
    elevation: 5,
  },
  deviceText: {
    fontSize: 60,
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sensorDataBox: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  sensorLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sensorValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1565C0',
  },
  sensorHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  sensorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  sensorExplanation: {
    backgroundColor: '#e8f5e9',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  explanationTitle: {
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2E7D32',
    fontSize: 18,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  navigationButton: {
    marginTop: 20,
  },
});
