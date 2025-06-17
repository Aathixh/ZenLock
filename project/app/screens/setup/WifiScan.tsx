import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import WifiManager, { WifiEntry } from "react-native-wifi-reborn";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import RedirectBox from "../../common/redirectBox";
import * as IntentLauncher from "expo-intent-launcher";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../../common/ToastMessage";

const WifiScan = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [networks, setNetworks] = useState<WifiEntry[]>([]);

  const [connectedToDoorLock, setConnectedToDoorLock] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWifi, setSelectedWifi] = useState("");
  const [loading, setLoading] = useState(false);
  const [credentialsSent, setCredentialsSent] = useState(false);
  const [esp32IpAddress, setEsp32IpAddress] = useState<string | null>(null);
  const [adminRegistered, setAdminRegistered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    scanWifiNetworks();
    const checkAdminStatus = async () => {
      const adminStatus = await AsyncStorage.getItem("isAdmin");
      setIsAdmin(adminStatus === "true");
    };

    if (!isAdmin) {
      checkAdminStatus();
    }
  }, []);

  const scanWifiNetworks = async () => {
    try {
      const wifiList = await WifiManager.loadWifiList();
      setNetworks(wifiList);
    } catch (error: any) {
      // Alert.alert(error?.name, error?.message);
      showToast.error(`${error?.name}: ${error?.message}`);
      console.error("Error scanning Wi-Fi networks:", error);
    }
  };

  const openWifiSettings = async () => {
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.WIFI_SETTINGS
    );
    verifyConnection();
  };

  const verifyConnection = async () => {
    try {
      const currentSSID = await WifiManager.getCurrentWifiSSID();
      if (currentSSID === "DoorLock") {
        setConnectedToDoorLock(true);
        // Alert.alert("Connected", "Successfully connected to DoorLock Wi-Fi.");
        showToast.success("Connected to DoorLock Wi-Fi");
      } else {
        // Alert.alert("Not Connected", "Please connect to DoorLock Wi-Fi.");
        showToast.error("Please connect to DoorLock Wi-Fi");
      }
    } catch (error) {
      // Alert.alert("Error", "Unable to verify Wi-Fi connection.");
      showToast.error("Unable to verify Wi-Fi connection");
      console.error("Error verifying Wi-Fi connection:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await scanWifiNetworks();
    setRefreshing(false);
  };

  const handleConnect = async (password: string) => {
    try {
      setLoading(true);
      const GlobalUserID = await AsyncStorage.getItem("UserID");
      const response = await fetch("http://192.168.4.1/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          ssid: selectedWifi,
          password: password,
          UID: GlobalUserID as string,
        }).toString(),
      });
      // const responseText = await response.text();
      // console.log(response);
      if (response.ok) {
        // const ipAddress = responseText.split("IP: ")[1];
        const ssid = selectedWifi;
        await AsyncStorage.setItem("esp32IpAddress", "zenlock.local");
        await AsyncStorage.setItem("WifiSSID", ssid);
        // setEsp32IpAddress(ipAddress);
        // Alert.alert("Success", "Wi-Fi credentials sent to ESP32.");
        showToast.success("Wi-Fi credentials sent to ESP32");
        setCredentialsSent(true);
      } else {
        // Alert.alert("Error", "Failed to send Wi-Fi credentials to ESP32.");
        showToast.error("Failed to send Wi-Fi credentials to ESP32");
      }
    } catch (error) {
      // Alert.alert("Error", "Unable to send Wi-Fi credentials to ESP32.");
      showToast.error("Unable to send Wi-Fi credentials to ESP32");
      console.error("Error sending Wi-Fi credentials to ESP32:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectToHomeWifi = async () => {
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.WIFI_SETTINGS
    );
    setLoading(true);
    const currentSSID = await WifiManager.getCurrentWifiSSID();
    if (currentSSID === selectedWifi) {
      // let ipAddress: string | null = null;
      // while (ipAddress === null || ipAddress === "192.168.4.1") {
      //   ipAddress = (await discoverESP32()) as string;
      //   setEsp32IpAddress(ipAddress);
      // }
      Alert.alert("Connected", "Successfully connected to Home Wi-Fi.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    }
    setLoading(false);
  };

  const handleContinueWithHotspot = async () => {
    const currentSSID = await WifiManager.getCurrentWifiSSID();
    if (currentSSID === "DoorLock") {
      await AsyncStorage.setItem("WifiSSID", currentSSID);
      await AsyncStorage.setItem("esp32IpAddress", "192.168.4.1");
      navigation.navigate("Home");
    } else {
      // Alert.alert("Error", "Please connect to DoorLock Wi-Fi.");
      showToast.error("Please connect to DoorLock Wi-Fi");
    }
  };

  const handleAdminRegistration = async (name: string, ID: string) => {
    if (!name) {
      // Alert.alert("Error", "Please enter your name.");
      showToast.warning("Please enter your name");
      return;
    }
    try {
      setLoading(true);
      const adminID = ID;
      console.log("Generated Admin ID:", adminID);
      const response = await fetch("http://192.168.4.1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          id: adminID,
          name: name,
          isAdmin: "true",
        }).toString(),
      });
      const responseText = await response.text();
      console.log(responseText);

      if (response.ok) {
        setAdminRegistered(true);
        setLoading(false);
        await AsyncStorage.setItem("isAdmin", "true");
        await AsyncStorage.setItem("UserID", adminID);
        await AsyncStorage.setItem("adminName", name);
        // Alert.alert("Success", "Admin registered successfully.");
        showToast.success("Admin registered successfully");
      } else {
        setLoading(false);
        setAdminRegistered(false);
        // Alert.alert("Error", "Failed to register admin.");
        showToast.error(responseText || "Failed to register admin");
      }
    } catch (error) {
      setLoading(false);
      setAdminRegistered(false);
      // Alert.alert("Error", "Unable to register admin.");
      showToast.error("Unable to register admin");
      console.error("Error registering admin:", error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3E5C76", "#74ACDC"]}
        style={styles.background}
      />
      <Text style={styles.head}>Setup ZenLock</Text>
      {!connectedToDoorLock && (
        <RedirectBox
          title="Please Connect to DoorLock Hotspot"
          ssid="DoorLock"
          BtnTitle="Connect"
          inputfield={false}
          connectFn={openWifiSettings}
          cancelBtn={false}
        />
      )}
      {!isAdmin && connectedToDoorLock && !adminRegistered && (
        <RedirectBox
          title="Admin Registration"
          subTitle="Enter your name"
          BtnTitle="Register"
          inputfield={true}
          inputfierldTitle="Name"
          OptionalInput={true}
          connectFn={handleAdminRegistration}
          loading={loading} // set after adding function
          cancelBtn={false}
        />
      )}

      <View>
        <Text style={styles.subHead}>Send Your Wifi Details</Text>
        <FlatList
          data={networks}
          keyExtractor={(item) => item.SSID}
          style={styles.wifiList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => setSelectedWifi(item.SSID)}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Med",
                  fontSize: RFValue(14),
                  textAlign: "center",
                }}
              >
                {item.SSID}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinueWithHotspot}
        >
          <Text style={styles.continueText}>Continue with Hotspot</Text>
        </TouchableOpacity>
      </View>

      {selectedWifi && !credentialsSent && (
        <RedirectBox
          title="Enter Wifi Password"
          ssid={selectedWifi}
          connectFn={handleConnect}
          BtnTitle="Send"
          inputfield={true}
          cancelBtn={true}
          cancelFn={() => setSelectedWifi("")}
          loading={loading}
          loadingText="Sending Credentials..."
        />
      )}

      {credentialsSent && (
        <RedirectBox
          title="Please Connect to Home Wifi"
          ssid={selectedWifi}
          BtnTitle="Connect"
          inputfield={false}
          connectFn={connectToHomeWifi}
          cancelBtn={false}
          loading={loading}
          loadingText="Connecting..."
        />
      )}
    </View>
  );
};

