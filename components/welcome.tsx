import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, SafeAreaView } from 'react-native';
import supabase from '../lib/supabase';
import CityScreen from '../app/screens/cityScreen';
import { router, useRouter } from 'expo-router';

type WelcomeProps = {
  setIsSignedIn: (isSignedIn: boolean) => void;
};

const Welcome: React.FC <WelcomeProps>= ({ setIsSignedIn }) => {
  const Router = useRouter();
  const [userDetails, setUserDetails] = useState<{ first_name: string; last_name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
      console.log(  JSON.stringify(sessionData));
      if (sessionError || !sessionData?.user) {
        console.error("User not found:", sessionError?.message);
        return;
      }

      const { data, error: userError } = await supabase
        .from('user_details')
        .select('first_name, last_name')
        .eq('uuid', sessionData.user.id)
        .single();
      console.log(JSON.stringify(data))
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
    setIsSignedIn(false);
   // router.push('/sign_in'); // Redirect to login page after logout
    // Handle navigation to Sign-In page (assuming a navigation prop is available)
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Welcome {userDetails ? `${userDetails.first_name} ${userDetails.last_name}` : "User"} to my app!
              </Text>
            </View>

            <CityScreen city="Edmonton" url="https://www.edmonton.ca/" color={''} size={0} />

            <View style={styles.buttonContainer}>
              <Button title="Logout" onPress={handleLogout} color="red" />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    justifyContent: 'center', // Centers all content
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  titleContainer: {
    marginBottom: 20, // Ensures space below the title
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30, // Ensures the logout button stays at the bottom
    width: '60%',
  },
});
