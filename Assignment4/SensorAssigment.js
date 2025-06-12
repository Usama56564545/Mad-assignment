import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, Button, ScrollView, ActivityIndicator } from 'react-native';
import * as Sensors from 'expo-sensors';
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
      const response = await fetch(${API_BASE}/posts);
      const data = await response.json();
      setPosts(data.slice(0, 5)); 
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  const createPost = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(${API_BASE}/posts, {
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
      alert(Post created successfully!\nID: ${data.id}\nTitle: ${data.title});
      setError(null);
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(${API_BASE}/posts/1, {
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
      alert(Post updated successfully!\nID: ${data.id}\nNew Title: ${data.title});
      setError(null);
    } catch (err) {
      setError('Failed to update post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(${API_BASE}/users);
      const data = await response.json();
      setUsers(data.slice(0, 5));
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
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
      <Text style={styles.header}>API Integration Demo</Text>
      <Text style={styles.subHeader}>Using JSONPlaceholder API</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Endpoints</Text>
        <View style={styles.buttonRow}>
          <Button title="GET Posts" onPress={fetchPosts} color="#4CAF50" />
          <Button title="POST Create" onPress={createPost} color="#FF9800" />
          <Button title="PUT Update" onPress={updatePost} color="#2196F3" />
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Posts (GET Response)</Text>
        {posts.map(post => (
          <View key={post.id} style={styles.card}>
            <Text style={styles.cardTitle}>{post.title}</Text>
            <Text>{post.body}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Users (GET Response)</Text>
        {users.map(user => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.cardTitle}>{user.name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Phone: {user.phone}</Text>
          </View>
        ))}
      </View>

      <Button 
        title="View Sensor Data" 
        onPress={() => navigation.navigate('Sensor')}
        style={styles.sensorButton}
      />
    </ScrollView>
  );
};

const SensorScreen = () => {
  const [accelerometerData, setAccelerometerData] = useState({});
  const [isAvailable, setIsAvailable] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    const checkAvailability = async () => {
      const available = await Sensors.Accelerometer.isAvailableAsync();
      setIsAvailable(available);
    };
    
    checkAvailability();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  const subscribe = () => {
    subscriptionRef.current = Sensors.Accelerometer.addListener(data => {
      setAccelerometerData(data);
    });
    setIsMonitoring(true);
  };

  const unsubscribe = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    setIsMonitoring(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sensor Data</Text>
      
      {!isAvailable ? (
        <Text style={styles.error}>Accelerometer not available on this device</Text>
      ) : (
        <>
          <View style={styles.sensorContainer}>
            <View style={styles.sensorDataBox}>
              <Text style={styles.sensorLabel}>X:</Text>
              <Text style={styles.sensorValue}>
                {accelerometerData.x ? accelerometerData.x.toFixed(4) : 0}
              </Text>
            </View>
            
            <View style={styles.sensorDataBox}>
              <Text style={styles.sensorLabel}>Y:</Text>
              <Text style={styles.sensorValue}>
                {accelerometerData.y ? accelerometerData.y.toFixed(4) : 0}
              </Text>
            </View>
            
            <View style={styles.sensorDataBox}>
              <Text style={styles.sensorLabel}>Z:</Text>
              <Text style={styles.sensorValue}>
                {accelerometerData.z ? accelerometerData.z.toFixed(4) : 0}
              </Text>
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
            <Text style={styles.explanationTitle}>How to Use:</Text>
            <Text>- Click "Start Sensor" to begin monitoring</Text>
            <Text>- Move your device to see values change</Text>
            <Text>- X-axis: Left/Right tilt</Text>
            <Text>- Y-axis: Front/Back tilt</Text>
            <Text>- Z-axis: Vertical movement</Text>
          </View>
        </>
      )}
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApiProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="API" 
            component={ApiScreen} 
            options={{ title: 'API Integration' }} 
          />
          <Stack.Screen 
            name="Sensor" 
            component={SensorScreen} 
            options={{ title: 'Sensor Data' }} 
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
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  sensorButton: {
    marginTop: 20,
    backgroundColor: '#9C27B0',
  },
  sensorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 30,
  },
  sensorDataBox: {
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 10,
    width: 100,
    elevation: 5,
  },
  sensorLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0D47A1',
  },
  sensorValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  sensorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  sensorExplanation: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  explanationTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2E7D32',
  },
});
