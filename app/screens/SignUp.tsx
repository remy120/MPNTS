import {
  TextInput,
  Platform,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { categories } from "../../static/Constant";

const SignUp = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const Register = async () => {
    setLoading(true);
    try {
      //   const response = await createUserWithEmailAndPassword(
      //     auth,
      //     email,
      //     password
      //   );
      //   alert("Registered!");
      //   const responseLogin = await signInWithEmailAndPassword(
      //     auth,
      //     email,
      //     password
      //   );
      //   console.log(responseLogin);
      //   navigation.navigate("Details");
      navigation.navigate("ProfileSetUp");
    } catch (error: any) {
      console.log(error);
      alert("Sign Up failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text>Register</Text>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        ></TextInput>
        {/* <Button title="Back" onPress={() => navigation.goBack()} /> */}

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button title="Create Account" onPress={Register}></Button>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});
