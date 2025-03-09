import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { useFonts } from "expo-font";

export default function Splash() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loaded] = useFonts({
    "Poppins-Reg": require("../../assets/fonts/Poppins400Reg.ttf"),
    "Poppins-Med": require("../../assets/fonts/Poppins500Med.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins600SemiBold.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate("Home");
    }, 3000); // 3-second delay

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>Splash</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
  },
});
