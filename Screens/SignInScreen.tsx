import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import credentialsData from "../credentials.json"; // Import JSON file

type RootStackParamList = {
  SignIn: undefined;
  Home: { username: string };
};

type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "SignIn">;

const SignInScreen = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  const validateSignIn = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    let valid = true;
    setUsernameError("");
    setPasswordError("");
    setFormError("");

    if (trimmedUsername.length < 5) {
      setUsernameError("Username must be at least 5 characters long!");
      valid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(trimmedPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      valid = false;
    }

    if (!valid) {
      return;
    }

    const user = credentialsData.users.find(
      (cred: { username: string; password: string }) => cred.username === trimmedUsername
    );

    if (!user) {
      setFormError("Username not found!");
      return;
    }

    if (user.password !== trimmedPassword) {
      setFormError("Incorrect password!");
      return;
    }

    navigation.navigate("Home", { username: trimmedUsername });
  };

  return (
    <View style={styles.container}>
      {/* Display the Deadlinez logo */}
      <Image source={require("../assets/deadlinez-logo.png")} style={styles.logo} />

      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      {usernameError ? <Text style={styles.error}>{usernameError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={validateSignIn}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Don't have an account? <Text style={styles.link}>Sign up</Text></Text>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  logo: {
    width: 150,         // Adjust size as needed
    height: 150,
    marginBottom: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#000",
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    width: "100%",
    borderRadius: 8,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  button: { 
    backgroundColor: "#4682B4", 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 8, 
    marginTop: 20, 
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 20,
    color: "#555",
  },
  link: {
    color: "#1E90FF",
    fontWeight: "bold",
  },
});
