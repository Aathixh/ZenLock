import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import SplashScreen from "./screens/Splash";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./screens/Home";
import { enableScreens } from "react-native-screens";
import WifiScan from "./screens/setup/WifiScan";
import { Platform } from "react-native";
enableScreens();
const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator:
              Platform.OS === "ios"
                ? CardStyleInterpolators.forHorizontalIOS
                : CardStyleInterpolators.forScaleFromCenterAndroid,
          }}
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
          <Stack.Screen name="WifiScan" component={WifiScan} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
