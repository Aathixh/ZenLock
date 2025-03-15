import {
  Alert,
  Button,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import WifiManager, { WifiEntry } from "react-native-wifi-reborn";
import * as Location from "expo-location";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import RedirectBox from "../../common/RedirectBox";
import * as IntentLauncher from "expo-intent-launcher";

const WifiScan = () => {
  const [networks, setNetworks] = useState<WifiEntry[]>([]);
  const [locationPermission, setLocationPermission] = useState(false);
  const [connectedToDoorLock, setConnectedToDoorLock] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWifi, setSelectedWifi] = useState("");

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermission(true);
        scanWifiNetworks();
      } else {
        Alert.alert("Permission Denied", "Location permission is required.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to request location permission.");
      console.error("Error requesting location permission:", error);
    }
  };

  const scanWifiNetworks = async () => {
    try {
      const wifiList = await WifiManager.loadWifiList();
      setNetworks(wifiList);
    } catch (error: any) {
      Alert.alert(error?.name, error?.message);
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
        Alert.alert("Connected", "Successfully connected to DoorLock Wi-Fi.");
      } else {
        Alert.alert("Not Connected", "Please connect to DoorLock Wi-Fi.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to verify Wi-Fi connection.");
      console.error("Error verifying Wi-Fi connection:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await scanWifiNetworks();
    setRefreshing(false);
  };

  const handleConnect = (password: string) => {
    // Send the password to the ESP32
    console.log(`Connecting to ${selectedWifi} with password ${password}`);
    // Add your logic to send the password to the ESP32 here
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3E5C76", "#74ACDC"]}
        style={styles.background}
      />
      <Text style={styles.head}>Setup DoorLock</Text>
      {connectedToDoorLock && (
        <RedirectBox
          title="Please Connect to DoorLock Wifi Hotspot"
          ssid="DoorLock"
          inputfield={false}
          connectFn={openWifiSettings}
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

      {selectedWifi && (
        <RedirectBox
          title="Enter Wifi Password"
          ssid={selectedWifi}
          connectFn={handleConnect}
          inputfield={true}
          cancelBtn={true}
          cancelFn={() => setSelectedWifi("")}
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
    maxHeight: RFPercentage(35),
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
});
