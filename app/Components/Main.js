import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import { get, ref, update } from "firebase/database";
import Spinner from "react-native-loading-spinner-overlay";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import { connectAuthEmulator } from "firebase/auth";
import Colors from "../../assets/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function List3({ navigation }) {
  //dump
  const [count, setCount] = useState(0);

  //general data
  const [userDetails, setUserDetails] = useState([]);
  const [allergenData, setAllergenData] = useState([]);
  const [mealPlanData, setMealPlanData] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState([]);

  //food filtering data
  const [tempData, setTempData] = useState([]);
  const [FTempData, setfTempData] = useState([]);
  const [randomData, setRandomData] = useState([]);
  let ttData;

  //current mealPlan nutrition info
  const [caloriesData, setCaloriesData] = useState([]);
  const [proteinData, setProteinData] = useState([]);
  const [fatData, setFatData] = useState([]);
  const [sodiumData, setSodiumData] = useState([]);

  //loading
  const [isLoading, setLoading] = useState(false);

  //store userID
  const [UID, setUID] = useState([]);

  const Regenerate = () => {
    console.log("~Regenerate");
    console.log("mealPlanData.length", mealPlanData.length);

    generateRandomizedMeal();

    const numRegenerateRandomizedMeals =
      mealPlanData.length === 0 ? 0 : mealPlanData.length; // Get the count of objects in randomData
    console.log("numRandomizedMeals", numRegenerateRandomizedMeals);

    const updates = {};
    updates["/users/" + UID + "/mealPlan/" + numRegenerateRandomizedMeals] =
      randomData.flat();

    console.log("Regenerated");

    update(ref(FIREBASE_DB), updates);
    setTempData([]);
    setfTempData([]);
    setRecipeDetails([]);
    setCount(count + 1);
  };

  const upload3RandomizedMeal = () => {
    console.log("mealPlanData.length", mealPlanData.length);

    generateRandomizedMeal();

    const numRandomizedMeals =
      mealPlanData.flat().length === 0 ? 0 : mealPlanData.flat().length; // Get the count of objects in randomData
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
        console.log("User allergic to", allergenData);
        var breakfastRecipes = [];
        var lunchRecipes = [];
        var dinnerRecipes = [];

        if (allergenData != "") {
          const changeAllergenName = allergenData.map((innerArray) =>
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

          if (WOEggAndSeafood != null) {
            recipeDetails.flat().forEach((recipe) => {
              const { categories } = recipe;
              if (categories) {
                if (
                  WOEggAndSeafood.every((category) =>
                    categories.includes(category)
                  )
                ) {
                  tempData.push(recipe);
                }
              }
            });
          } else {
            recipeDetails.flat().forEach((recipe) => {
              tempData.push(recipe);
            });
          }

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

          console.log("the amount of filtered", tempData.flat().length);
          const SeafoodAndEgg = [...Seafood, "Egg"];

          console.log("egg and seafood", WEggAndSeafood.flat().length);
          console.log("egg only", WEgg.flat().length);
          console.log("seafood only", WSeafood.flat().length);

          ttData = tempData.filter((recipe) => {
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
                return !Seafood.some((category) =>
                  categories.includes(category)
                );
              }
              if (WEgg.flat().length > 0) {
                // Check if any of the categories match the ones in SeafoodAndEgg
                return !Seafood.some(() => categories.includes("Egg"));
              }
            }
          });

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
        } else {
          recipeDetails.flat().forEach((recipe) => {
            const { categories } = recipe;
            tempData.push(recipe);
          });

          ttData = tempData.filter((recipe) => {
            const { categories } = recipe;
            if (categories) {
              return categories;
            }
          });

          tempData.flat().forEach((recipe) => {
            const { categories } = recipe;
            if (categories) {
              FTempData.push(recipe);
            }
          });
        }

        // const Seafood = [
        //   "Seafood",
        //   "Shellfish",
        //   "Shrimp",
        //   "Fish",
        //   "Salmon",
        //   "Scallop",
        //   "Cod",
        //   "Bass",
        //   "Lobster",
        //   "Halibut",
        //   "Mussel",
        //   "Octopus",
        // ];

        // const SeafoodAndEgg = [...Seafood, "Egg"];

        // if (allergenData != "") {
        // const Seafood = [
        //   "Seafood",
        //   "Shellfish",
        //   "Shrimp",
        //   "Fish",
        //   "Salmon",
        //   "Scallop",
        //   "Cod",
        //   "Bass",
        //   "Lobster",
        //   "Halibut",
        //   "Mussel",
        //   "Octopus",
        // ];

        // console.log("egg and seafood", WEggAndSeafood.flat().length);
        // console.log("egg only", WEgg.flat().length);
        // console.log("seafood only", WSeafood.flat().length);

        // ttData = tempData.filter((recipe) => {
        //   const { categories } = recipe;
        //   if (categories) {
        //     if (WEggAndSeafood.flat().length > 0) {
        //       // Check if any of the categories match the ones in SeafoodAndEgg
        //       return !SeafoodAndEgg.some((category) =>
        //         categories.includes(category)
        //       );
        //     }
        //     if (WSeafood.flat().length > 0) {
        //       // Check if any of the categories match the ones in SeafoodAndEgg
        //       return !Seafood.some((category) =>
        //         categories.includes(category)
        //       );
        //     }
        //     if (WEgg.flat().length > 0) {
        //       // Check if any of the categories match the ones in SeafoodAndEgg
        //       return !Seafood.some(() => categories.includes("Egg"));
        //     }
        //   }
        // });
        // } else {
        //   ttData = tempData.filter((recipe) => {
        //     const { categories } = recipe;
        //     if (categories) {
        //       return categories;
        //     }
        //   });
        // }

        //i deleted the .flat() here "!SeafoodAndEgg.flat().some((category) => categories == category)"
        // if (allergenData != "") {
        // tempData.flat().forEach((recipe) => {
        //   const { categories } = recipe;
        //   if (categories) {
        //     if (WEggAndSeafood.flat().length > 0) {
        //       if (!SeafoodAndEgg.some((category) => categories == category)) {
        //         FTempData.push(recipe);
        //       }
        //     }
        //     if (WSeafood.flat().length > 0) {
        //       if (!Seafood.some((category) => categories == category)) {
        //         FTempData.push(recipe);
        //       }
        //     }
        //     if (WEgg.flat().length > 0) {
        //       if (categories != "Egg") {
        //         FTempData.push(recipe);
        //       }
        //     }
        //   }
        // });
        // } else {
        //   tempData.flat().forEach((recipe) => {
        //     const { categories } = recipe;
        //     if (categories) {
        //       FTempData.push(recipe);
        //     }
        //   });
        // }

        console.log("the amount of filtered again", FTempData.flat().length);
        console.log("~mealPlanRandomizer--------WAllergen");

        // Filter recipes from recipe based on breakfast/lunch/dinner
        if (ttData.flat().length > 0) {
          breakfastRecipes = ttData.filter(
            (recipe) =>
              recipe.categories.includes("Breakfast") &&
              !recipe.categories.includes("Lunch") &&
              !recipe.categories.includes("Dinner")
          );
          lunchRecipes = ttData.filter(
            (recipe) =>
              recipe.categories.includes("Lunch") &&
              !recipe.categories.includes("Breakfast") &&
              !recipe.categories.includes("Dinner")
          );
          dinnerRecipes = ttData.filter(
            (recipe) =>
              recipe.categories.includes("Dinner") &&
              !recipe.categories.includes("Breakfast") &&
              !recipe.categories.includes("Lunch")
          );
        } else {
          breakfastRecipes = tempData.filter(
            (recipe) =>
              recipe.categories.includes("Breakfast") &&
              !recipe.categories.includes("Lunch") &&
              !recipe.categories.includes("Dinner")
          );
          lunchRecipes = tempData.filter(
            (recipe) =>
              recipe.categories.includes("Lunch") &&
              !recipe.categories.includes("Breakfast") &&
              !recipe.categories.includes("Dinner")
          );
          dinnerRecipes = tempData.filter(
            (recipe) =>
              recipe.categories.includes("Dinner") &&
              !recipe.categories.includes("Breakfast") &&
              !recipe.categories.includes("Lunch")
          );
        }
        // } else {
        //   //new code ends

        //   console.log("~mealPlanRandomizer------------WOAllergen");
        //   console.log("recipeDetails.length", recipeDetails.length);

        //   // // Filter recipes from recipe based on breakfast/lunch/dinner
        //   breakfastRecipes = recipeDetails.filter((recipe) =>
        //     recipe.categories.includes("Breakfast")
        //   );
        //   lunchRecipes = recipeDetails.filter((recipe) =>
        //     recipe.categories.includes("Lunch")
        //   );
        //   dinnerRecipes = recipeDetails.filter((recipe) =>
        //     recipe.categories.includes("Dinner")
        //   );
        // }

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
      const randomIndex = Math.floor(Math.random() * recipes.length);
      return recipes[randomIndex];
    }
    return null;
  };

  const onSelect = (mealPlanItem) => {
    // Navigate to the "MealPlanDetail" screen with the selected meal plan item
    navigation.navigate("MealPlanDetails", { mealPlanItem });
  };

  const firstUpdate = useRef(true);

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

    const setData = () => {
      console.log("setting data");
      setAllergenData(
        userDetails.map((userDetail) =>
          userDetail.allergen
            ? userDetail.allergen.map((allergen) => allergen.name)
            : ""
        )
      );

      userDetails.map((userDetail) => {
        if (userDetail.mealPlan) {
          let totalCalories = 0;
          let totalProtein = 0;
          let totalFat = 0;
          let totalSodium = 0;

          const latestMealPlan =
            userDetail.mealPlan[userDetail.mealPlan.length - 1];
          for (const meal of latestMealPlan) {
            totalCalories += meal.calories;
            totalProtein += meal.protein;
            totalFat += meal.fat;
            totalSodium += meal.sodium;
          }
          setCaloriesData(totalCalories);
          setProteinData(totalProtein);
          setFatData(totalFat);
          setSodiumData(totalSodium);
          setMealPlanData(userDetail.mealPlan.map((mealPlan) => mealPlan));
        } else {
          console.log("no meal plan yet");
          upload3RandomizedMeal();
        }
      });
    };
    if (userDetails.length != 0) {
      console.log("userdetails changed");
      console.log("UserDetails", userDetails);
      setData();
    }

    fetchRecipeData();
  }, [userDetails]); //userDetails

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    setUID(user.uid);

    const getUser = async () => {
      console.log("-----GETTING USER-----");

      setLoading(true);
      if (user) {
        const userRef = ref(FIREBASE_DB, "users/" + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const UD = [];
          UD.push(snapshot.val());
          console.log("User Details BEFORE", userDetails);
          setUserDetails(UD);

          setLoading(false);
        } else {
          setUserDetails([]);
          setLoading(false);
        }
      } else {
        alert("User unauthenticated, please login again");
      }
    };

    getUser();
  }, [count]); //count

  useEffect(() => {
    const checkMealPlan = () => {
      console.log("there is changes in user meal plan");
      if (userDetails.length != 0) {
        if (mealPlanData.length === 0) {
          console.log("no meal plan yet");
          upload3RandomizedMeal();
        } else {
          console.log("already have meal plan");
        }
      }
    };
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    checkMealPlan();
  }, [mealPlanData]); //mealPlanData

  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Colors.white,
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={[Colors.pink2Dark, Colors.pink1, Colors.white]}
          style={styles.box}
        ></LinearGradient>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Eatwell</Text>
          {userDetails.length > 0 &&
            userDetails.map((userDetail, userIndex) => (
              <View key={userIndex}>
                <View style={styles.imgContainer}>
                  <Image
                    style={styles.img}
                    source={
                      userDetail.user.gender === "male"
                        ? require("../../assets/img/man.png")
                        : require("../../assets/img/woman.png")
                    }
                  />
                  <Text style={{ marginLeft: 5, alignSelf: "center" }}>
                    {userDetail.user.name}
                  </Text>

                  <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => FIREBASE_AUTH.signOut()}
                  >
                    <Ionicons
                      name={"log-out"}
                      size={40}
                      color={Colors.purpleSelected}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.mealPlanContainer}>
                  <Text style={styles.mealPlanTitle}>Today's Meal Plan</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {mealPlanData.length > 0 &&
                      mealPlanData[mealPlanData.length - 1].map(
                        (mealPlanItem, mealPlanIndex) => (
                          <View key={mealPlanIndex} style={styles.mealPlanBtn}>
                            <TouchableOpacity
                              style={[styles.button]}
                              onPress={() => {
                                onSelect(mealPlanItem);
                              }}
                            >
                              {/* Loop through the categories array and display the corresponding image */}
                              {mealPlanItem.categories.map(
                                (category, categoryIndex) => (
                                  <View key={categoryIndex}>
                                    {category === "Breakfast" && (
                                      <>
                                        <View
                                          style={[
                                            styles.mealPlanLogo,
                                            {
                                              backgroundColor:
                                                Colors.purpleDark,
                                            },
                                          ]}
                                        >
                                          <Text style={styles.mealPlanLogoText}>
                                            {category}
                                          </Text>
                                        </View>
                                        <Image
                                          style={styles.mealPlanIcon}
                                          source={require("../../assets/img/breakfast.png")}
                                        />
                                      </>
                                    )}
                                    {category === "Lunch" && (
                                      <>
                                        <View
                                          style={[
                                            styles.mealPlanLogo,
                                            {
                                              backgroundColor:
                                                Colors.orangeDark,
                                            },
                                          ]}
                                        >
                                          <Text style={styles.mealPlanLogoText}>
                                            {category}
                                          </Text>
                                        </View>
                                        <Image
                                          style={styles.mealPlanIcon}
                                          source={require("../../assets/img/lunch.png")}
                                        />
                                      </>
                                    )}
                                    {category === "Dinner" && (
                                      <>
                                        <View
                                          style={[
                                            styles.mealPlanLogo,
                                            {
                                              backgroundColor: Colors.redDark,
                                            },
                                          ]}
                                        >
                                          <Text style={styles.mealPlanLogoText}>
                                            {category}
                                          </Text>
                                        </View>
                                        <Image
                                          style={styles.mealPlanIcon}
                                          source={require("../../assets/img/dinner.png")}
                                        />
                                      </>
                                    )}
                                  </View>
                                )
                              )}
                              <View style={styles.mealPlanView}>
                                <Text style={styles.mealPlanTitleText}>
                                  {mealPlanItem.title}
                                </Text>

                                <View style={styles.mealPlanNutritionView}>
                                  <Text style={styles.mealPlanNutritionLabel}>
                                    Calories
                                  </Text>

                                  <Text style={styles.mealPlanNutrition}>
                                    {mealPlanItem.calories}
                                  </Text>

                                  <Text style={styles.mealPlanNutritionLabel}>
                                    Fat
                                  </Text>

                                  <Text style={styles.mealPlanNutrition}>
                                    {mealPlanItem.fat}g
                                  </Text>

                                  <Text style={styles.mealPlanNutritionLabel}>
                                    Protein
                                  </Text>

                                  <Text style={styles.mealPlanNutrition}>
                                    {mealPlanItem.protein}g
                                  </Text>

                                  <Text style={styles.mealPlanNutritionLabel}>
                                    Sodium
                                  </Text>

                                  <Text style={styles.mealPlanNutrition}>
                                    {mealPlanItem.sodium}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        )
                      )}
                  </ScrollView>
                </View>

                <View style={styles.mealPlanNutritionContainer}>
                  <Text style={styles.mealPlanTitle}>
                    Today's Nutrition Intake
                  </Text>

                  <View style={styles.nutritionIntakeContainer}>
                    <View style={styles.nutritionIntakeTextContainer}>
                      <Text style={styles.mealPlanNutritionIntakeLabel}>
                        Total Calories
                      </Text>
                      <Text style={styles.mealPlanNutritionIntake}>
                        {caloriesData}
                      </Text>

                      <Text style={styles.mealPlanNutritionIntakeLabel}>
                        Total Protein (g)
                      </Text>
                      <Text style={styles.mealPlanNutritionIntake}>
                        {proteinData}
                      </Text>

                      <Text style={styles.mealPlanNutritionIntakeLabel}>
                        Total Fat (g)
                      </Text>
                      <Text style={styles.mealPlanNutritionIntake}>
                        {fatData}
                      </Text>

                      <Text style={styles.mealPlanNutritionIntakeLabel}>
                        Sodium (mg)
                      </Text>
                      <Text style={styles.mealPlanNutritionIntake}>
                        {sodiumData}
                      </Text>
                    </View>
                    <View>
                      <Image
                        style={styles.mealPlanIcon}
                        source={require("../../assets/img/schedule.png")}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.mealPlanNutritionContainer}>
                  <Text style={styles.mealPlanTitle}>
                    Recommended Daily Intake
                  </Text>

                  <View style={styles.nutritionIntakeRecommendedContainer}>
                    <View style={styles.innerRecommendedContainer}>
                      <Text
                        style={[
                          styles.mealPlanNutritionIntakeRecommendedLabel,
                          {},
                        ]}
                      >
                        Calorie Requirement
                      </Text>
                      <Text style={styles.mealPlanNutritionRecommendedIntake}>
                        {userDetail.user.totalCalories} kcal
                      </Text>

                      <Text
                        style={styles.mealPlanNutritionIntakeRecommendedLabel}
                      >
                        Carbohydrates (g)
                      </Text>
                      <Text style={styles.mealPlanNutritionRecommendedIntake}>
                        {userDetail.user.carbMin} - {userDetail.user.carbMax}
                      </Text>

                      <Text
                        style={styles.mealPlanNutritionIntakeRecommendedLabel}
                      >
                        Fiber (g)
                      </Text>
                      <Text style={styles.mealPlanNutritionRecommendedIntake}>
                        {userDetail.user.fiber}
                      </Text>

                      <Text
                        style={styles.mealPlanNutritionIntakeRecommendedLabel}
                      >
                        Protein (g)
                      </Text>
                      <Text style={styles.mealPlanNutritionRecommendedIntake}>
                        {userDetail.user.proteinMin} -{" "}
                        {userDetail.user.proteinMax}
                      </Text>

                      <Text
                        style={styles.mealPlanNutritionIntakeRecommendedLabel}
                      >
                        Fat (g)
                      </Text>
                      <Text style={styles.mealPlanNutritionRecommendedIntake}>
                        {userDetail.user.fatMin} - {userDetail.user.fatMax}
                      </Text>

                      <Text
                        style={styles.mealPlanNutritionIntakeRecommendedLabel}
                      >
                        Water
                      </Text>
                      <Text style={styles.mealPlanNutritionRecommendedIntake}>
                        {userDetail.user.water / 1000} liters
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}

          <TouchableOpacity style={styles.regenerateBtn} onPress={Regenerate}>
            <Ionicons
              name={"refresh-circle"}
              size={40}
              color={Colors.purpleSelected}
            />
            <Text style={styles.regeneratebtnTxt}>Regenerate</Text>
          </TouchableOpacity>
          {/* <Button onPress={Regenerate} title="Dice" /> */}
          <Spinner
            visible={isLoading}
            textContent={"Loading..."}
            textStyle={{ color: "#FFF" }}
            size={100}
          ></Spinner>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  box: {
    position: "absolute",
    height: 400,
    width: "100%",
    zIndex: -99,
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  innerContainer: {
    marginTop: 50,
  },
  imgContainer: {
    flexDirection: "row",
    paddingLeft: 20,
    marginTop: -30,
  },
  img: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  desc: {
    fontFamily: "",
    fontSize: 16,
    lineHeight: 20,
    paddingTop: 5,
    paddingBottom: 40,
  },
  mealPlanContainer: {
    marginVertical: 10,
  },
  mealPlanTitle: {
    // paddingLeft: 20,
    fontSize: 26,
    textAlign: "center",
    fontWeight: "400",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealPlanBtn: {
    marginLeft: 20,
    marginRight: 10,
    marginVertical: 10,
  },
  mealPlanIcon: {
    width: 100,
    height: 100,
  },
  button: {
    width: 320,
    height: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    elevation: 2,
  },
  mealPlanTitleText: {
    fontSize: 18,
  },
  mealPlanView: {
    width: 180,
    paddingVertical: 10,
    paddingLeft: 10,
    flexDirection: "column",
  },
  mealPlanNutritionView: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
  },
  mealPlanNutritionLabel: {
    fontSize: 12,
    color: Colors.darkGrey,
  },
  mealPlanNutritionIntakeLabel: {
    fontSize: 14,
    color: Colors.darkGrey,
  },
  mealPlanNutrition: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
    color: Colors.darkGrey,
  },
  mealPlanNutritionIntake: {
    paddingLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 22,
    color: Colors.darkGrey,
  },
  mealPlanLogo: {
    backgroundColor: Colors.pink1,
    position: "absolute",
    width: 100,
    height: 20,
    marginTop: -25,
    marginLeft: -20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 99,
  },
  mealPlanLogoText: {
    zIndex: 999,
    textAlign: "center",
    color: Colors.white,
  },
  mealPlanNutritionContainer: {
    marginVertical: 10,
  },
  nutritionIntakeContainer: {
    marginVertical: 10,
    width: "90%",
    height: 150,
    justifyContent: "space-around",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: Colors.orange1,
    elevation: 1,
    flexDirection: "row",
  },
  nutritionIntakeTextContainer: {
    width: "45%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  nutritionIntakeRecommendedContainer: {
    marginVertical: 10,
    paddingHorizontal: 30,
    width: "90%",
    height: 160,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: Colors.greenLight,
    elevation: 1,
  },
  innerRecommendedContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: "column",
    flexWrap: "wrap",
    alignContent: "space-between",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  mealPlanNutritionRecommendedIntake: {
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 20,
    color: Colors.darkGrey,
  },
  mealPlanNutritionIntakeRecommendedLabel: {
    fontSize: 14,
    color: Colors.darkGrey,
  },
  logoutBtn: {
    // alignSelf: "flex-end",
    position: "absolute",
    right: 20,
  },
  regenerateBtn: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    elevation: 2,
    borderRadius: 30,
    borderColor: Colors.grey,
    borderWidth: 0.2,
  },
  regeneratebtnTxt: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingRight: 5,
  },
});
