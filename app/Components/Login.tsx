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

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Login = ({ navigation }: RouterProps) => {
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const [clickCount, setClickCount] = useState(0);
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  useFocusEffect(
    React.useCallback(() => {
      // Reset the click count to 0 when the screen gains focus
      setClickCount(0);
    }, [])
  );

  const handleImageClick = () => {
    setClickCount(clickCount + 1);
    if (clickCount === 9) {
      navigation.navigate("StaffHome");
    }
  };

  const SignIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <KeyboardAvoidingView behavior="padding"> */}
      <View style={styles.upperImg}>
        <Image
          style={styles.upper}
          source={require("../../assets/img/graph.png")}
        />
        <TouchableOpacity activeOpacity={1.0} onPress={handleImageClick}>
          <Image
            style={styles.upper}
            source={require("../../assets/img/graph-1.png")}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.headline}>LOGIN</Text>

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
            <TouchableOpacity style={styles.loginBtn} onPress={SignIn}>
              <Ionicons
                name={"arrow-forward-circle"}
                size={70}
                color={Colors.purpleSelected}
              />
            </TouchableOpacity>
          </>
        )}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpTxt}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.signUpBtn}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
        <Image
          style={styles.below}
          source={require("../../assets/img/graph-3.png")}
        />
      </View>
      {/* </KeyboardAvoidingView> */}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  upperImg: {
    flexDirection: "row",
  },
  upper: {
    marginTop: -80,
    marginLeft: -90,
    width: 300,
    height: 300,
    transform: [{ rotate: "90deg" }],
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
    height: 500,
    width: 500,
    marginLeft: -80,
  },
});
