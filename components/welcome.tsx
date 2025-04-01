import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CityScreen from '../app/screens/cityScreen';

const Tab = createBottomTabNavigator();

const Welcome: React.FC = () => {
  const [userDetails, setUserDetails] = useState<{ first_name: string; last_name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser();

      if (sessionError || !sessionData?.user) {
        console.error("User not found:", sessionError?.message);
        return;
      }

      const { data, error: userError } = await supabase
        .from('user_details')
        .select('first_name, last_name')
        .eq('uuid', sessionData.user.id)
        .single();

      if (userError) {
        console.error("Error fetching user details:", userError.message);
      } else {
        setUserDetails(data);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Handle navigation to Sign-In page (assuming a navigation prop is available)
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.title}>
            Welcome {userDetails ? `${userDetails.first_name} ${userDetails.last_name}` : "User"} to my app!
          </Text>
          
          <CityScreen city="Edmonton" url="https://www.edmonton.ca/" color={''} size={0} />

          <Button title="Logout" onPress={handleLogout} color="red" />
        </>
      )}
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
