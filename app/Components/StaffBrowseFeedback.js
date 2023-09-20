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

export default function StaffBrowseFeedback({ route, navigation }) {
  const [feedbackDetails, setFeedbackDetails] = useState([]);
  const [isLoading, setLoading] = useState(false);
  // const [timestamp, setTimestamp] = useState(false);

  useEffect(() => {
    const getFeedback = async () => {
      console.log("-----GETTING ALL USER-----");

      setLoading(true);
      const feedbackRef = ref(FIREBASE_DB, "feedbacks");
      const snapshot = await get(feedbackRef);

      if (snapshot.exists()) {
        const feedbackData = [];
        // const timestamp = snapshot.val().timestamp;
        // const date = new Date(timestamp);
        // const formattedDate = date.toLocaleString();

        feedbackData.push(snapshot.val());
        setFeedbackDetails(feedbackData);
        // setTimestamp(formattedDate);

        // console.log("feedbackData", feedbackData.timestamp);
        setLoading(false);
      } else {
        setFeedbackDetails([]);
        setLoading(false);
      }
    };

    getFeedback();
  }, []);

  return (
    //     <View style={styles.container}>
    //       <ScrollView>
    //         <View
    //           style={[
    //             styles.innerContainer,
    //             {
    //               marginTop: 50,
    //             },
    //           ]}
    //         >
    //           <Headline>Feedbacks</Headline>
    //           <TouchableOpacity
    //             style={styles.itemContainer}
    //             onPress={() => navigation.goBack()}
    //           >
    //             <Text>Back</Text>
    //           </TouchableOpacity>
    //         </View>
    //       </ScrollView>
    //     </View>
    //   );
    // }

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
          <Headline>Feedbacks</Headline>
          {feedbackDetails.map((feedbackObject) => {
            return Object.keys(feedbackObject).map((feedbackId) => {
              const feedback = feedbackObject[feedbackId];
              const timestamp = new Date(feedback.timestamp);
              return (
                <View key={feedbackId} style={styles.feedbackDetails}>
                  <Text>{timestamp.toLocaleString()}</Text>
                  <Text>Feedback: {feedback.feedback}</Text>
                  <Text>Recipe: {feedback.recipe.title}</Text>
                  <Text>User: {feedback.user}</Text>
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
  feedbackDetails: {
    marginVertical: 10,
    width: "70%",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
