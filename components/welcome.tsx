import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Button, ActivityIndicator } from 'react-native';
import supabase from '../lib/supabase';
import { useRouter } from 'expo-router';

type WelcomeProps = {
  setIsSignedIn: (isSignedIn: boolean) => void;
};

const Welcome: React.FC<WelcomeProps> = ({ setIsSignedIn }) => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<{ first_name: string; last_name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
      
      if (sessionError || !sessionData?.user) {
        console.error("User not found:", sessionError?.message);
        setLoading(false);
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

  // const handleLogout = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     console.error('Logout error:', error.message);
  //   } else {
  //     setIsSignedIn(false);
  //     router.push('/sign_in');
  //   }
  // };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsSignedIn(false);
    // router.push('/sign_in'); // Redirect to login page after logout
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        {userDetails 
          ? `Welcome, ${userDetails.first_name} ${userDetails.last_name}!`
          : 'Welcome to Study Planner!'}
      </Text>
      
      <Text style={styles.subtitle}>
        Your personalized study planner awaits you.
      </Text>
       <Image source={require("../assets/logoo.jpg")} style={styles.logo} />

      <View style={styles.buttonWrapper}>
        <Button 
          title="Calendar" 
          onPress={() => router.push('/CalendarScreen')} 
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button 
          title="Tasks" 
          onPress={() => router.push('/TasksScreen')} 
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button 
          title="Reminder" 
          onPress={() => router.push('/RemindersScreen')} 
        />
      </View>

      <View style={styles.buttonContainer}>
              <Button title="Logout" onPress={handleLogout} color="#fff" />
            </View>

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffebcd",
    width: '100%',
    height: '100%', 
    flex: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  logo: {
    height: 200, // Increased height for larger image
    width: 250, 
    padding: 10,
    marginLeft:50,
  },
  buttonWrapper: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 25,
    padding: 10,
    width: '80%',
    alignSelf: 'center',
  },
  buttonContainer: {
    marginTop: 30,
    backgroundColor: '#ff6347',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#ff6347',
    borderRadius: 5,
    padding: 1,
  },
});

export default Welcome;