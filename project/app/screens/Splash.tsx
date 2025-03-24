import React, { useEffect } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { useFonts } from "expo-font";
import Lock3D from "../../assets/Lock3D";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";

export default function Splash() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loaded] = useFonts({
    "Poppins-Reg": require("../../assets/fonts/Poppins400Reg.ttf"),
    "Poppins-Med": require("../../assets/fonts/Poppins500Med.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins600SemiBold.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  const wiggleAnim = new Animated.Value(0);

  useEffect(() => {
    if (loaded) {
      const wiggle = Animated.loop(
        Animated.sequence([
          Animated.timing(wiggleAnim, {
            toValue: 2, // increased wiggle movement
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(wiggleAnim, {
            toValue: -2, // increased wiggle movement
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(wiggleAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      );

      wiggle.start();

      const timeout = setTimeout(() => {
        navigation.navigate("Home");
      }, 3000); // 3-second delay

      return () => {
        wiggle.stop();
        clearTimeout(timeout);
      };
    }
  }, [loaded, navigation]);

  if (!loaded) {
    return null; // or a loading spinner
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3E5C76", "#74ACDC"]}
        style={styles.background}
      />
      <Animated.View
        style={[
          styles.svg,
          {
            transform: [
              {
                rotate: wiggleAnim.interpolate({
                  inputRange: [-2, 2],
                  outputRange: ["-5deg", "5deg"],
                }),
              },
            ],
          },
        ]}
      >
        <Lock3D />
      </Animated.View>
      <Text style={styles.head}>ZenLock</Text>
      <Text style={styles.subHead}>Simplifying Security, Empowering Trust</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
  },
  svg: {
    width: RFValue(400),
    height: RFValue(400),
    alignItems: "center",
    justifyContent: "center",
    top: RFValue(100),
  },
  head: {
    fontFamily: "Poppins-Bold",
    fontSize: RFValue(40),
    color: "white",
    top: RFValue(50),
  },
  subHead: {
    fontFamily: "Poppins-Med",
    fontSize: RFValue(15),
    color: "white",
    top: RFValue(40),
  },
});
