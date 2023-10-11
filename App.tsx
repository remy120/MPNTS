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
