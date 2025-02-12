import { StyleSheet, Text, View } from 'react-native';
import Sign_in from "../components/sign_in";
import Welcome from "../components/welcome";
import { useState } from 'react';


export default function App() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  return (
    <View style={styles.container}>
      {isSignedIn ? (
        <Welcome 
          username={username || "Guest"} 
          city="Unknown" 
          url="https://example.com" 
          color="blue" 
          size={42} 
        />
      ) : (
        <Sign_in setIsSignedIn={setIsSignedIn} username={username} setUsername={setUsername} />
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",

  },
});