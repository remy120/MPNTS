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
import React, { useEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { ref, push, get, remove, child, set, update } from "firebase/database";
import firebase from "firebase/app";
import * as FileSystem from "expo-file-system";
// import { jsonformatter } from "../../assets/data/sample";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  const [recipeDetails, setRecipeDetails] = useState<any[]>([]);
  const [userDetails, setUserData] = useState<any[]>([]);
  const [userAllergen, setAllergenData] = useState<any[]>([]);
  const [userMealPlan, setMealPlanData] = useState<any[]>([]);
  const [filteredCategoryData, setFilterCategoryData] = useState<any[]>([]);
  const [randomData, setRandomData] = useState<any[]>([]);

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      console.log("User not authenticated");
      return;
    }
    const userID = user.uid;

    const fetchUserData = () => {
      console.log("____________________________________");
      console.log("~fetchUserData");
      const userDetailsRef = ref(FIREBASE_DB);
      get(child(userDetailsRef, `users/${userID}`))
        .then((snapshotUser) => {
          if (snapshotUser.exists()) {
            const userDetails: any[] = [];
            const userAllergen: any[] = [];
            const userMealPlan: any[] = [];

            const plan = snapshotUser.val();
            const allergenData = plan.allergen ? plan.allergen : [];
            const mealPlanData = plan.mealPlan ? plan.mealPlan : [];

            userDetails.push(plan);
            userAllergen.push(allergenData);
            userMealPlan.push(mealPlanData);

            setUserData(userDetails);
            setAllergenData(userAllergen);
            setMealPlanData(userMealPlan);
          } else {
            console.log("Failed to retrive user data");
            setUserData([]);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      // try {
      // const userDetailsRef = ref(FIREBASE_DB, "users/" + userID);
      // const snapshotUser = await get(userDetailsRef);

      // if (snapshotUser.exists()) {
      //   const userDetails: any[] = [];
      //   const userAllergen: any[] = [];
      //   const userMealPlan: any[] = [];
      //   snapshotUser.forEach((childSnapshot) => {
      //     const plan = childSnapshot.val();
      //     const allergenData = plan.allergen ? plan.allergen : null;
      //     const mealPlanData = plan.mealPlan ? plan.mealPlan : null;
      //     userDetails.push(plan);
      //     userAllergen.push(allergenData);
      //     userMealPlan.push(mealPlanData);
      //   });
      //   setUserData(userDetails);
      //   setAllergenData(userAllergen);
      //   setMealPlanData(userMealPlan);
      //   console.log("userDetails", userDetails);

      //   console.log("userAllergen", userAllergen);

      //   console.log("userMealPlan", userMealPlan);
      // } else {
      //   console.log("Failed to retrive user data");
      //   setUserData([]);
      // }
      // } catch (error) {
      //   console.error("Error fetching user data: ", error);
      // }
    };

    const fetchMealPlanData = () => {
      console.log("~fetchMealPlanData");
      try {
        // const snapshotMealPlan = await get(mealPlanRef);

        console.log("userDetails", userDetails);
        console.log("userAllergen", userAllergen);
        console.log("userMealPlan", userMealPlan);
        if (userMealPlan && userMealPlan.length > 0) {
          const filteredData = userMealPlan.flat().filter((item) => item.state);

          console.log("filteredData", filteredData);
          if (filteredData != null) {
            console.log("mealPlanData state is true");

            fetchRecipeData();
          }
        } else {
          console.log("No userMealPlan data available");
        }

        // .map((item) => ({ name: item.name, img: item.img }));

        // let mealPlanState = true;
        // mealPlanData.forEach((childSnapshot) => {
        //   if (childSnapshot.state === false) {
        //     mealPlanState = false;
        //     console.log("mealPlanData found");
        //     return;
        // const userDetails: any[] = [];
        // const userAllergen: any[] = [];
        // snapshot.forEach((childSnapshot) => {
        //   const plan = childSnapshot.val();
        //   const allergenData = plan.allergen;
        //   userDetails.push(plan);
        //   userAllergen.push(allergenData);
        // });
        // setMealPlanData(userDetails);
        // } else {

        // }
        // };
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    const fetchRecipeData = async () => {
      console.log("~fetchRecipeData");
      const documentDirectory = FileSystem.documentDirectory + "data.json";
      try {
        const fileInfo = await FileSystem.getInfoAsync(documentDirectory);
        if (fileInfo.exists) {
          const jsonContent = await FileSystem.readAsStringAsync(
            documentDirectory
          );
          const parsedData = JSON.parse(jsonContent);
          setRecipeDetails(parsedData);
          generateRandomizedMeal();
        } else {
          console.log("JSON file does not exist.");
          return null; // Return null if the file doesn't exist
        }
      } catch (error) {
        console.error("Error reading JSON file:", error);
        return null; // Handle errors by returning null
      }
    };

    const generateRandomizedMeal = () => {
      try {
        if (recipeDetails) {
          const modifiedIncludeCategories: string[] = userAllergen.map(
            (innerArray) =>
              innerArray.map((category: any) =>
                category.name === "wheat"
                  ? "Wheat/Gluten-Free"
                  : category.name === "seafood"
                  ? "Seafood"
                  : category.name === "dairy"
                  ? "Dairy Free"
                  : category.name === "egg"
                  ? "Egg"
                  : category.name === "soy"
                  ? "Soy Free"
                  : category.name === "peanut"
                  ? "Peanut Free"
                  : "Vegetarian"
              )
          );
          const flattenedIncludeCategories = modifiedIncludeCategories.flat();
          console.log("flattenedIncludeCategories", flattenedIncludeCategories);
          console.log("~mealPlanRandomizer");
          setFilterCategoryData([]); //clear the filtered first
          let filteredCategory: any = [];
          recipeDetails.forEach((recipe: { categories: any }) => {
            const { categories } = recipe;
            if (
              categories &&
              (flattenedIncludeCategories.length === 0 || // No categories to filter, include all
                (!flattenedIncludeCategories.includes("Seafood") &&
                  categories.includes("Seafood")) ||
                (!flattenedIncludeCategories.includes("Egg") &&
                  categories.includes("Egg")) ||
                flattenedIncludeCategories.every((category: string) =>
                  categories.includes(category)
                ))
            ) {
              filteredCategory.push(recipe);
            }
          });
          setFilterCategoryData(filteredCategory);

          // Filter recipes based on categories
          const breakfastRecipes = filteredCategoryData.filter((recipe: any) =>
            recipe.categories.includes("Breakfast")
          );
          const lunchRecipes = filteredCategoryData.filter((recipe: any) =>
            recipe.categories.includes("Lunch")
          );
          const dinnerRecipes = filteredCategoryData.filter((recipe: any) =>
            recipe.categories.includes("Dinner")
          );

          // Randomly select one recipe for each category
          const getRandomRecipe = (recipes: any[]) => {
            if (recipes.length > 0) {
              const randomIndex = Math.floor(Math.random() * recipes.length);
              return recipes[randomIndex];
            }
            return null;
          };
          const breakfastRecipe = getRandomRecipe(breakfastRecipes);
          const lunchRecipe = getRandomRecipe(lunchRecipes);
          const dinnerRecipe = getRandomRecipe(dinnerRecipes);
          const dayMeal = []; //Clear before setting
          // Add the selected recipes to the randomizedMeals array
          if (breakfastRecipe) {
            dayMeal.push(breakfastRecipe);
          }
          if (lunchRecipe) {
            dayMeal.push(lunchRecipe);
          }
          if (dinnerRecipe) {
            dayMeal.push(dinnerRecipe);
          }

          // if (randomData === null) {
          //   console.log(
          //     `No items with the categories "${flattenedIncludeCategories.join(
          //       ", "
          //     )}" found.`
          //   );
          // } else {
          //   // Create a copy of randomData to avoid modifying the original array
          //   const remainingRecipes = [...randomData];
          //   randomData.length = 0; // Clear before storing
          //   for (let i = 0; i < 3; i++) {
          //     if (remainingRecipes.length > 0) {
          //       // Generate a random index
          //       const randomIndex = Math.floor(
          //         Math.random() * remainingRecipes.length
          //       );
          //       // Get the random object and remove it from the remaining recipes
          //       const generatedObjects: any[] = remainingRecipes.splice(
          //         randomIndex,
          //         1
          //       )[0];
          //       // Store the random object in the generatedObjects array
          //       randomData.push(generatedObjects);
          //     }
          //   }
          setRandomData(dayMeal);
          console.log("Random Object:", randomData);
          upload3RandomizedMeal();
          // }
        } else {
          console.log("Failed to retrieve recipe and randomized meal");
        }
      } catch (error) {
        console.error("Error fetching recipe data: ", error);
      }
    };

    const upload3RandomizedMeal = () => {
      // // Reference to Firebase Realtime Database with a dynamic path
      // const mealPlanRef = ref(FIREBASE_DB, "users/" + userID + "/mealPlan");
      // set(ref(FIREBASE_DB, "users/" + userID + "/mealPlan/" + ), {
      // randomData,
      // });

      // // Push the data to the database
      // await push(mealPlanRef, randomData);
      console.log("userMealPlan.length", userMealPlan.flat().length);

      // const countObjectsInNestedArray = (arr: any[]) => {
      //   let count = 0;

      //   const countRecursive = (nestedArr: any[]) => {
      //     for (const item of nestedArr) {
      //       if (Array.isArray(item)) {
      //         countRecursive(item);
      //       } else {
      //         count++;
      //       }
      //     }
      //   };

      //   countRecursive(arr);
      //   return count;
      // };
      // const numRandomizedMeals = countObjectsInNestedArray(userMealPlan);

      // console.log("numRandomizedMeals", numRandomizedMeals);

      const numRandomizedMeals =
        // userMealPlan?.length || 0;
        userMealPlan.flat().length === 0 ? 0 : userMealPlan.flat().length; // Get he count of objects in randomData
      console.log("numRandomizedMeals", numRandomizedMeals);
      const updates: { [key: string]: any } = {};
      updates["/users/" + userID + "/mealPlan/" + numRandomizedMeals] =
        randomData;

      return update(ref(FIREBASE_DB), updates);
    };

    fetchUserData();
    fetchMealPlanData();
  }, []); //recipeDetails

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ScrollView>
        <Text>EatWell</Text>
        <Text>Today's Meal Plan</Text>
        {/* <ScrollView></ScrollView> */}
        {/* <Button
        onPress={() => navigation.navigate("Details")}
        title="Open Details"
      /> */}
        {/* {randomData.length > 0 && <Text>{randomData[0].title}</Text>} */}
        <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
      </ScrollView>
    </View>
  );
};

export default List;
