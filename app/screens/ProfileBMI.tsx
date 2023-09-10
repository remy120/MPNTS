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
import React, { Component, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import DropDownPicker from "react-native-dropdown-picker";

interface State {
  height: string;
  weight: string;
  bmi: string;
  BmiResult: string;
  heightOpen: boolean;
  heightValue: null | string;
  heightItems: { label: string; value: string }[];
  weightOpen: boolean;
  weightValue: null | string;
  weightItems: { label: string; value: string }[];
  isHeightOpen: boolean;
  isWeightOpen: boolean;
}

class ProfileBMI extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      height: "",
      weight: "",
      bmi: "",
      BmiResult: "",
      heightOpen: false,
      heightValue: null,
      heightItems: [
        { label: "CMS", value: "CMS" },
        { label: "FT", value: "FT" },
      ],
      weightOpen: false,
      weightValue: null,
      weightItems: [
        { label: "KG", value: "KG" },
        { label: "LBS", value: "LBS" },
      ],
      isHeightOpen: false, // Track the open state for height
      isWeightOpen: false, // Track the open state for weight
    };
  }

  toggleHeightOpen = () => {
    this.setState((prevState) => ({
      isHeightOpen: !prevState.isHeightOpen,
      isWeightOpen: false, // Close the weight dropdown if open
    }));
  };

  // Function to toggle the open state for weight dropdown
  toggleWeightOpen = () => {
    this.setState((prevState) => ({
      isWeightOpen: !prevState.isWeightOpen,
      isHeightOpen: false, // Close the height dropdown if open
    }));
  };

  setWeightOpen = (weightOpen: boolean) => {
    this.setState({
      weightOpen,
      heightOpen: false,
    });
  };

  setWeightValue = (callback: any) => {
    this.setState((state) => ({
      weightValue: callback(state.weightValue),
    }));
  };

  setWeightItems = (callback: any) => {
    this.setState((state) => ({
      weightItems: callback(state.weightItems),
    }));
  };

  setHeightOpen = (heightOpen: boolean) => {
    this.setState({
      heightOpen,
      weightOpen: false,
    });
  };

  setHeightValue = (callback: any) => {
    this.setState((state) => ({
      heightValue: callback(state.heightValue),
    }));
  };

  setHeightItems = (callback: any) => {
    this.setState((state) => ({
      heightItems: callback(state.heightItems),
    }));
  };

  handleHeight = (text: string) => {
    this.setState({ height: text });
  };

  handleWeight = (text: string) => {
    this.setState({ weight: text });
  };

  calculate = (height: string, weight: string) => {
    // const { height, weight } = this.state;
    // calculation
    const result =
      (parseFloat(weight) * 10000) / (parseFloat(height) * parseFloat(height));
    const formattedResult = result.toFixed(2);
    // display result
    this.setState({ bmi: formattedResult });
    if (result < 18.5) {
      this.setState({ BmiResult: "Underweight" });
    } else if (result >= 18.5 && result < 25) {
      this.setState({ BmiResult: "Normal weight" });
    } else if (result >= 25 && result < 30) {
      this.setState({ BmiResult: "Overweight" });
    } else if (result >= 30) {
      this.setState({ BmiResult: "Obese" });
    } else {
      alert("Incorrect Input!");
      this.setState({ BmiResult: "" });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Calculate Your BMI</Text>
        <Text style={styles.label}>Height</Text>
        <TextInput
          editable={this.state.heightValue === null ? true : false}
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder={
            this.state.weightValue === null
              ? "Height"
              : "Height in " + this.state.weightValue
          }
          autoCapitalize="none"
          onChangeText={this.handleHeight}
        />

        <Text style={styles.label}>Weight</Text>
        <TextInput
          editable={this.state.weightValue === null ? true : false}
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder={
            this.state.weightValue === null
              ? "Weight"
              : "Weight in " + this.state.weightValue
          }
          autoCapitalize="none"
          onChangeText={this.handleWeight}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => this.calculate(this.state.height, this.state.weight)}
        >
          <Text style={styles.submitButtonText}>Calculate</Text>
        </TouchableOpacity>

        <Text style={styles.output}>{this.state.bmi}</Text>
        <Text style={styles.resultText}>{this.state.BmiResult}</Text>
      </View>
    );
  }
}

export default ProfileBMI;

const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
  },
  input: {
    margin: 15,
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
  submitButton: {
    backgroundColor: "#ff6666",
    padding: 10,
    margin: 15,
    height: 40,
  },
  submitButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
  },
  output: {
    textAlign: "center",
    fontSize: 30,
  },
  title: {
    paddingTop: 30,
    paddingBottom: 10,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  resultText: {
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: "center",
    fontSize: 30,
    color: "blue",
  },
  label: {
    marginLeft: 15,
  },
});
