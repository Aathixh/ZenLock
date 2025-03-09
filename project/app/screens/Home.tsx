import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const Home = () => {
  const [loaded] = useFonts({
    "Poppins-Reg": require("../../assets/fonts/Poppins400Reg.ttf"),
    "Poppins-Med": require("../../assets/fonts/Poppins500Med.ttf"),
  });
  const [doorState, setDoorState] = useState("closed");
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3E5C76", "#74ACDC"]}
        style={styles.background}
      />
      <Text style={styles.head}>Welcome Back</Text>
      <Text style={styles.subhead}>
        Your door automation companion is ready to assist you.
      </Text>

      <View style={styles.centerContainer}>
        <TouchableOpacity style={styles.outerCircle}>
          <Text>{doorState === "closed" ? "Open" : "Close"}</Text>
          <View
            style={[
              styles.led,
              { backgroundColor: doorState === "closed" ? "green" : "red" },
            ]}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonText}>
        <Text>Connect</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

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
  centerContainer: {
    justifyContent: "center",
    flex: 1,
  },
  outerCircle: {
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderRadius: 110,
    width: 280,
    height: 280,
    backgroundColor: "#EFEFEF",
  },
  led: {
    position: "absolute",
    top: 200,
    width: 35,
    height: 10,
    borderRadius: 10,
  },
  head: {
    marginTop: 70,
    textAlign: "center",
    fontSize: RFValue(30),
    fontFamily: "Poppins-Med",
    height: RFValue(40),
  },
  subhead: {
    textAlign: "center",
    fontSize: RFValue(14),
    fontFamily: "Poppins-Reg",
    marginLeft: RFValue(20),
    marginRight: RFValue(20),
  },
  buttonText: {
    top: 50,
    fontSize: RFValue(20),
  },
});
