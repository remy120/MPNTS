import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Allergen from "./Allergen";
import Gender from "./Gender";
import LoggedWProfile from "./LoggedWProfile";

const Stack = createNativeStackNavigator();

export default function LoggedWOProfile() {
  return (
    <Stack.Navigator
      initialRouteName="Gender"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Gender" component={Gender} />
      <Stack.Screen name="Allergen" component={Allergen} />
      <Stack.Screen name="LoggedWProfile" component={LoggedWProfile} />
    </Stack.Navigator>
  );
}
