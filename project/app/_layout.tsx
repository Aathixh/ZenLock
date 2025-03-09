import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/Splash";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./screens/Home";
import { enableScreens } from "react-native-screens";
enableScreens();
const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="inverted" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ title: "Splash Screen" }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Home Screen" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