export default WifiScan;

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
    fontSize: RFValue(25),
    fontFamily: "Poppins-Bold",
    marginTop: RFPercentage(8),
    color: "#fff",
  },
  subHead: {
    fontSize: RFValue(16),
    fontFamily: "Poppins-Reg",
    top: RFPercentage(2),
    color: "#fff",
    textAlign: "center",
  },
  wifiList: {
    marginTop: RFPercentage(2),
    maxHeight: RFPercentage(65),
    backgroundColor: "rgba(255, 255, 255, 0.27)",
    borderRadius: RFValue(10),
  },
  listItem: {
    backgroundColor: "#fff",
    padding: RFValue(10),
    margin: RFValue(5),
    borderRadius: RFValue(5),
    width: RFValue(300),
  },
  input: {
    width: RFValue(300),
    height: RFValue(50),
    backgroundColor: "#fff",
    borderRadius: RFValue(10),
    padding: RFValue(10),
    marginTop: RFPercentage(2),
  },
  continueBtn: {
    borderRadius: 15,
    backgroundColor: "#fff",
    width: RFValue(180),
    height: RFValue(50),
    alignItems: "center",
    justifyContent: "center",
    top: RFValue(50),
    shadowOffset: {
      width: 5,
      height: 15,
    },
    shadowOpacity: 0.9,
    shadowColor: "#000",
    shadowRadius: 10,
    elevation: 20,
  },
  continueText: {
    fontFamily: "Poppins-Med",
    fontSize: RFValue(14),
    textAlign: "center",
    color: "green",
  },
});
