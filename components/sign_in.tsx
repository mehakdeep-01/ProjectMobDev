import { useState } from "react";
import { View, Text, StyleSheet, Button, TextInput, Alert } from "react-native";
import credentials from "../credentials.json";

type SignInProps = {
  setIsSignedIn: (isSignedIn: boolean) => void;
  username: string;
  setUsername: (username: string) => void;
};

const Sign_in: React.FC<SignInProps> = ({ setIsSignedIn, username, setUsername }) => {
  const [password, setPassword] = useState<string>("");

  const validateInput = () => {
    const usernameValid = username.length >= 5;
    const passwordValid =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[\W_]/.test(password);

    if (!usernameValid) {
      Alert.alert("Error", "Username must be at least 5 characters long.");
      return false;
    }
    if (!passwordValid) {
      Alert.alert("Error", "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validateInput()) return;

    const user = credentials.users.find((user) => user.username === username && user.password === password);
    if (user) {
      setIsSignedIn(true);
    } else {
      Alert.alert("Login failed", "Invalid username or password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default Sign_in;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
