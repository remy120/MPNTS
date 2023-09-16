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

  const [tempData, setTempData] = useState<any[]>([]);
  const [FTempData, setfTempData] = useState<any[]>([]);
  const [usedRecipes, setUsedRecipes] = useState<any[]>([]);
  const [regenerateState, setRegenerateState] = useState<any[]>([]);

  const [UID, setUID] = useState<any[]>([]);

  const upload3RandomizedMeal = () => {
    console.log("userMealPlan.length", userMealPlan.flat().length);

    const numRandomizedMeals =
      userMealPlan.flat().length === 0 ? 0 : userMealPlan.flat().length; // Get the count of objects in randomData
    console.log("numRandomizedMeals", numRandomizedMeals);
    const updates: { [key: string]: any } = {};
    updates["/users/" + UID + "/mealPlan/" + numRandomizedMeals] =
      randomData.flat();

    return update(ref(FIREBASE_DB), updates);
  };

  // Randomly select one recipe for each category
  const getRandomRecipe = (recipes: any[]) => {
    if (recipes.length > 0) {
      const availableRecipes = recipes.filter(
        (recipe) => !usedRecipes.includes(recipe)
      );
      if (availableRecipes.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableRecipes.length);
        const selectedRecipe = availableRecipes[randomIndex];
        usedRecipes.push([...usedRecipes, selectedRecipe]); // Add the selected recipe to usedRecipes
        console.log("usedRecipes", usedRecipes.length);
        console.log("selectedRecipe", selectedRecipe.length);
        return selectedRecipe;
      }
      // const randomIndex = Math.floor(Math.random() * recipes.length);
      // return recipes[randomIndex];
    }
    return null;
  };

  const generateRandomizedMeal = () => {
    randomData.length = 0;
    try {
      if (recipeDetails) {
        //new code
        const changeAllergenName: string[] = userAllergen.map((innerArray) =>
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

        recipeDetails.flat().forEach((recipe: { categories: any }) => {
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

        tempData.flat().forEach((recipe: { categories: any }) => {
          const { categories } = recipe;
          if (categories) {
            if (WEggAndSeafood.flat().length > 0) {
              if (
                !SeafoodAndEgg.flat().some((category) => categories == category)
              ) {
                FTempData.push(recipe);
              }
            }
            if (WSeafood.flat().length > 0) {
              if (!Seafood.flat().some((category) => categories == category)) {
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
        var breakfastRecipes: any = [];
        var lunchRecipes: any = [];
        var dinnerRecipes: any = [];
        if (ttData.flat().length > 0) {
          breakfastRecipes = ttData.filter((recipe: any) =>
            recipe.categories.includes("Breakfast")
          );
          lunchRecipes = ttData.filter((recipe: any) =>
            recipe.categories.includes("Lunch")
          );
          dinnerRecipes = ttData.filter((recipe: any) =>
            recipe.categories.includes("Dinner")
          );
        } else {
          breakfastRecipes = tempData.filter((recipe: any) =>
            recipe.categories.includes("Breakfast")
          );
          lunchRecipes = tempData.filter((recipe: any) =>
            recipe.categories.includes("Lunch")
          );
          dinnerRecipes = tempData.filter((recipe: any) =>
            recipe.categories.includes("Dinner")
          );
        }

        console.log("breakfastRecipes", breakfastRecipes.length);
        console.log("lunchRecipes", lunchRecipes.length);
        console.log("dinnerRecipes", dinnerRecipes.length);

        //new code for calorie limit per day
        const BR: any = [];
        const LR: any = [];
        const DR: any = [];
        let totalC = 0;

        const TC: number = 1111;
        let noCal = false;

        do {
          BR.length = 0;
          LR.length = 0;
          DR.length = 0;
          totalC = 0;
          noCal = false;
          BR.push(getRandomRecipe(breakfastRecipes));
          LR.push(getRandomRecipe(lunchRecipes));
          DR.push(getRandomRecipe(dinnerRecipes));

          BR.flat().forEach((recipe: { calories: any }) => {
            const { calories } = recipe;
            console.log("b", calories);
            if (calories == null) {
              noCal = true;
            }
            totalC = totalC + calories;
          });
          LR.flat().forEach((recipe: { calories: any }) => {
            const { calories } = recipe;
            console.log("l", calories);
            if (calories == null) {
              noCal = true;
            }
            totalC = totalC + calories;
          });
          DR.flat().forEach((recipe: { calories: any }) => {
            const { calories } = recipe;
            console.log("d", calories);
            if (calories == null) {
              noCal = true;
            }
            totalC = totalC + calories;
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
        // if (regenerateState) {
        //   Regenerate();
        // } else {
        //   upload3RandomizedMeal();
        // }
      } else {
        console.log("Failed to retrieve recipe and randomized meal");
      }
    } catch (error) {
      console.error("Error fetching recipe data: ", error);
    }
  };

  const Regenerate = () => {
    console.log("~Regenerate");
    console.log("userMealPlan.length", userMealPlan.flat().length);

    generateRandomizedMeal();

    const numRegenerateRandomizedMeals =
      userMealPlan.flat().length === 0 ? 0 : userMealPlan.flat().length - 1; // Get the count of objects in randomData
    console.log("numRandomizedMeals", numRegenerateRandomizedMeals);

    const updates: { [key: string]: any } = {};
    updates["/users/" + UID + "/mealPlan/" + numRegenerateRandomizedMeals] =
      randomData.flat();

    console.log("Regenerated");

    return update(ref(FIREBASE_DB), updates);
  };

  useEffect(() => {
    recipeDetails.length = 0;
    userDetails.length = 0;
    userAllergen.length = 0;
    userMealPlan.length = 0;
    filteredCategoryData.length = 0;
    randomData.length = 0;

    tempData.length = 0;
    FTempData.length = 0;
    usedRecipes.length = 0;

    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      console.log("User not authenticated");
      return;
    }

    UID.length = 0;
    UID.push(user.uid);

    const fetchUserData = async () => {
      console.log("____________________________________");
      console.log("~fetchUserData");

      const userRef = ref(FIREBASE_DB, "users/" + UID);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const UD: any[] = [];
        // snapshot.forEach((childSnapshot) => {
        //   const U = childSnapshot.val();
        //   UD.push(U);
        // });
        const plan = snapshot.val();
        const allergenData = plan.allergen ? plan.allergen : [];
        const mealPlanData = plan.mealPlan ? plan.mealPlan : [];

        userDetails.push(plan.user);
        userAllergen.push(allergenData);
        userMealPlan.push(mealPlanData.flat());

        // userDetails.push(snapshot.val().user);
        // userAllergen.push(snapshot.val().allergen);
        // userMealPlan.push(snapshot.val().mealPlan);
        console.log("This is userDetails: ", userDetails);
        console.log("This is userAllergen: ", userAllergen);
        console.log("This is userMealPlan: ", userMealPlan);
        // console.log("hohaho", userDetails[0].totalCalories);
        fetchRecipeData();
        return;
      } else {
        // No data found for the user
        userDetails.length = 0;
        userAllergen.length = 0;
        userMealPlan.length = 0;
      }

      //here
      // const userDetailsRef = ref(FIREBASE_DB);
      // get(child(userDetailsRef, "users/" + UID))
      //   .then((snapshotUser) => {
      //     if (snapshotUser.exists()) {
      //       const plan = snapshotUser.val();
      //       const allergenData = plan.allergen ? plan.allergen : [];
      //       const mealPlanData = plan.mealPlan ? plan.mealPlan : [];

      //       userDetails.push(plan);
      //       userAllergen.push(allergenData);
      //       userMealPlan.push(mealPlanData);
      //       console.log("This should have something", userDetails);
      //       console.log(
      //         "userAllergen should have something here",
      //         userAllergen
      //       );
      //     } else {
      //       console.log("Failed to retrive user data");
      //       userDetails.length = 0;
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
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

    // const fetchMealPlanData = () => {
    //   console.log("~fetchMealPlanData");
    //   try {
    //     console.log("userDetails", userDetails);
    //     console.log("userAllergen", userAllergen);
    //     console.log("userMealPlan", userMealPlan.flat());
    //     if (userMealPlan && userMealPlan.flat().length > 0) {
    //       const filteredData = userMealPlan.flat().filter((item) => item.state);

    //       console.log("filteredData", filteredData.length);
    //       if (filteredData.length === 0) {
    //         console.log("mealPlanData state is true");

    //         fetchRecipeData();
    //       }
    //     } else {
    //       console.log("No userMealPlan data available");
    //       fetchRecipeData();
    //     }
    //   } catch (error) {
    //     console.error("Error fetching user data: ", error);
    //   }
    // };

    // const generateRandomizedMeal = () => {
    //   try {
    //     if (recipeDetails) {
    //       //new code
    //       const changeAllergenName: string[] = userAllergen.map((innerArray) =>
    //         innerArray.map((category: any) =>
    //           category.name === "wheat"
    //             ? "Wheat/Gluten-Free"
    //             : category.name === "seafood"
    //             ? "Seafood"
    //             : category.name === "dairy"
    //             ? "Dairy Free"
    //             : category.name === "egg"
    //             ? "Egg"
    //             : category.name === "soy"
    //             ? "Soy Free"
    //             : category.name === "peanut"
    //             ? "Peanut Free"
    //             : "Vegetarian"
    //         )
    //       );

    //       const WOSeafood = changeAllergenName
    //         .flat()
    //         .filter((item) => item !== "Seafood");
    //       const WOEggAndSeafood = WOSeafood.flat().filter(
    //         (item) => item !== "Egg"
    //       );

    //       const WSeafood =
    //         changeAllergenName.flat().includes("Seafood") &&
    //         !changeAllergenName.flat().includes("Egg")
    //           ? ["Seafood"]
    //           : [];

    //       const WEgg =
    //         changeAllergenName.flat().includes("Egg") &&
    //         !changeAllergenName.flat().includes("Seafood")
    //           ? ["Egg"]
    //           : [];

    //       const WEggAndSeafood =
    //         changeAllergenName.flat().includes("Seafood") &&
    //         changeAllergenName.flat().includes("Egg")
    //           ? ["Seafood", "Egg"]
    //           : [];

    //       console.log("Allergen that are not egg or seafood", WOEggAndSeafood);

    //       recipeDetails.flat().forEach((recipe: { categories: any }) => {
    //         const { categories } = recipe;
    //         if (categories) {
    //           if (
    //             WOEggAndSeafood.every((category) =>
    //               categories.includes(category)
    //             )
    //           ) {
    //             tempData.push(recipe);
    //           }
    //         }
    //       });

    //       console.log("the amount of filtered", tempData.flat().length);

    //       const Seafood = [
    //         "Seafood",
    //         "Shellfish",
    //         "Shrimp",
    //         "Fish",
    //         "Salmon",
    //         "Scallop",
    //         "Cod",
    //         "Bass",
    //         "Lobster",
    //         "Halibut",
    //         "Mussel",
    //         "Octopus",
    //       ];
    //       const SeafoodAndEgg = [...Seafood, "Egg"];
    //       console.log("egg and seafood", WEggAndSeafood.flat().length);
    //       console.log("egg only", WEgg.flat().length);
    //       console.log("seafood only", WSeafood.flat().length);

    //       const ttData = tempData.filter((recipe) => {
    //         const { categories } = recipe;
    //         if (categories) {
    //           if (WEggAndSeafood.flat().length > 0) {
    //             // Check if any of the categories match the ones in SeafoodAndEgg
    //             return !SeafoodAndEgg.some((category) =>
    //               categories.includes(category)
    //             );
    //           }
    //           if (WSeafood.flat().length > 0) {
    //             // Check if any of the categories match the ones in SeafoodAndEgg
    //             return !Seafood.some((category) =>
    //               categories.includes(category)
    //             );
    //           }
    //           if (WEgg.flat().length > 0) {
    //             // Check if any of the categories match the ones in SeafoodAndEgg
    //             return !Seafood.some((category) => categories.includes("Egg"));
    //           }
    //         }
    //       });
    //       console.log("ttdt", ttData.flat().length);

    //       tempData.flat().forEach((recipe: { categories: any }) => {
    //         const { categories } = recipe;
    //         if (categories) {
    //           if (WEggAndSeafood.flat().length > 0) {
    //             if (
    //               !SeafoodAndEgg.flat().some(
    //                 (category) => categories == category
    //               )
    //             ) {
    //               FTempData.push(recipe);
    //             }
    //           }
    //           if (WSeafood.flat().length > 0) {
    //             if (
    //               !Seafood.flat().some((category) => categories == category)
    //             ) {
    //               FTempData.push(recipe);
    //             }
    //           }
    //           if (WEgg.flat().length > 0) {
    //             if (categories != "Egg") {
    //               FTempData.push(recipe);
    //             }
    //           }
    //         }
    //       });

    //       console.log("the amount of filtered again", FTempData.flat().length);

    //       //new code ends

    //       console.log("~mealPlanRandomizer");

    //       // Filter recipes from recipe based on breakfast/lunch/dinner
    //       var breakfastRecipes: any = [];
    //       var lunchRecipes: any = [];
    //       var dinnerRecipes: any = [];
    //       if (ttData.flat().length > 0) {
    //         breakfastRecipes = ttData.filter((recipe: any) =>
    //           recipe.categories.includes("Breakfast")
    //         );
    //         lunchRecipes = ttData.filter((recipe: any) =>
    //           recipe.categories.includes("Lunch")
    //         );
    //         dinnerRecipes = ttData.filter((recipe: any) =>
    //           recipe.categories.includes("Dinner")
    //         );
    //       } else {
    //         breakfastRecipes = tempData.filter((recipe: any) =>
    //           recipe.categories.includes("Breakfast")
    //         );
    //         lunchRecipes = tempData.filter((recipe: any) =>
    //           recipe.categories.includes("Lunch")
    //         );
    //         dinnerRecipes = tempData.filter((recipe: any) =>
    //           recipe.categories.includes("Dinner")
    //         );
    //       }

    //       console.log("breakfastRecipes", breakfastRecipes.length);
    //       console.log("lunchRecipes", lunchRecipes.length);
    //       console.log("dinnerRecipes", dinnerRecipes.length);

    //       // Randomly select one recipe for each category
    //       const getRandomRecipe = (recipes: any[]) => {
    //         if (recipes.length > 0) {
    //           const availableRecipes = recipes.filter(
    //             (recipe) => !usedRecipes.includes(recipe)
    //           );
    //           if (availableRecipes.length > 0) {
    //             const randomIndex = Math.floor(
    //               Math.random() * availableRecipes.length
    //             );
    //             const selectedRecipe = availableRecipes[randomIndex];
    //             usedRecipes.push([...usedRecipes, selectedRecipe]); // Add the selected recipe to usedRecipes
    //             console.log("usedRecipes", usedRecipes.length);
    //             console.log("selectedRecipe", selectedRecipe.length);
    //             return selectedRecipe;
    //           }
    //           // const randomIndex = Math.floor(Math.random() * recipes.length);
    //           // return recipes[randomIndex];
    //         }
    //         return null;
    //       };

    //       //new code for calorie limit per day
    //       const BR: any = [];
    //       const LR: any = [];
    //       const DR: any = [];
    //       let totalCalories = 0;
    //       const TC: number = userDetails[0].user.totalCalories;
    //       let noCal = false;

    //       do {
    //         BR.length = 0;
    //         LR.length = 0;
    //         DR.length = 0;
    //         totalCalories = 0;
    //         noCal = false;
    //         BR.push(getRandomRecipe(breakfastRecipes));
    //         LR.push(getRandomRecipe(lunchRecipes));
    //         DR.push(getRandomRecipe(dinnerRecipes));

    //         BR.flat().forEach((recipe: { calories: any }) => {
    //           const { calories } = recipe;
    //           console.log("b", calories);
    //           if (calories == null) {
    //             noCal = true;
    //           }
    //           totalCalories = totalCalories + calories;
    //         });
    //         LR.flat().forEach((recipe: { calories: any }) => {
    //           const { calories } = recipe;
    //           console.log("l", calories);
    //           if (calories == null) {
    //             noCal = true;
    //           }
    //           totalCalories = totalCalories + calories;
    //         });
    //         DR.flat().forEach((recipe: { calories: any }) => {
    //           const { calories } = recipe;
    //           console.log("d", calories);
    //           if (calories == null) {
    //             noCal = true;
    //           }
    //           totalCalories = totalCalories + calories;
    //         });
    //         console.log("ttcalorie", totalCalories);
    //       } while (totalCalories > TC || noCal);

    //       if (BR) {
    //         randomData.push(BR);
    //       }
    //       if (LR) {
    //         randomData.push(LR);
    //       }
    //       if (DR) {
    //         randomData.push(DR);
    //       }
    //       console.log("Random Object:", randomData.flat());
    //       if (regenerateState) {
    //         Regenerate();
    //       } else {
    //         upload3RandomizedMeal();
    //       }
    //     } else {
    //       console.log("Failed to retrieve recipe and randomized meal");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching recipe data: ", error);
    //   }
    // };

    fetchUserData();
    // generateRandomizedMeal();
    // upload3RandomizedMeal();
  }, []);

  return (
    // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //   <ScrollView>
    //     <Text>EatWell</Text>
    //     <Text>Today's Meal Plan</Text>
    //     {/* <ScrollView></ScrollView> */}

    //     {randomData.length > 0 &&
    //       randomData.map((meal, index) => (
    //         <View key={index}>
    //           {/* Display each meal's details */}
    //           <Text>Meal {index + 1}:</Text>
    //           {meal.map((recipe: any, recipeIndex: number) => (
    //             <Text key={recipeIndex}>{recipe.title}</Text>
    //             // You can display other recipe details here as needed
    //           ))}
    //         </View>
    //       ))}
    //     <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
    //   </ScrollView>
    // </View>
    <View
      style={{
        flex: 1,
        backgroundColor: "#f0f0f0",
        padding: 20,
        marginTop: 50,
      }}
    >
      <ScrollView>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          EatWell
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          Today's Meal Plan
        </Text>
        {userMealPlan && userMealPlan.length > 0 ? (
          <Text>Got data</Text>
        ) : (
          <Text>No Data</Text>
        )}
        {userMealPlan.length > 0 &&
          userMealPlan.map((meal, index) => (
            <View
              key={index}
              style={{
                marginBottom: 20,
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
              >
                Meal {index + 1}:
              </Text>
              {meal.map((recipe: any, recipeIndex: number) => (
                <Text
                  key={recipeIndex}
                  style={{ fontSize: 16, marginBottom: 5 }}
                >
                  {recipe.title}
                </Text>
                // You can display other recipe details here as needed
              ))}
            </View>
          ))}

        {/* {userMealPlan.length > 0 &&
          userMealPlan.map((meal, index) => (
            <View
              key={index}
              style={{
                marginBottom: 20,
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
              >
                Meal {index + 1}:
              </Text>
              {meal.map((recipe: any, recipeIndex: number) => (
                <Text
                  key={recipeIndex}
                  style={{ fontSize: 16, marginBottom: 5 }}
                >
                  {recipe.title}
                </Text>
                // You can display other recipe details here as needed
              ))}
            </View>
          ))} */}
        <Button onPress={Regenerate} title="Regenerate" />

        <Button
          onPress={generateRandomizedMeal}
          title="Generate a Day's Meal"
        />
        <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
      </ScrollView>
    </View>
  );
};

export default List;
