import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import TextInput from "../../static/TextInput";
import Colors from "../../assets/colors";
import { ref, push, update, get, set } from "firebase/database";
import Spinner from "react-native-loading-spinner-overlay";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { FeedbackValidator } from "../../static/FeedbackValidator";
import { LinearGradient } from "expo-linear-gradient";

export default function MealPlanDetails({ route, navigation }) {
  const { mealPlanItem } = route.params;
  const [feedback, setFeedback] = useState({ value: "", error: "" });

  //loading
  const [isLoading, setLoading] = useState(false);

  const [bookmark, setBookmark] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const convertToArray = (data) => {
    return Object.keys(data).map((uid) => ({
      uid,
      ...data[uid],
    }));
  };

  const submit = async () => {
    const feedbackError = FeedbackValidator(feedback.value);

    if (feedbackError) {
      setFeedback((feedback) => ({ ...feedback, error: feedbackError }));
      return;
    }

    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userID = user.uid;
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();

        const feedbackData = {
          user: userID,
          feedback: feedback.value,
          recipe: mealPlanItem,
          timestamp: formattedDate,
        };

        const feedbackRef = ref(FIREBASE_DB, "feedbacks/");
        await push(feedbackRef, feedbackData);
        setIsUpdated(true);
        alert("Feedback submitted! Thanks for helping us to improve.");

        // Clear the feedback input
        setFeedback((prevFeedback) => ({ ...prevFeedback, value: "" }));
      } else {
        console.log("User not authenticated");
      }
    } catch (err) {
      console.log("Error in submitting feedback" + err);
    }
  };

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser.uid;
    const checkBookmarkExist = async () => {
      try {
        const getAllBookmarksRef = ref(
          FIREBASE_DB,
          "users/" + user + "/bookmark"
        );
        const snapshot = await get(getAllBookmarksRef);

        if (snapshot.exists()) {
          let exist = false;
          const bookmarkData = convertToArray(snapshot.val());
          bookmarkData.map((item, index) => {
            if (item.title == mealPlanItem.title) {
              exist = true;
            }
          });
          if (exist) {
            setBookmark(true);
            console.log("Recipe in bookmark");
          } else {
            setBookmark(false);
          }
        } else {
          setBookmark(false);
        }
      } catch (error) {
        console.error("Error fetching bookmark to check existence: ", error);
      }
    };

    checkBookmarkExist();
  }, [isUpdated]);

  const save = async () => {
    const user = FIREBASE_AUTH.currentUser.uid;
    const getAllBookmarksRef = ref(FIREBASE_DB, "users/" + user + "/bookmark");
    const snapshot = await get(getAllBookmarksRef);

    if (snapshot.exists()) {
      let exist = false;
      let bookmarkKey = "";
      const bookmarkData = convertToArray(snapshot.val());
      bookmarkData.map((item, index) => {
        if (item.title == mealPlanItem.title) {
          exist = true;
          bookmarkKey = item.uid;
        }
      });
      if (exist) {
        const itemRef = ref(
          FIREBASE_DB,
          "users/" + user + "/bookmark/" + bookmarkKey
        );
        await set(itemRef, null);
        setBookmark(false);
        setIsUpdated(false);
        console.log("Recipe removed from bookmark");
      } else {
        upload();
      }
    } else {
      upload();
    }
  };

  const upload = async () => {
    const user = FIREBASE_AUTH.currentUser.uid;
    const bookmarkRef = ref(FIREBASE_DB, "users/" + user + "/bookmark");
    // const newBookmarkRef = push(bookmarkRef, mealPlanItem);
    await push(bookmarkRef, mealPlanItem);
    setIsUpdated(true);
    console.log("Added to bookmark");
  };

  const bookmarkStyle = {
    backgroundColor: bookmark ? Colors.orangeDark : Colors.white,
    borderRadius: 15,
    padding: 15,
    position: "absolute",
    right: 30,
    marginTop: -30,
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name={"chevron-back-outline"}
            size={35}
            color={Colors.lightGrey}
          />
        </TouchableOpacity>

        <Image
          style={styles.img}
          source={require("../../assets/img/food-1.png")}
        />

        <View style={styles.mealDetails}>
          <TouchableOpacity onPress={save} style={bookmarkStyle}>
            <Ionicons
              name={bookmark ? "bookmark" : "bookmark-outline"}
              size={25}
              color={bookmark ? "black" : "grey"}
            />
          </TouchableOpacity>
          <Text style={styles.mealTitle}>{mealPlanItem.title}</Text>
          <Text style={styles.description}>{mealPlanItem.desc}</Text>

          <View style={styles.categories}>
            {mealPlanItem.categories.map((item, index) => (
              <Text style={styles.categoriesText}>
                {"\u2022"} {item.toUpperCase()}
                {"  "}
              </Text>
            ))}
          </View>

          <Text style={styles.nutritionalInfo}>
            Calories: {mealPlanItem.calories} | Protein: {mealPlanItem.protein}g
            | Fat: {mealPlanItem.fat}g | Sodium: {mealPlanItem.sodium}mg
          </Text>
          <Text style={styles.nutritionalInfo}>Ingredients</Text>
          {mealPlanItem.ingredients.map((item, index) => (
            <Text style={styles.ingredients}>
              {"\u2022"} {item}
            </Text>
          ))}
          <Text style={styles.directions}>Directions:</Text>
          {mealPlanItem.directions.map((item, index) => (
            <Text style={styles.directions}>
              {index + 1}. {item}
            </Text>
          ))}
        </View>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />

        <View>
          <TextInput
            label="Tell us your feedback"
            returnKeyType="next"
            value={feedback.value}
            onChangeText={(text) =>
              setFeedback((prevFeedback) => ({ ...prevFeedback, value: text }))
            }
            keyboardType="default"
            description="Feel free to provide feedback to us regarding this recipe"
            errorText={feedback.error}
          />
        </View>

        <TouchableOpacity onPress={submit} style={styles.submitBtn}>
          <Ionicons name={"enter-outline"} size={40} color={"grey"} />
        </TouchableOpacity>

        <LinearGradient
          colors={[Colors.pink1, Colors.pink2, Colors.pink2Dark]}
          style={styles.box}
        ></LinearGradient>
        <Spinner
          visible={isLoading}
          textContent={"Adding..."}
          textStyle={{ color: "#FFF" }}
          size={100}
        ></Spinner>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.pink1,
  },
  img: {
    height: 300,
    width: "100%",
  },
  mealDetails: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: "90%",
    alignSelf: "center",
    marginTop: -50,
    backgroundColor: Colors.white,
    borderRadius: 25,
  },
  mealTitle: {
    textAlign: "center",
    fontFamily: "",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 30,
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: Colors.lightGrey,
  },
  nutritionalInfo: {
    marginVertical: 5,
    fontSize: 16,
  },
  ingredients: {
    fontSize: 16,
    marginLeft: 20,
  },
  directions: {
    fontSize: 16,
  },
  button: {
    marginTop: 16,
  },
  box: {
    position: "absolute",
    bottom: 0,
    height: 600,
    width: "100%",
    zIndex: -99,
  },
  backBtn: {
    position: "absolute",
    top: 40,
    marginLeft: 20,
    padding: 10,
    backgroundColor: Colors.white,
    zIndex: 999,
    borderRadius: 15,
    elevation: 5,
  },
  categories: {
    marginVertical: 5,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoriesText: {
    color: Colors.greenCategory,
  },
});
