import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import MealPlanDetail from "./MealPlanDetails";
import Main from "./Main";
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
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen
        name="Main"
        component={Main}
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

export default function LoggedWProfile() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Bookmark") {
            iconName = focused ? "bookmark" : "bookmark-outline";
          } else if (route.name === "ProfileLayout") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Detail") {
            iconName = focused ? "receipt" : "receipt-outline";
          } else if (route.name === "Challenges") {
            iconName = focused ? "water" : "water-outline";
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
        name="ProfileLayout"
        component={ProfileLayout}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
