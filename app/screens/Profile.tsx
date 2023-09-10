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
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import {
  CalorieCalculator,
  // ProfileStackParamList,
  // ProfileScreenRouteProp,
} from "../../static/navigationTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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

  // navigation: NavigationProp<any, any>;
}

// interface ProfileProps {
//   route: ProfileScreenRouteProp; // Use the imported type for route prop
//   navigation: NativeStackNavigationProp<ProfileStackParamList, "Profile">;
// }

const Profile = ({ route }: any) => {
  // const Profile: React.FC<ProfileProps> = ({ route, navigation }) => {
  const { calorieCalculator } = route.params;
  const navigation = useNavigation();
  console.log("calorieCalculator", calorieCalculator);

  const [data, setData] = useState([
    {
      name: "corn",
      state: false,
      img: require("../../assets/img/corn.png"),
    },
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
  ]);

  const onSelect = (ind: number) => {
    const tempData: { name: string; state: boolean; img: any }[] = data.map(
      (item, index) => {
        if (index === ind) {
          if (item.state == true) {
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
    // Filter the data to only keep items with state is true
    const filteredData = data.filter((item) => item.state);

    console.log("filteredData", filteredData);
    navigation.navigate("Inside");
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Let's get to know you</Text>
        <Text style={styles.desc}>
          Select if you have any of these allergies.
        </Text>
        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: item.state == true ? "#f6e2ff" : "#abdbe3",
                  },
                ]}
                onPress={() => {
                  onSelect(index);
                }}
              >
                <Image style={styles.allergyIcon} source={item.img} />
                <Text style={styles.iconText}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: "#f6e2ff",
            },
          ]}
          onPress={submit}
        >
          <Text style={styles.iconText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#abdbe3",
    justifyContent: "center",
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
    fontFamily: "",
    fontWeight: "bold",
    fontSize: 26,
    lineHeight: 30,
  },
  desc: {
    fontFamily: "",
    fontSize: 16,
    lineHeight: 20,
    paddingTop: 5,
    paddingBottom: 40,
  },
  iconRow: { flexDirection: "row", alignItems: "center" },
  button: {
    width: 150,
    height: 180,
    paddingTop: 20,
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 50,
    borderColor: "#00000",
    marginBottom: 10,
    borderWidth: 1,
  },
  allergyIcon: {
    width: 100,
    height: 100,
  },
  iconText: {
    paddingTop: 10,
    fontFamily: "",
    fontSize: 20,
  },
});
