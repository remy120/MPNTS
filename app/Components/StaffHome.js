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

export default function StaffHome({ route, navigation }) {
  const BrowseUsers = () => {
    navigation.navigate("StaffBrowseUser");
  };
  const BrowseFeedbacks = () => {
    navigation.navigate("StaffBrowseFeedback");
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View
          style={[
            styles.innerContainer,
            {
              marginTop: 50,
            },
          ]}
        >
          <Headline>Staff Dashboard</Headline>
          <TouchableOpacity style={styles.itemContainer} onPress={BrowseUsers}>
            <Text>All Users</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={BrowseFeedbacks}
          >
            <Text>All Feedbacks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.goBack()}
          >
            <Text>Exit</Text>
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
});
