import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import React from "react";
import * as FileSystem from "expo-file-system";
import { PermissionsAndroid } from "react-native";

import BeforeLogged from "./app/Components/BeforeLogged";
import LoggedDecision from "./app/Components/LoggedDecision";

import { jsonformatter } from "./assets/data/sample";

const Stack = createNativeStackNavigator();
// const InsideStack = createNativeStackNavigator();
// const ProfileSetUpStack = createNativeStackNavigator();

// function InsideLayout() {
//   const userId = FIREBASE_AUTH.currentUser?.uid;
//   const userRef = ref(FIREBASE_DB, "users/" + userId);
//   const [snapshotData, setSnapshotData] = useState<any>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const snapshot = await get(userRef);
//       if (snapshot.exists()) {
//         setSnapshotData(snapshot);
//       }
//     };

//     fetchData();
//   }, []);

//   if (snapshotData != null) {
//     return (
//       <InsideStack.Navigator
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <InsideStack.Screen
//           name="List"
//           component={List2}
//           options={{ headerShown: false }}
//         />
//         <InsideStack.Screen
//           name="MealPlanDetails"
//           component={MealPlanDetails}
//         />
//       </InsideStack.Navigator>
//     );
//   } else if (snapshotData == null) {
//     return (
//       <InsideStack.Navigator
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <InsideStack.Screen
//           name="ProfileSetUp"
//           component={ProfileSetUpLayout}
//           options={{ headerShown: false }}
//         />
//       </InsideStack.Navigator>
//     );
//   }
// }

// function ProfileSetUpLayout() {
//   return (
//     <ProfileSetUpStack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <ProfileSetUpStack.Screen
//         name="ProfileGender"
//         component={ProfileGender}
//       />
//       <ProfileSetUpStack.Screen name="Profile" component={Profile} />
//       <ProfileSetUpStack.Screen name="Main" component={Main} />
//     </ProfileSetUpStack.Navigator>
//   );
// }

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });

    const requestPermission = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        if (
          granted["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted" &&
          granted["android.permission.READ_EXTERNAL_STORAGE"] === "granted"
        ) {
          console.log("Permission accepted");
        } else {
          console.log("Read storage permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const storeJSON = async (jsonData: any) => {
      const documentDirectory = FileSystem.documentDirectory + "data.json";
      try {
        console.log("Document Directory:", documentDirectory);

        const fileInfo = await FileSystem.getInfoAsync(documentDirectory);

        if (!fileInfo.exists) {
          const jsonString = JSON.stringify(jsonData);

          // Write the JSON string to the file
          await FileSystem.writeAsStringAsync(documentDirectory, jsonString);
          console.log("JSON file copied successfully.");
        } else {
          console.log("JSON file already exists. Skipping copy.");
        }
      } catch (error) {
        console.error("Error checking/copying JSON file:", error);
      }
    };

    // requestPermission();
    storeJSON(jsonformatter);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="LoggedDecision"
            component={LoggedDecision}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="BeforeLogged"
            component={BeforeLogged}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
