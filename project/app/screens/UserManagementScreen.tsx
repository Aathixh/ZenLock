import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "../common/Slider";
import Copy from "../../assets/Copy";
import * as Clipboard from "expo-clipboard";

const { width, height } = Dimensions.get("window");

const UserManagementScreen = () => {
  const [generatedId, setGeneratedId] = useState("");
  setGeneratedId("some-generated-id");
  const copyToClipboard = async () => {
    if (generatedId) {
      await Clipboard.setStringAsync(generatedId);
      Alert.alert("Copied to clipboard");
    }
  };

  const generateID = () => {
    // Combine timestamp and random for better uniqueness
    const timestamp = Date.now() % 1000; // Last 3 digits of timestamp
    const random = Math.floor(Math.random() * 1000); // Random 3 digits

    const id = timestamp * 1000 + random;
    return id.toString().padStart(6, "0");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3E5C76", "#74ACDC"]}
        style={styles.background}
      />
      <Text style={styles.head}>Add User</Text>
      <TextInput style={styles.input} placeholder="Enter User Name" />

      <Slider onComplete={() => Alert.alert("User added successfully")} />

      <View style={styles.idDisplayContainer}>
        <Text
          style={[
            styles.idDisplayText,
            { color: generatedId ? "#000" : "#999" },
          ]}
        >
          {generatedId || "User ID will appear here"}
        </Text>
        <TouchableOpacity onPress={copyToClipboard}>
          <Copy />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserManagementScreen;

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
  head: {
    marginTop: height * 0.1,
    textAlign: "center",
    fontSize: RFValue(30),
    fontFamily: "Poppins-SemiBold",
    height: RFValue(40),
    marginBottom: RFValue(3),
    color: "#fff",
  },
  input: {
    width: width * 0.8,
    height: RFValue(50),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: RFValue(10),
    paddingHorizontal: RFValue(10),
    marginTop: RFValue(20),
    backgroundColor: "#fff",
  },
  idDisplayContainer: {
    width: width * 0.8,
    height: RFValue(50),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: RFValue(10),
    // paddingHorizontal: RFValue(10),
    marginTop: RFValue(50),
    backgroundColor: "#f8f9ff",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: RFValue(20),
    paddingLeft: RFValue(10),
  },
  idDisplayText: {
    fontSize: RFValue(14),
    fontFamily: "Poppins-Reg",
  },
});
