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
  NativeModules,
  LayoutAnimation,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../assets/colors";
import { ref, update, get } from "firebase/database";
import Spinner from "react-native-loading-spinner-overlay";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { Headline } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
export default class Challenges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxHeight: 30,
      boxMarginTop: 0,
      userDetails: [],
      loading: false,
      drank: 0,
    };
  }

  componentDidMount() {
    const user = FIREBASE_AUTH.currentUser;
    this.setState({ loading: true });

    const getUser = async () => {
      if (user) {
        const userRef = ref(FIREBASE_DB, "users/" + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const UD = [];
          UD.push(snapshot.val());
          this.setState({
            userDetails: UD,
            loading: false,
          });
        } else {
          this.setState({
            userDetails: UD,
            loading: false,
          });
        }
      }
    };

    getUser();
  }

  _onPress = () => {
    const maxBoxHeight = 270;

    LayoutAnimation.spring();
    const newBoxHeight = this.state.boxHeight + 30;
    const limitedBoxHeight = Math.min(newBoxHeight, maxBoxHeight);

    // Calculate the margin to keep the box centered while growing
    const marginTop =
      this.state.boxMarginTop - (limitedBoxHeight - this.state.boxHeight);

    const totalDrank =
      this.state.drank + this.state.userDetails[0].user.water / 8;

    // Cap the drank value at a maximum of 3700
    const cappedDrank = Math.min(totalDrank, 3700);
    this.setState({
      boxHeight: limitedBoxHeight,
      boxMarginTop: marginTop,
      drank: cappedDrank,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Headline style={styles.headline}>Challenge to drink</Headline>

        <Text style={styles.water}>
          {this.state.userDetails.length > 0
            ? this.state.userDetails[0].user.water
            : "N/A"}{" "}
          ml
        </Text>
        <Text style={styles.drank}>{this.state.drank} ml</Text>
        <View style={styles.glassContainer}>
          <View style={styles.glass} />
        </View>
        <View style={[styles.middle, { marginTop: this.state.boxMarginTop }]}>
          <LinearGradient
            colors={["#bbdae2", "#84bccb", "#5e919e"]}
            style={[styles.box, { height: this.state.boxHeight }]}
          ></LinearGradient>
        </View>
        <TouchableOpacity onPress={this._onPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              {this.state.userDetails.length > 0
                ? this.state.userDetails[0].user.water / 8
                : "N/A"}{" "}
              ml
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  middle: {
    justifyContent: "center",
    alignItems: "center",
  },
  glassContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  glass: {
    backgroundColor: "transparent",
    width: 100,
    height: 270,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
  },
  box: {
    backgroundColor: "#76b5c5",
    width: 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
  },
  button: {
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  headline: {},
  water: {
    fontSize: 40,
    marginBottom: 300,
    fontWeight: "bold",
  },
  drank: {
    zIndex: 999,
  },
});
