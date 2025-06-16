import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import LottieView from "lottie-react-native";
import Slider from "../common/Slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import WifiManager from "react-native-wifi-reborn";

const { width, height } = Dimensions.get("window");

const RequestAccess = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [generatedId, setGeneratedId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const generatedIdRef = useRef("");

  const sendRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch("http://zenlock.local/requestAccess", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          id: requestId,
        }).toString(),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `ESP32 returned status ${response.status}: ${errorText}`
        );
      }

      if (response.status === 200) {
        Alert.alert("Success", "Access Granted", [
          {
            text: "OK",
            onPress: async () => {
              setIsLoading(false);
              setGeneratedId("");
              generatedIdRef.current = "";
              await AsyncStorage.setItem("esp32IpAddress", "zenlock.local");
              await AsyncStorage.setItem("isAdmin", "false");
              const currentSSID = await WifiManager.getCurrentWifiSSID();
              await AsyncStorage.setItem("WifiSSID", currentSSID);
              console.log("Access granted, navigating to next screen");
              navigation.navigate("Home");
            },
          },
        ]);
        console.log("Request sent successfully");
      }
    } catch (error) {
      console.error("Error in sendRequest:", error);
      setIsLoading(false);
      Alert.alert("Error", "Failed to send request. Please try again.", [
        {
          text: "OK",
          onPress: () => {
            console.log("Error alert closed");
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3E5C76", "#74ACDC"]}
        style={styles.background}
      />
      <Text style={styles.head}>Request Access</Text>
      <LottieView
        style={{
          width: RFValue(150),
          height: RFValue(150),
          marginTop: RFValue(30),
          marginBottom: RFValue(30),
        }}
        resizeMode="contain"
        source={require("../../assets/verifyLock.json")}
        autoPlay
        loop
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Generated ID"
        onChangeText={(text) => {
          console.log("Input changed to:", text);
          setGeneratedId(text);
          generatedIdRef.current = text;
        }}
        keyboardType="numeric"
      />
      <Slider onComplete={() => sendRequest(generatedIdRef.current)} />
    </View>
  );
};

export default RequestAccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
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
    marginBottom: RFValue(20),
  },
});
