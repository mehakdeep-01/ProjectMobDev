import { StyleSheet, View, Button } from "react-native";
import { useEffect, useState } from "react";
import SignIn from "../components/sign_in";
import SignUp from "../components/sign_up";
import Welcome from "../components/welcome";
import supabase from "../lib/supabase";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [showSignUp, setShowSignUp] = useState<boolean>(false);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: session } = await supabase.auth.getUser();
      if (session?.user) {
        setIsSignedIn(true);
        setEmail(session.user.email ?? "");
      }
    };
    checkUserSession();
  }, []);

  return (
    <View style={styles.container}>
      {isSignedIn ? (
        <Welcome />
      ) : showSignUp ? (
        <SignUp setIsSignedIn={setIsSignedIn} />
      ) : (
        <SignIn setIsSignedIn={setIsSignedIn} email={email} setEmail={setEmail} />
      )}
      {!isSignedIn && (
        <View style={styles.toggleContainer}>
          <Button
            title={showSignUp ? "Back to Login" : "Create an Account"}
            onPress={() => setShowSignUp(!showSignUp)}
          />
        </View>
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
  toggleContainer: {
    marginTop: 20,
  },
});
