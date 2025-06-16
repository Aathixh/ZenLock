import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/Splash";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./screens/Home";
import { enableScreens } from "react-native-screens";
import WifiScan from "./screens/setup/WifiScan";
import UserManagement from "./screens/UserManagementScreen";
import RequestAccess from "./screens/RequestAccess";
enableScreens();
const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
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
          <Stack.Screen
            name="WifiScan"
            component={WifiScan}
            options={{ title: "Wi-Fi Scan" }}
          />
          <Stack.Screen
            name="UserManagement"
            component={UserManagement}
            options={{ title: "User Management" }}
          />
          <Stack.Screen
            name="RequestAccess"
            component={RequestAccess}
            options={{ title: "Request Access" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
