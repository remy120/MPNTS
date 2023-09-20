import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import TextInput from "../../static/TextInput";
import { NumericValidator } from "../../static/NumericValidator";
import { SelectedValidator } from "../../static/SelectedValidator";
import { AgeValidator } from "../../static/AgeValidator";
import { Picker } from "@react-native-picker/picker";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import Spinner from "react-native-loading-spinner-overlay";
import { get, ref, update } from "firebase/database";
import Colors from "../../assets/colors";

export default function Profile({ navigation }) {
  //loading
  const [isLoading, setLoading] = useState(false);
  //dump
  const [count, setCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  //general data
  const [userDetails, setUserDetails] = useState([]);

  const activityOption = [
    { value: 1, option: "Sedentary (little or no exercise)" },
    {
      value: 2,
      option: "Lightly active (light exercise/sports 1-3 days/week)",
    },
    {
      value: 3,
      option: "Moderately active (moderate exercise/sports 3-5 days/week)",
    },
    { value: 4, option: "Very active (hard exercise/sports 6-7 days a week)" },
    {
      value: 5,
      option:
        "Extra active (very hard exercise/sports & physical job or 2x training)",
    },
  ];

  const edit = (userDetails) => {
    navigation.navigate("EditProfile", { userDetails: userDetails });
  };

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;

    const getUser = async () => {
      console.log("----------PROFILE----------");

      setLoading(true);
      if (user) {
        const userRef = ref(FIREBASE_DB, "users/" + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const UD = [];
          UD.push(snapshot.val());
          setUserDetails(UD);
          setLoading(false);
        } else {
          setUserDetails([]);
          setLoading(false);
        }
      }
    };

    getUser();
  }, [isFocused, count]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.upper}></View>

        {userDetails.length > 0 ? (
          <>
            <View style={styles.innerContainer}>
              <Image
                style={styles.img}
                source={
                  userDetails[0].user.gender === "male"
                    ? require("../../assets/img/man.png")
                    : require("../../assets/img/woman.png")
                }
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.details}>{userDetails[0].user.name}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.label}>Age</Text>
              <Text style={styles.details}>{userDetails[0].user.age}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.label}>Height</Text>
              <Text style={styles.details}>{userDetails[0].user.height}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.label}>Weight</Text>
              <Text style={styles.details}>{userDetails[0].user.weight}</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.label}>Activity</Text>
              <Text style={styles.activity}>
                {
                  activityOption.find(
                    (option) => option.value === userDetails[0].user.activity
                  )?.option
                }
              </Text>
            </View>

            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.editBtn} onPress={edit}>
                <Image
                  style={styles.editIcon}
                  source={require("../../assets/img/pen.png")}
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text>Loading user details...</Text>
        )}
        <Spinner
          visible={isLoading}
          textContent={"Loading..."}
          textStyle={{ color: "#FFF" }}
          size={100}
        ></Spinner>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  title: {
    textAlign: "center",
    fontFamily: "",
    fontWeight: "bold",
    fontSize: 26,
    lineHeight: 30,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 12,
  },
  img: {
    width: 170,
    height: 170,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
    width: "80%",
  },
  label: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: -10,
    backgroundColor: Colors.white,
    zIndex: 999,
    width: "25%",
    alignSelf: "center",
    borderRadius: 20,
    elevation: 2,
    borderColor: Colors.grey,
    borderWidth: 0.1,
  },
  details: {
    fontWeight: "bold",
    fontSize: 30,
    color: Colors.darkGrey,
    textAlign: "center",
    borderRadius: 10,
    borderColor: "black",
    paddingTop: 15,
    paddingBottom: 5,
    backgroundColor: Colors.purpleLight,
    // elevation: 2,
  },
  activity: {
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.darkGrey,
    textAlign: "center",
    borderRadius: 10,
    borderColor: "black",
    paddingVertical: 30,
    backgroundColor: Colors.purpleLight,
  },
  btnContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
    width: "80%",
  },
  editBtn: {
    alignSelf: "flex-end",
    marginRight: 20,
  },
  editIcon: {
    width: 70,
    height: 70,
  },
  editText: {
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.white,
    textAlign: "center",
    paddingVertical: 10,
  },
  upper: {
    marginTop: 30,
  },
});
