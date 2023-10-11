import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoggedWOProfile from "./LoggedWOProfile";
import LoggedWProfile from "./LoggedWProfile";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { ref, get } from "firebase/database";

const Stack = createNativeStackNavigator();

export default function LoggedDeicion() {
  const userId = FIREBASE_AUTH.currentUser?.uid;
  const userRef = ref(FIREBASE_DB, "users/" + userId);
  const [snapshotData, setSnapshotData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        console.log("Profile already setup");
        setSnapshotData(snapshot);
      } else {
        console.log("Profile not yet set up");
        setSnapshotData(null);
      }
    };

    fetchData();
  }, []);

  if (snapshotData != null) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoggedWProfile" component={LoggedWProfile} />
      </Stack.Navigator>
    );
  } else if (snapshotData == null) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoggedWOProfile" component={LoggedWOProfile} />
      </Stack.Navigator>
    );
  }
}
