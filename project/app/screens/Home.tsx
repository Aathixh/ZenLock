import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import Lock from "../../assets/Lock";
import PadLock from "../../assets/PadLock";
import WifiIcon from "../../assets/WifiIcon";
import WifiConnectedIcon from "../../assets/WifiConnectedIcon";
import BatteryIcon from "../../assets/BatteryIcon";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";

const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [doorState, setDoorState] = useState("closed");
  const [connected, setConnected] = useState(false);
  const [batteryPercentage, setBatteryPercentage] = useState(100);
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
          <View style={{ marginTop: RFValue(50) }}>
            {doorState === "closed" ? <Lock /> : <PadLock />}
          </View>
          <Text style={styles.btnText}>
            {doorState === "closed" ? "Open" : "Close"}
          </Text>
          <View
            style={[
              styles.led,
              {
                backgroundColor: connected
                  ? doorState === "closed"
                    ? "green"
                    : "red"
                  : "#E0D500",
              },
            ]}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.connectBtn}
        onPress={() => navigation.navigate("WifiScan")}
      >
        {connected ? <WifiConnectedIcon /> : <WifiIcon />}
      </TouchableOpacity>

      <View style={styles.statusContainer}>
        <Text
          style={[styles.statusText, { color: connected ? "green" : "red" }]}
        >
          {connected ? "Connected" : "Not Connected"}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BatteryIcon />
          <Text style={styles.batteryPercent}>{batteryPercentage} %</Text>
        </View>
      </View>
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
    bottom: RFValue(50),
    flex: 1,
  },
  outerCircle: {
    alignItems: "center",
    shadowOffset: {
      width: 5,
      height: 15,
    },
    shadowOpacity: 0.9,
    shadowColor: "#000",
    shadowRadius: 10,
    elevation: 20,
    // borderWidth: 1,
    borderRadius: 110,
    width: 280,
    height: 280,
    backgroundColor: "#fff",
  },
  led: {
    top: RFValue(10),
    width: RFValue(35),
    height: RFValue(10),
    borderRadius: RFValue(5),
  },
  head: {
    marginTop: 70,
    textAlign: "center",
    fontSize: RFValue(30),
    fontFamily: "Poppins-SemiBold",
    height: RFValue(40),
    color: "#fff",
  },
  subhead: {
    textAlign: "center",
    fontSize: RFValue(14),
    fontFamily: "Poppins-Reg",
    marginLeft: RFValue(20),
    marginRight: RFValue(20),
    color: "#fff",
  },
  connectBtn: {
    borderRadius: 50,
    backgroundColor: "#fff",
    width: RFValue(50),
    height: RFValue(50),
    alignItems: "center",
    justifyContent: "center",
    bottom: RFValue(100),
    shadowOffset: {
      width: 5,
      height: 15,
    },
    shadowOpacity: 0.9,
    shadowColor: "#000",
    shadowRadius: 10,
    elevation: 20,
  },
  btnText: {
    fontSize: RFValue(32),
    fontFamily: "Poppins-Bold",
  },
  statusContainer: {
    backgroundColor: "#fff",
    width: RFValue(300),
    height: RFValue(80),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(20),
    bottom: RFValue(50),
  },
  statusText: {
    fontFamily: "Poppins-Bold",
    fontSize: RFValue(18),
  },
  batteryPercent: {
    fontFamily: "Poppins-SemiBold",
    left: RFValue(5),
  },
});
