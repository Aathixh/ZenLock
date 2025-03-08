import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "./types";

export default function Splash() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  setTimeout(() => {
    navigation.navigate("Home");
  }, 2000);

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
