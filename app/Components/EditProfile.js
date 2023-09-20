import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import TextInput from "../../static/TextInput";
import { NumericValidator } from "../../static/NumericValidator";
import { SelectedValidator } from "../../static/SelectedValidator";
import { AgeValidator } from "../../static/AgeValidator";
import { NameValidator } from "../../static/NameValidator";
import { Picker } from "@react-native-picker/picker";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { ref, set } from "firebase/database";
import Colors from "../../assets/colors";

export default function EditProfile({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
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

  const handleGenderSelection = (gender) => {
    setGender(gender); // Update the selectedGender state when a button is pressed
  };

  const submit = async () => {
    const weightError = NumericValidator(weight.value);
    const heightError = NumericValidator(height.value);
    const ageError = AgeValidator(age.value);
    const nameError = NameValidator(name.value);
    const genderError = SelectedValidator(gender);

    if (heightError || weightError || ageError || nameError) {
      setHeight((height) => ({ ...height, error: heightError }));
      setWeight((weight) => ({ ...weight, error: weightError }));
      setAge((age) => ({ ...age, error: ageError }));
      setName((name) => ({ ...name, error: nameError }));
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
      let proteinMin = 0;
      let proteinMax = 0;
      let fatMin = 0;
      let fatMax = 0;
      let water = 0;
      if (gender === "male" && parseInt(activity) === 1) {
        totalCalories =
          1.2 *
          (66.5 +
            13.75 * parseFloat(weight.value) +
            5.003 * parseFloat(height.value) -
            6.755 * parseInt(age.value));
      } else if (gender === "male" && parseInt(activity) === 2) {
        totalCalories =
          1.375 *
          (66.5 +
            13.75 * parseFloat(weight.value) +
            5.003 * parseFloat(height.value) -
            6.755 * parseInt(age.value));
      } else if (gender === "male" && parseInt(activity) === 3) {
        totalCalories =
          1.55 *
          (66.5 +
            13.75 * parseFloat(weight.value) +
            5.003 * parseFloat(height.value) -
            6.755 * parseInt(age.value));
      } else if (gender === "male" && parseInt(activity) === 4) {
        totalCalories =
          1.725 *
          (66.5 +
            13.75 * parseFloat(weight.value) +
            5.003 * parseFloat(height.value) -
            6.755 * parseInt(age.value));
      } else if (gender === "male" && parseInt(activity) === 5) {
        totalCalories =
          1.9 *
          (66.5 +
            13.75 * parseFloat(weight.value) +
            5.003 * parseFloat(height.value) -
            6.755 * parseInt(age.value));
      } else if (gender === "female" && parseInt(activity) === 1) {
        totalCalories =
          1.2 *
          (655 +
            9.563 * parseFloat(weight.value) +
            1.85 * parseFloat(height.value) -
            4.676 * parseInt(age.value));
      } else if (gender === "female" && parseInt(activity) === 2) {
        totalCalories =
          1.375 *
          (655 +
            9.563 * parseFloat(weight.value) +
            1.85 * parseFloat(height.value) -
            4.676 * parseInt(age.value));
      } else if (gender === "female" && parseInt(activity) === 3) {
        totalCalories =
          1.55 *
          (655 +
            9.563 * parseFloat(weight.value) +
            1.85 * parseFloat(height.value) -
            4.676 * parseInt(age.value));
      } else if (gender === "female" && parseInt(activity) === 4) {
        totalCalories =
          1.725 *
          (655 +
            9.563 * parseFloat(weight.value) +
            1.85 * parseFloat(height.value) -
            4.676 * parseInt(age.value));
      } else {
        totalCalories =
          1.9 *
          (655 +
            9.563 * parseFloat(weight.value) +
            1.85 * parseFloat(height.value) -
            4.676 * parseInt(age.value));
      } //(Codeprojects, 2023)

      if (parseInt(age.value) > 3) {
        proteinMin = (totalCalories * 10) / 100 / 4;
        proteinMax = (totalCalories * 30) / 100 / 4;
      } else {
        proteinMin = (totalCalories * 5) / 100 / 4;
        proteinMax = (totalCalories * 20) / 100 / 4;
      }

      if (parseInt(age.value) <= 3) {
        fatMin = (totalCalories * 30) / 100 / 9;
        fatMax = (totalCalories * 40) / 100 / 9;
      } else if (parseInt(age.value) <= 18 && parseInt(age.value) >= 4) {
        fatMin = (totalCalories * 25) / 100 / 9;
        fatMax = (totalCalories * 35) / 100 / 9;
      } else {
        fatMin = (totalCalories * 20) / 100 / 9;
        fatMax = (totalCalories * 35) / 100 / 9;
      }

      if (gender === "female") {
        if (parseInt(age.value) >= 9 && parseInt(age.value) <= 13) {
          water = 2100;
        } else if (parseInt(age.value) > 13 && parseInt(age.value) <= 18) {
          water = 2300;
        } else if (parseInt(age.value) > 18) {
          water = 2700;
        } else {
          water = 1700;
        }
      } else {
        if (parseInt(age.value) >= 9 && parseInt(age.value) <= 13) {
          water = 2400;
        } else if (parseInt(age.value) > 13 && parseInt(age.value) <= 18) {
          water = 3300;
        } else if (parseInt(age.value) > 18) {
          water = 3700;
        } else {
          water = 1700;
        }
      }

      let carbMin = (totalCalories * 45) / 100 / 4;
      let carbMax = (totalCalories * 65) / 100 / 4;
      let fiber = (totalCalories / 1000) * 14;

      const user = FIREBASE_AUTH.currentUser;

      if (user) {
        const userID = user.uid;
        set(ref(FIREBASE_DB, "users/" + userID + "/user"), {
          name: name.value,
          age: parseInt(age.value),
          height: parseFloat(height.value).toFixed(2),
          weight: parseFloat(weight.value).toFixed(2),
          gender,
          activity,
          totalCalories: parseFloat(totalCalories.toFixed(2)),
          proteinMin: Math.floor(proteinMin),
          proteinMax: Math.floor(proteinMax),
          fatMin: Math.floor(fatMin),
          fatMax: Math.floor(fatMax),
          carbMin: Math.floor(carbMin),
          carbMax: Math.floor(carbMax),
          fiber: Math.floor(fiber),
          water,
        });

        navigation.goBack();
      } else {
        console.log("User not authenticated");
      }
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
        <Text style={styles.title}>Personal Information</Text>
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

        <View style={styles.input}>
          <TextInput
            label="Name"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) =>
              setName((prevName) => ({ ...prevName, value: text }))
            }
            keyboardType="default"
            // error={!!model.error}
            // errorText={model.error}
            description={undefined}
            errorText={name.error}
          />
        </View>

        <View style={styles.input}>
          <TextInput
            label="Age"
            returnKeyType="next"
            value={age.value}
            onChangeText={
              (text) => setAge((prevAge) => ({ ...prevAge, value: text })) // Update the value property
            }
            keyboardType="numeric"
            // error={!!model.error}
            // errorText={model.error}
            description={undefined}
            errorText={age.error}
          />
        </View>

        <View style={styles.input}>
          <TextInput
            label="Height"
            returnKeyType="next"
            value={height.value}
            onChangeText={
              (text) =>
                setHeight((prevHeight) => ({ ...prevHeight, value: text })) // Update the value property
            }
            keyboardType="numeric"
            // error={!!model.error}
            // errorText={model.error}
            description={undefined}
            errorText={height.error}
          />
        </View>

        <View style={styles.input}>
          <TextInput
            label="Weight"
            returnKeyType="next"
            value={weight.value}
            onChangeText={
              (text) =>
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
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.nextText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    width: "80%",
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    fontFamily: "",
    fontWeight: "bold",
    fontSize: 26,
    lineHeight: 30,
  },
  desc: {
    textAlign: "center",
    width: "80%",
    alignSelf: "center",
    // marginTop: 10,
  },
  icon: {
    width: 120,
    height: 120,
  },
  button: {
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
    backgroundColor: "black",
    paddingVertical: 5,
    marginTop: 10,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
  },
  nextText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },
  selectedButton: {
    borderWidth: 5,
    borderRadius: 100,
  },
  pickerContainer: {
    width: "80%",
    alignSelf: "center",
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
