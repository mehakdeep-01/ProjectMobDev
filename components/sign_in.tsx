import { useState } from "react";
import { View, Image, Text, StyleSheet, Button, TextInput, Alert } from "react-native";
import supabase from "../lib/supabase"; // Ensure Supabase is properly initialized

type SignInProps = {
  setIsSignedIn: (isSignedIn: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
};

const SignIn: React.FC<SignInProps> = ({ setIsSignedIn, email, setEmail }) => {
  const [password, setPassword] = useState<string>("Password@123");

  const validateInput = () => {
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address.");
      return false;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return false;
    }
    return true;
  };
  
 
  const handleLogin = async () => {
    if (!validateInput()) return;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login failed", error.message);
    } else {
      setIsSignedIn(true);
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>STUDY PLANNER</Text>
    <Image source={require("../assets/logoo.jpg")} style={styles.logo} />

    <Text style={styles.subtitle}>Welcome to Study Planner</Text>
   
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffebcd",
    // backgroundColor: "#d8bfd8",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height:"100%",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    width: 200,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 30,
    
    fontFamily:"Noteworthy",
    // marginBottom: 180,
  },
  subtitle: {
    fontSize: 24,
    fontFamily:"Noteworthy",
    marginTop:100,
    marginBottom:20,

  },
  logo: {
    height: 200, // Increased height for larger image
    width: 250,  // Increased width for larger image
    padding: 10, // Adjusted padding for more space around the image
  },
  link: {color: "#FFF",
    textDecorationLine: "underline",
    marginTop: 10,
    fontSize: 16,},
});
