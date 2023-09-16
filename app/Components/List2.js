import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { get, ref, update } from "firebase/database";
import Spinner from "react-native-loading-spinner-overlay";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";

export default function List2({ navigation }) {
  //dump
  const componentRef = useRef();
  const [count, setCount] = useState(0);

  //general data
  const [userDetails, setUserData] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState([]);
  const [userAllergen, setAllergenData] = useState([]);
  const [userMealPlan, setMealPlanData] = useState([]);
  const [filteredCategoryData, setFilterCategoryData] = useState([]);

  //food filtering data
  const [tempData, setTempData] = useState([]);
  const [FTempData, setfTempData] = useState([]);
  const [usedRecipes, setUsedRecipes] = useState([]);
  const [randomData, setRandomData] = useState([]);

  //loading
  const [isLoading, setLoading] = useState(false);

  //store userID
  const [UID, setUID] = useState([]);

  // //get userObject
  // const userObjects = userDetails.map((userDetail) => userDetail.user);

  // //get user allergens
  // const allergenOfUser = userDetails.map((userDetail, index) =>
  //   userDetail.allergen.map((allergen, allergenIndex) => allergen.name)
  // );

  // //get user mealPLan
  // const mealPlanObjects = userDetails
  //   .map((userDetail) => userDetail.mealPlan.map((mealPlan) => mealPlan))
  //   .flat();

  const Regenerate = () => {
    console.log("~Regenerate");
    console.log("userMealPlan.length", userMealPlan.length);

    generateRandomizedMeal();

    const numRegenerateRandomizedMeals =
      userMealPlan.length === 0 ? 0 : userMealPlan.length - 1; // Get the count of objects in randomData
    // console.log("numRandomizedMeals", numRegenerateRandomizedMeals);

    const updates = {};
    updates["/users/" + UID + "/mealPlan/" + numRegenerateRandomizedMeals] =
      randomData.flat();

    console.log("Regenerated");

    update(ref(FIREBASE_DB), updates);
    setCount(count + 1);
  };

  const upload3RandomizedMeal = () => {
    console.log("userMealPlan.length", userMealPlan.length);

    generateRandomizedMeal();

    const numRandomizedMeals =
      userMealPlan.flat().length === 0 ? 0 : userMealPlan.flat().length; // Get the count of objects in randomData
    // console.log("numRandomizedMeals", numRandomizedMeals);
    const updates = {};
    updates["/users/" + UID + "/mealPlan/" + numRandomizedMeals] =
      randomData.flat();

    update(ref(FIREBASE_DB), updates);
    setCount(count + 1);
  };

  const generateRandomizedMeal = () => {
    randomData.length = 0;
    try {
      if (recipeDetails != null) {
        //new code
        console.log(userAllergen);
        const changeAllergenName = userAllergen.map((innerArray) =>
          innerArray.map((category) =>
            category === "wheat"
              ? "Wheat/Gluten-Free"
              : category === "seafood"
              ? "Seafood"
              : category === "dairy"
              ? "Dairy Free"
              : category === "egg"
              ? "Egg"
              : category === "soy"
              ? "Soy Free"
              : category === "peanut"
              ? "Peanut Free"
              : "Vegetarian"
          )
        );

        const WOSeafood = changeAllergenName
          .flat()
          .filter((item) => item !== "Seafood");
        const WOEggAndSeafood = WOSeafood.flat().filter(
          (item) => item !== "Egg"
        );

        const WSeafood =
          changeAllergenName.flat().includes("Seafood") &&
          !changeAllergenName.flat().includes("Egg")
            ? ["Seafood"]
            : [];

        const WEgg =
          changeAllergenName.flat().includes("Egg") &&
          !changeAllergenName.flat().includes("Seafood")
            ? ["Egg"]
            : [];

        const WEggAndSeafood =
          changeAllergenName.flat().includes("Seafood") &&
          changeAllergenName.flat().includes("Egg")
            ? ["Seafood", "Egg"]
            : [];

        console.log("Allergen that are not egg or seafood", WOEggAndSeafood);

        recipeDetails.flat().forEach((recipe) => {
          const { categories } = recipe;
          if (categories) {
            if (
              WOEggAndSeafood.every((category) => categories.includes(category))
            ) {
              tempData.push(recipe);
            }
          }
        });

        console.log("the amount of filtered", tempData.flat().length);

        const Seafood = [
          "Seafood",
          "Shellfish",
          "Shrimp",
          "Fish",
          "Salmon",
          "Scallop",
          "Cod",
          "Bass",
          "Lobster",
          "Halibut",
          "Mussel",
          "Octopus",
        ];
        const SeafoodAndEgg = [...Seafood, "Egg"];
        console.log("egg and seafood", WEggAndSeafood.flat().length);
        console.log("egg only", WEgg.flat().length);
        console.log("seafood only", WSeafood.flat().length);

        const ttData = tempData.filter((recipe) => {
          const { categories } = recipe;
          if (categories) {
            if (WEggAndSeafood.flat().length > 0) {
              // Check if any of the categories match the ones in SeafoodAndEgg
              return !SeafoodAndEgg.some((category) =>
                categories.includes(category)
              );
            }
            if (WSeafood.flat().length > 0) {
              // Check if any of the categories match the ones in SeafoodAndEgg
              return !Seafood.some((category) => categories.includes(category));
            }
            if (WEgg.flat().length > 0) {
              // Check if any of the categories match the ones in SeafoodAndEgg
              return !Seafood.some((category) => categories.includes("Egg"));
            }
          }
        });
        console.log("ttdt", ttData.flat().length);

        //i deleted the .flat() here "!SeafoodAndEgg.flat().some((category) => categories == category)"
        tempData.flat().forEach((recipe) => {
          const { categories } = recipe;
          if (categories) {
            if (WEggAndSeafood.flat().length > 0) {
              if (!SeafoodAndEgg.some((category) => categories == category)) {
                FTempData.push(recipe);
              }
            }
            if (WSeafood.flat().length > 0) {
              if (!Seafood.some((category) => categories == category)) {
                FTempData.push(recipe);
              }
            }
            if (WEgg.flat().length > 0) {
              if (categories != "Egg") {
                FTempData.push(recipe);
              }
            }
          }
        });

        console.log("the amount of filtered again", FTempData.flat().length);

        //new code ends

        console.log("~mealPlanRandomizer");

        // Filter recipes from recipe based on breakfast/lunch/dinner
        var breakfastRecipes = [];
        var lunchRecipes = [];
        var dinnerRecipes = [];
        if (ttData.flat().length > 0) {
          breakfastRecipes = ttData.filter((recipe) =>
            recipe.categories.includes("Breakfast")
          );
          lunchRecipes = ttData.filter((recipe) =>
            recipe.categories.includes("Lunch")
          );
          dinnerRecipes = ttData.filter((recipe) =>
            recipe.categories.includes("Dinner")
          );
        } else {
          breakfastRecipes = tempData.filter((recipe) =>
            recipe.categories.includes("Breakfast")
          );
          lunchRecipes = tempData.filter((recipe) =>
            recipe.categories.includes("Lunch")
          );
          dinnerRecipes = tempData.filter((recipe) =>
            recipe.categories.includes("Dinner")
          );
        }

        console.log("breakfastRecipes", breakfastRecipes.length);
        console.log("lunchRecipes", lunchRecipes.length);
        console.log("dinnerRecipes", dinnerRecipes.length);

        //new code for calorie limit per day
        const BR = [];
        const LR = [];
        const DR = [];
        let totalC = 0;

        const TC = parseFloat(
          userDetails.map((userDetail) => userDetail.user.totalCalories)[0]
        );
        if (TC == [] || TC.length == 0) {
          console.log("total calories cannot get");
          return;
        }
        let noCal = false;

        do {
          console.log("ttCalories", TC);
          BR.length = 0;
          LR.length = 0;
          DR.length = 0;
          totalC = 0;
          noCal = false;
          BR.push(getRandomRecipe(breakfastRecipes));
          LR.push(getRandomRecipe(lunchRecipes));
          DR.push(getRandomRecipe(dinnerRecipes));

          BR.flat().forEach((recipe) => {
            const { calories } = recipe;
            if (calories != null) {
              console.log("b", calories);
              totalC = totalC + calories;
            } else {
              noCal = true;
              console.log("b no calorie");
            }
          });
          LR.flat().forEach((recipe) => {
            const { calories } = recipe;

            if (calories == null) {
              noCal = true;
              console.log("l no calorie");
            } else {
              console.log("l", calories);
              totalC = totalC + calories;
            }
          });
          DR.flat().forEach((recipe) => {
            const { calories } = recipe;

            if (calories == null) {
              noCal = true;
              console.log("d no calorie");
            } else {
              console.log("d", calories);
              totalC = totalC + calories;
            }
          });
          console.log("ttcalorie", totalC);
        } while (totalC > TC || noCal);

        if (BR) {
          randomData.push(BR);
        }
        if (LR) {
          randomData.push(LR);
        }
        if (DR) {
          randomData.push(DR);
        }
        console.log("Random Object:", randomData.flat());
      } else {
        console.log("Failed to retrieve recipe and randomized meal");
      }
    } catch (error) {
      console.error("Error fetching recipe data: ", error);
    }
  };

  // Randomly select one recipe for each category
  const getRandomRecipe = (recipes) => {
    if (recipes.length > 0) {
      // const availableRecipes = recipes.filter(
      //   (recipe) => !usedRecipes.includes(recipe)
      // );
      // if (availableRecipes.length > 0) {
      //   const randomIndex = Math.floor(Math.random() * availableRecipes.length);
      //   const selectedRecipe = availableRecipes[randomIndex];
      //   usedRecipes.push([...usedRecipes, selectedRecipe]); // Add the selected recipe to usedRecipes
      //   console.log("usedRecipes", usedRecipes.length);
      //   console.log("selectedRecipe", selectedRecipe.length);
      //   return selectedRecipe;
      // }
      const randomIndex = Math.floor(Math.random() * recipes.length);
      return recipes[randomIndex];
    }
    return null;
  };

  useEffect(() => {
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
          recipeDetails.push(parsedData);
        } else {
          console.log("JSON file does not exist.");
          return null; // Return null if the file doesn't exist
        }
      } catch (error) {
        console.error("Error reading JSON file:", error);
        return null; // Handle errors by returning null
      }
    };
    fetchRecipeData();
  }, [userDetails]);

  useEffect(() => {
    const setData = async () => {
      setAllergenData(
        userDetails.map((userDetail) =>
          userDetail.allergen
            ? userDetail.allergen.map((allergen) => allergen.name)
            : []
        )
      );

      userDetails.map((userDetail) =>
        userDetail.mealPlan
          ? setMealPlanData(userDetail.mealPlan.map((mealPlan) => mealPlan))
          : setMealPlanData([])
      );
    };
    if (userDetails.length != 0) {
      console.log("userdetails changed");
      console.log("UserDetails", userDetails);
      setData();
    }
  }, [userDetails]);

  useEffect(() => {
    if (userDetails.length != 0) {
      console.log("user meal plan changed");
      if (userMealPlan.length == 0) {
        console.log("no meal plan yet");
        upload3RandomizedMeal();
      } else {
        console.log("already have meal plan");
      }
    }
  }, [userMealPlan]);

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    setUID(user.uid);

    const getUser = async () => {
      console.log("-----GETTING USER-----");
      // //empty out useState just in case
      // recipeDetails.length = 0;
      // userAllergen.length = 0;
      // userDetails.length = 0;
      setLoading(true);
      if (user) {
        const userRef = ref(FIREBASE_DB, "users/" + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const UD = [];
          UD.push(snapshot.val());
          console.log("User Details BEFORE", userDetails);
          setUserData(UD);

          setLoading(false);
        } else {
          setUserData([]);
          setLoading(false);
          console.log("gg.com");
        }
      }
    };

    getUser();
  }, [count]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#f0f0f0",
        padding: 20,
        marginTop: 50,
      }}
    >
      {userDetails.length > 0 && (
        <View>
          <Text>YES</Text>
        </View>
      )}

      {userDetails.length > 0 &&
        userDetails.map((userDetail, userIndex) => (
          <View key={userIndex}>
            <Text>Age: {userDetail.user.age}</Text>
            <Text>Gender: {userDetail.user.gender}</Text>
            <Text>Meal Plan:</Text>
            {userMealPlan.length > 0 &&
              userMealPlan[userIndex].map((mealPlan, mealPlanIndex) => (
                <View key={mealPlanIndex}>
                  <TouchableOpacity
                    style={[styles.button]}
                    onPress={() => {
                      onSelect(mealPlanIndex);
                    }}
                  >
                    <Text style={styles.iconText}>{mealPlan.title}</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        ))}

      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
      <Button onPress={Regenerate} title="Regenerate" />
      <Spinner
        visible={isLoading}
        textContent={"Loading..."}
        textStyle={{ color: "#FFF" }}
        size={100}
      ></Spinner>
    </ScrollView>
  );
}

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
    width: "100%",
    height: 100,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
