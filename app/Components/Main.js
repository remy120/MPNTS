import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import MealPlanDetail from "./MealPlanDetails";
import Details from "./Details";
import List3 from "./List3";
import Bookmark from "./Bookmark";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import Challenges from "./Challenges";
import Colors from "../../assets/colors";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeLayout() {
  return (
    <HomeStack.Navigator
      initialRouteName="List"
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen
        name="List"
        component={List3}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen name="MealPlanDetails" component={MealPlanDetail} />
    </HomeStack.Navigator>
  );
}

function ProfileLayout() {
  return (
    <HomeStack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

export default function Main() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Bookmark") {
            iconName = "bookmark-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          } else if (route.name === "Detail") {
            iconName = "receipt-outline";
          } else if (route.name === "Challenges") {
            iconName = "water-outline";
          }
          return (
            <Ionicons
              name={iconName}
              size={25}
              color={focused ? Colors.purpleSelected : "grey"}
            />
          );
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.purpleSelected,
        tabBarInactiveTintColor: "grey",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeLayout}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Challenges"
        component={Challenges}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Bookmark"
        component={Bookmark}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileLayout}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
