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

export default function Bookmark({ route, navigation }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [pastMealPlans, setPastMealPlans] = useState([]);

  //dump
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  const convertToArray = (data) => {
    return Object.keys(data).map((uid) => ({
      uid,
      ...data[uid],
    }));
  };

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser.uid;
    const getAllBookmarks = async () => {
      try {
        const dataRef = ref(FIREBASE_DB, "users/" + user);
        const snapshot = await get(dataRef);

        if (snapshot.exists()) {
          const bookmark = snapshot.val().bookmark
            ? convertToArray(snapshot.val().bookmark)
            : [];
          const pastMealPlan = snapshot.val().mealPlan
            ? snapshot.val().mealPlan
            : [];
          setBookmarks(bookmark);
          setPastMealPlans(pastMealPlan);
          console.log("pastMealPlans", pastMealPlans);
        } else {
          // No data found
          setBookmarks([]);
          setPastMealPlans([]);
        }
      } catch (error) {
        console.error("Error fetching bookmark and past meal plans: ", error);
      }
    };

    getAllBookmarks();
  }, [isFocused]);

  const onSelect = (mealPlanItem) => {
    // Navigate to the "MealPlanDetail" screen with the selected meal plan item
    navigation.navigate("MealPlanDetails", { mealPlanItem });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.innerContainer,
            {
              marginTop: 50,
            },
          ]}
        >
          <Headline>My Bookmarks</Headline>
          {bookmarks.length === 0 ? (
            <>
              <Text>No bookmarked recipe.</Text>
              <Text>Start saving your favourite recipes in here!</Text>
            </>
          ) : (
            bookmarks.map((item, index) => (
              <TouchableOpacity
                style={styles.itemContainer}
                key={index}
                onPress={() => {
                  onSelect(item);
                }}
              >
                <View>
                  <Text>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.innerContainer}>
          <Headline>My Past Recipes</Headline>
          {pastMealPlans.length === 0 ? (
            <>
              <Text>No meal plans.</Text>
              <Text>Start generating your personalized meal plan now!</Text>
            </>
          ) : (
            // pastMealPlans.map((item, index) => (
            //   <TouchableOpacity
            //     style={styles.itemContainer}
            //     key={index}
            //     onPress={() => {
            //       onSelect(item[0]);
            //     }}
            //   >
            //     <View>
            //     <Text>{dayObject[mealIndex].title}</Text>
            //   </View>
            //   </TouchableOpacity>
            // ))
            pastMealPlans.map((dayObject, dayIndex) => (
              <View key={dayIndex}>
                <Text>Day {dayIndex + 1}</Text>
                {Object.keys(dayObject).map((mealIndex) => (
                  <TouchableOpacity
                    style={styles.itemContainer}
                    key={mealIndex}
                    onPress={() => {
                      onSelect(dayObject[mealIndex]);
                    }}
                  >
                    <View>
                      <Text>{dayObject[mealIndex].title}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}
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
