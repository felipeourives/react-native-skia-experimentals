import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Screens } from "./src/menu/screens";
import { Menu } from "./src/menu/menu";

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
        <Stack.Screen key="menu" name="Menu" component={Menu} />
        {Screens.map((item, index) => {
          return (<Stack.Screen key={index} name={item.Name} component={item.Component} />);
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
