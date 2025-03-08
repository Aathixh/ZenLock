import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";

const Home = () => {
  const [doorState, setDoorState] = useState("closed");
  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
  },
  centerContainer: {
    justifyContent: "center",
    flex: 1,
  },
  outerCircle: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderRadius: 110,
    width: 280,
    height: 280,
    backgroundColor: "transparent",
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
  },
  subhead: {
    marginTop: 10,
    textAlign: "center",
    fontSize: RFValue(15),
  },
  buttonText: {
    top: 50,
    fontSize: RFValue(20),
  },
});
