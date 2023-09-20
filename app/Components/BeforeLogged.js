import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import SignUp from "./SignUp";
import StaffHome from "./StaffHome";
import StaffBrowseUser from "./StaffBrowseUser";
import StaffBrowseFeedback from "./StaffBrowseFeedback";

const Stack = createNativeStackNavigator();

export default function BeforeLogged() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="StaffHome" component={StaffHome} />
      <Stack.Screen name="StaffBrowseUser" component={StaffBrowseUser} />
      <Stack.Screen
        name="StaffBrowseFeedback"
        component={StaffBrowseFeedback}
      />
    </Stack.Navigator>
  );
}
