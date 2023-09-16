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
import { NavigationProp } from "@react-navigation/native";
import TextInput from "../../static/TextInput";
import { NumericValidator } from "../../static/NumericValidator";
import { SelectedValidator } from "../../static/SelectedValidator";
import { AgeValidator } from "../../static/AgeValidator";
import { Picker } from "@react-native-picker/picker";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ProfileGender = ({ navigation }: RouterProps) => {
  const [height, setHeight] = useState({ value: "", error: "" });
  const [weight, setWeight] = useState({ value: "", error: "" });
  const [age, setAge] = useState({ value: "", error: "" });
  const [gender, setGender] = useState("");

  const [activity, setActivity] = useState("");
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

  const handleGenderSelection = (gender: string) => {
    setGender(gender); // Update the selectedGender state when a button is pressed
  };

  const submit = async () => {
    const weightError = NumericValidator(weight.value);
    const heightError = NumericValidator(height.value);
    const ageError = AgeValidator(age.value);
    const genderError = SelectedValidator(gender);

    if (heightError || weightError || ageError) {
      setHeight((height) => ({ ...height, error: heightError }));
      setWeight((weight) => ({ ...weight, error: weightError }));
      setAge((age) => ({ ...age, error: ageError }));
      return;
    }
    if (genderError) {
      alert("Please select the gender.");
      return;
    }
    if (activity == null) {
      alert("Please select an activity.");
      return;
    }

    try {
      let totalCalories = 0;
      if (gender === "male" && parseInt(activity) === 1) {
        totalCalories =
          1.2 *
          (66.5 +
            13.75 * parseFloat(weight.value) +
            5.003 * parseFloat(height.value) -
            6.755 * parseFloat(age.value));
      } else if (gender === "male" && parseInt(activity) === 2) {
        totalCalories =
          1.375 *
          (66.5 +
            13.75 * parseFloat(weight.value) +
            5.003 * parseFloat(height.value) -
            6.755 * parseFloat(age.value));
      } else if (gender === "male" && parseInt(activity) === 3) {
        totalCalories =
          1.55 *
          (66.5 +
            13.75 * parseFloat(weight.value) +
            5.003 * parseFloat(height.value) -
            6.755 * parseFloat(age.value));
      } else if (gender === "male" && parseInt(activity) === 4) {
        totalCalories =
          1.725 *
          (66.5 +
            13.75 * parseFloat(weight.value) +
            5.003 * parseFloat(height.value) -
            6.755 * parseFloat(age.value));
      } else if (gender === "male" && parseInt(activity) === 5) {
        totalCalories =
          1.9 *
          (66.5 +
            13.75 * parseFloat(weight.value) +
            5.003 * parseFloat(height.value) -
            6.755 * parseFloat(age.value));
      } else if (gender === "female" && parseInt(activity) === 1) {
        totalCalories =
          1.2 *
          (655 +
            9.563 * parseFloat(weight.value) +
            1.85 * parseFloat(height.value) -
            4.676 * parseFloat(age.value));
      } else if (gender === "female" && parseInt(activity) === 2) {
        totalCalories =
          1.375 *
          (655 +
            9.563 * parseFloat(weight.value) +
            1.85 * parseFloat(height.value) -
            4.676 * parseFloat(age.value));
      } else if (gender === "female" && parseInt(activity) === 3) {
        totalCalories =
          1.55 *
          (655 +
            9.563 * parseFloat(weight.value) +
            1.85 * parseFloat(height.value) -
            4.676 * parseFloat(age.value));
      } else if (gender === "female" && parseInt(activity) === 4) {
        totalCalories =
          1.725 *
          (655 +
            9.563 * parseFloat(weight.value) +
            1.85 * parseFloat(height.value) -
            4.676 * parseFloat(age.value));
      } else {
        totalCalories =
          1.9 *
          (655 +
            9.563 * parseFloat(weight.value) +
            1.85 * parseFloat(height.value) -
            4.676 * parseFloat(age.value));
      } //(Codeprojects, 2023)

      const CalorieCalculator = {
        age: age.value,
        height: height.value,
        weight: weight.value,
        gender,
        activity,
        totalCalories: totalCalories.toFixed(2),
      };
      console.log("CalorieCalculator", CalorieCalculator);
      navigation.navigate("Profile", { calorieCalculator: CalorieCalculator });
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An error occurred");
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Select Gender</Text>
        <View style={styles.innerContainer}>
          <TouchableOpacity
            style={[gender === "male" ? styles.selectedButton : styles.button]}
            onPress={() => handleGenderSelection("male")}
          >
            <Image
              style={styles.icon}
              source={require("../../assets/img/man.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              gender === "female" ? styles.selectedButton : styles.button,
            ]}
            // style={gender === "female" && styles.selectedButton}
            onPress={() => handleGenderSelection("female")}
          >
            <Image
              style={styles.icon}
              source={require("../../assets/img/woman.png")}
            />
          </TouchableOpacity>
        </View>

        <View>
          <TextInput
            label="Age"
            returnKeyType="next"
            value={age.value}
            onChangeText={
              (text: string) =>
                setAge((prevAge) => ({ ...prevAge, value: text })) // Update the value property
            }
            keyboardType="numeric"
            // error={!!model.error}
            // errorText={model.error}
            description={undefined}
            errorText={age.error}
          />
        </View>

        <View>
          <TextInput
            label="Height"
            returnKeyType="next"
            value={height.value}
            onChangeText={
              (text: string) =>
                setHeight((prevHeight) => ({ ...prevHeight, value: text })) // Update the value property
            }
            keyboardType="numeric"
            // error={!!model.error}
            // errorText={model.error}
            description={undefined}
            errorText={height.error}
          />
        </View>

        <View>
          <TextInput
            label="Weight"
            returnKeyType="next"
            value={weight.value}
            onChangeText={
              (text: string) =>
                setWeight((prevWeight) => ({ ...prevWeight, value: text })) // Update the value property
            }
            keyboardType="numeric"
            // error={!!model.error}
            // errorText={model.error}
            description={undefined}
            errorText={weight.error}
          />
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={activity}
            onValueChange={(itemValue, itemIndex) => {
              setActivity(itemValue);
            }}
          >
            <Picker.Item label="Select one activity" value={null} />
            {activityOption.map((option, index) => (
              <Picker.Item
                label={option.option}
                value={option.value}
                key={index}
              />
            ))}
          </Picker>
        </View>

        <View>
          <Text style={styles.desc}>
            We never share your personal information with any third party
          </Text>
          <TouchableOpacity style={styles.nextBtn} onPress={submit}>
            <Text style={styles.nextText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileGender;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    // width: "100%",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontFamily: "",
    fontWeight: "bold",
    fontSize: 26,
    lineHeight: 30,
  },
  desc: { textAlign: "center" },
  icon: { width: 120, height: 120 },
  button: {
    // width: 150,
    // height: 170,
    // paddingTop: 40,
    // marginHorizontal: 20,
    // flexDirection: "column",
    // alignItems: "center",
    // borderRadius: 10,
    // borderColor: "#00000",
    // marginBottom: 10,
    // borderWidth: 1,
    opacity: 0.5,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "80%",
    marginVertical: 12,
  },
  nextBtn: {
    width: "100%",
    height: 50,
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#00000",
    borderWidth: 1,
  },
  nextText: {
    fontFamily: "",
    fontSize: 24,
    paddingVertical: 5,
  },
  selectedButton: {
    borderWidth: 5,
    borderRadius: 100,
  },
  pickerContainer: {
    width: "100%",
    marginVertical: 17,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
    overflow: "hidden",
  },
  picker: {
    backgroundColor: "white",
    height: 50,
  },
});
