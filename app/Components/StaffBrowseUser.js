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
import React, { useState, useEffect } from "react";
import Colors from "../../assets/colors";
import { ref, update, get } from "firebase/database";
import Spinner from "react-native-loading-spinner-overlay";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { Headline } from "react-native-paper";

export default function StaffBrowseUser({ route, navigation }) {
  const [userDetails, setUserDetails] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      console.log("-----GETTING ALL USER-----");

      setLoading(true);
      const userRef = ref(FIREBASE_DB, "users");
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = [];
        userData.push(snapshot.val());
        setUserDetails(userData);

        setLoading(false);
      } else {
        setUserDetails([]);
        setLoading(false);
      }
    };

    getUser();
    console.log("User Details", userDetails);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          padding: 20,
          marginTop: 50,
        }}
      >
        <View
          style={[
            styles.innerContainer,
            {
              marginTop: 50,
            },
          ]}
        >
          <Headline>Users</Headline>
          {userDetails.map((userObject) => {
            return Object.keys(userObject).map((userId) => {
              const user = userObject[userId];
              return (
                <View key={userId} style={styles.userDetails}>
                  <Text>Name: {user.user.name}</Text>
                  <Text>Age: {user.user.age}</Text>
                  <Text>
                    Gender: {user.user.gender === "male" ? "Male" : "Female"}
                  </Text>
                  <Text>Allergens:</Text>
                  {user.allergen ? (
                    Object.keys(user.allergen).map((allergenKey, index) => {
                      const allergen = user.allergen[allergenKey];
                      return (
                        <View key={index}>
                          <Text>
                            {"\u2022"} {allergen.name}
                          </Text>
                        </View>
                      );
                    })
                  ) : (
                    <Text>No allergen information available</Text>
                  )}
                  {/* Add more user details here */}
                </View>
              );
            });
          })}
          <Spinner
            visible={isLoading}
            textContent={"Loading..."}
            textStyle={{ color: "#FFF" }}
            size={100}
          ></Spinner>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.goBack()}
          >
            <Text>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  innerContainer: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    backgroundColor: Colors.purpleLight,
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.purpleDark,
  },
  userDetails: {
    marginVertical: 10,
    width: "70%",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
