import React, { useState } from "react";
import { View, Text, StyleSheet, Button, TextInput, Alert, ActivityIndicator } from "react-native";
import supabase from "../lib/supabase";

type SignUpProps = {
  setIsSignedIn: (isSignedIn: boolean) => void;
};

const SignUp: React.FC<SignUpProps> = ({ setIsSignedIn }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validateInput = () => {
    if (!firstName || !lastName) {
      Alert.alert("Error", "First and Last name cannot be empty.");
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address.");
      return false;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[\W_]/.test(password)) {
      Alert.alert("Error", "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInput()) return;
    setLoading(true);

    // Sign up the user with email and password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      Alert.alert("Sign-up failed", authError.message);
      setLoading(false);
      return;
    }

    // Get the user ID from the response
    const userId = authData?.user?.id;
    if (!userId) {
      Alert.alert("Error", "User ID not found after sign-up.");
      setLoading(false);
      return;
    }

    console.log("User ID:", userId);

    // Insert user details into the user_details table
    const { data, error: dbError } = await supabase
      .from("user_details")
      .insert([{ uuid: userId, first_name: firstName, last_name: lastName, email }]);

    if (dbError) {
      Alert.alert("Error", "Failed to store user details: " + dbError.message);
    } else {
      setIsSignedIn(true);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" />
      ) : (
        <Button title="Sign Up" onPress={handleSignUp} color="#6200ee" />
      )}
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffebcd",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 10,
    width: "100%",
    paddingHorizontal: 15,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    width: "100%",
    backgroundColor: "#6200ee",
    paddingVertical: 14,
    borderRadius: 12,
  },
});
