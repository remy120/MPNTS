import {
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
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import TextInput from "../../static/TextInput";
import Colors from "../../assets/colors";
import { Headline } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const SignUp = ({ navigation }: any) => {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const Register = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      alert("Registered!");
      const responseLogin = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
    } catch (error: any) {
      console.log(error.message);
      if (error.message === "Firebase: Error (auth/invalid-email).") {
        alert("Please enter a valid email address.");
      } else if (error.message === "Firebase: Error (auth/missing-password).") {
        alert("Missing password. Please do not leave the password empty.");
      } else if (
        error.message === "Firebase: Error (auth/email-already-in-use)."
      ) {
        alert("Account existed. Please proceed to login.");
      } else if (error.message === "Firebase: Error (auth/missing-email).") {
        alert("Please do not leave the email address empty.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperImg}>
        <Image
          style={styles.upper}
          source={require("../../assets/img/graph-1.png")}
        />
        <Image
          style={styles.upper}
          source={require("../../assets/img/graph.png")}
        />
      </View>
      <Text style={styles.headline}>Register</Text>

      <View style={styles.innerContainer}>
        <View style={styles.input}>
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email}
            onChangeText={(text: string) =>
              setEmail((prevEmail) => ({ ...prevEmail, value: text }))
            }
            keyboardType="default"
            // error={!!model.error}
            // errorText={model.error}
            description={undefined}
            errorText={email.error}
          />
        </View>

        <View style={styles.input}>
          <TextInput
            label="Password"
            returnKeyType="next"
            value={password}
            onChangeText={(text: string) =>
              setPassword((prevPassword) => ({
                ...prevPassword,
                value: text,
              }))
            }
            keyboardType="default"
            // error={!!model.error}
            // errorText={model.error}
            description={undefined}
            errorText={password.error}
            secureTextEntry={true}
          />
        </View>

        {loading ? (
          <ActivityIndicator
            size={50}
            color="#0000ff"
            style={{
              height: 115,
            }}
          />
        ) : (
          <>
            <TouchableOpacity style={styles.loginBtn} onPress={Register}>
              <Ionicons
                name={"arrow-forward-circle"}
                size={70}
                color={Colors.purpleSelected}
              />
            </TouchableOpacity>
          </>
        )}
        <Image
          style={styles.below}
          source={require("../../assets/img/graph-3.png")}
        />
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  upperImg: {
    flexDirection: "row",
  },
  upper: {
    marginTop: -50,
    marginLeft: -90,
    width: 300,
    height: 300,
    transform: [{ rotate: "70deg" }],
  },
  headline: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
  },
  innerContainer: {
    width: "100%",
    marginTop: 30,
  },
  input: {
    width: "80%",
    alignSelf: "center",
  },
  loginBtn: {
    marginVertical: 20,
    alignSelf: "center",
  },
  textBtn: {
    textAlign: "center",
  },
  signUpContainer: {
    flexDirection: "row",
    width: "80%",
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  signUpTxt: {
    fontSize: 18,
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  signUpBtn: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
    color: Colors.purpleDarkest,
  },
  below: {
    height: 400,
    width: 400,
    marginLeft: -80,
  },
});
