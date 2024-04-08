import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Accounts } from "./src/Accounts/Accounts";
import { AccountDetails } from "./src/AccountDetails/AccountDetails";

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          presentation: Platform.OS === "android" ? "modal" : undefined,
        }}
      >
        <Stack.Screen key="accounts" name="Accounts" component={Accounts} />
        <Stack.Screen key="accountDetails" name="AccountDetails" component={AccountDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
