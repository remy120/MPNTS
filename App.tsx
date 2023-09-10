import {
  NavigationContainer,
  findFocusedRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Plane } from "react-native-animated-spinkit";

import Login from "./app/screens/Login";
import List from "./app/screens/List";
import Details from "./app/screens/Details";
import SignUp from "./app/screens/SignUp";
import Profile from "./app/screens/Profile";
import ProfileGender from "./app/screens/ProfileGender";

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();
const ProfileSetUpStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <InsideStack.Screen name="List" component={List} />
      <InsideStack.Screen name="Details" component={Details} />
    </InsideStack.Navigator>
  );
}

function ProfileSetUpLayout() {
  return (
    <ProfileSetUpStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileSetUpStack.Screen
        name="ProfileGender"
        component={ProfileGender}
      />
      <ProfileSetUpStack.Screen name="Profile" component={Profile} />
      <ProfileSetUpStack.Screen name="Inside" component={InsideLayout} />
    </ProfileSetUpStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Inside"
            component={InsideLayout}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ProfileSetUp" component={ProfileSetUpLayout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
