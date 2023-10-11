import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { ref, set } from "firebase/database";
import Colors from "../../assets/colors";
import { Headline } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface RouterProps {
  route: {
    params: {
      calorieCalculator: {
        age: number;
        height: number;
        weight: number;
        gender: string;
        activity: string;
      };
    };
  };
}

const Allergen = ({ route }: any) => {
  const { calorieCalculator } = route.params;
  const navigation = useNavigation();

  const [data, setData] = useState([
    {
      name: "dairy",
      state: false,
      img: require("../../assets/img/dairy.png"),
    },
    {
      name: "egg",
      state: false,
      img: require("../../assets/img/egg.png"),
    },
    {
      name: "peanut",
      state: false,
      img: require("../../assets/img/peanut.png"),
    },
    {
      name: "seafood",
      state: false,
      img: require("../../assets/img/seafood.png"),
    },
    {
      name: "soy",
      state: false,
      img: require("../../assets/img/soy.png"),
    },
    {
      name: "wheat",
      state: false,
      img: require("../../assets/img/wheat.png"),
    },
    {
      name: "vegetarian",
      state: false,
      img: require("../../assets/img/vegetarian.png"),
    },
  ]);

  const onSelect = (ind: number) => {
    const tempData: { name: string; state: boolean; img: any }[] = data.map(
      (item, index) => {
        if (index === ind) {
          if (item.state == true) {
            // if(item.name === "")
            return { name: item.name, state: false, img: item.img };
          } else {
            return { name: item.name, state: true, img: item.img };
          }
        } else {
          if (item.state == true) {
            return { name: item.name, state: true, img: item.img };
          } else {
            return { name: item.name, state: false, img: item.img };
          }
        }
      }
    );
    setData(tempData);
  };

  const submit = async () => {
    const user = FIREBASE_AUTH.currentUser;

    // Filter the data to only keep items with state is true
    const filteredData = data
      .filter((item) => item.state)
      .map((item) => ({ name: item.name }));

    if (user) {
      const userID = user.uid;
      // // Reference to Firebase Realtime Database with a dynamic path
      // const userRef = ref(FIREBASE_DB, `users/${user.uid}`);

      // // Push the data to the database
      // await push(userRef, combinedData);
      set(ref(FIREBASE_DB, "users/" + userID), {
        user: calorieCalculator,
        allergen: filteredData,
      });

      navigation.navigate("LoggedWProfile" as never);
    } else {
      // Handle the case when the user is not authenticated
      console.log("User not authenticated");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Let's get to know you</Text>
          <Text style={styles.desc}>
            Select if you have any of these allergies.
          </Text>
          {/* <FlatList
          data={data}
          renderItem={({ item, index }) => {
            return ( */}
          <View style={styles.allergenView}>
            <View style={styles.allergenBtn}>
              {data.map((item, index) => (
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      borderColor:
                        item.state == true
                          ? Colors.purpleSelectedDark
                          : Colors.pink2,
                    },
                  ]}
                  key={index}
                  onPress={() => {
                    onSelect(index);
                  }}
                >
                  <Image style={styles.allergyIcon} source={item.img} />
                  <Text style={styles.iconText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.descBtnText}>
              Generate personalized meal plan if you're ready
            </Text>
            <TouchableOpacity style={styles.generateMealBtn} onPress={submit}>
              <Text style={styles.btnText}>GENERATE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Allergen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  innerContainer: {
    marginTop: 70,
    alignSelf: "center",
  },
  title: {
    fontSize: 35,
    textAlign: "center",
    fontWeight: "bold",
  },
  desc: {
    fontSize: 14,
    paddingTop: 5,
    paddingBottom: 40,
    textAlign: "center",
  },
  allergenView: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: Colors.purpleDark,
    width: "100%",
    paddingTop: 20,
  },
  allergenBtn: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    backgroundColor: Colors.white,
    width: 150,
    height: 150,
    paddingTop: 15,
    marginHorizontal: 20,
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 100,
    marginBottom: 20,
    elevation: 15,
    borderWidth: 10,
    borderColor: Colors.pink2,
  },
  allergyIcon: {
    width: 80,
    height: 80,
  },
  iconText: {
    fontSize: 18,
  },
  descBtnText: {
    fontSize: 15,
    alignSelf: "center",
    color: Colors.white,
    marginTop: 20,
  },
  generateMealBtn: {
    marginTop: 5,
    marginBottom: 60,
    alignSelf: "center",
    backgroundColor: Colors.purpleSelectedDark,
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 50,
    elevation: 5,
  },
  btnText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
  },
});
