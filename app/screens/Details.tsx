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
import React, { useState, useEffect } from "react";
import { Plane } from "react-native-animated-spinkit";

const Details = () => {
  return (
    <View style={styles.container}>
      <Plane color="#FFF" size={48} />
      <TextInput>Hi</TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d35400",
    padding: 8,
  },
});

export default Details;
