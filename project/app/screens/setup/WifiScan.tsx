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
import * as Location from "expo-location";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import RedirectBox from "../../common/RedirectBox";
import * as IntentLauncher from "expo-intent-launcher";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WifiScan = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [networks, setNetworks] = useState<WifiEntry[]>([]);
  const [locationPermission, setLocationPermission] = useState(false);
  const [connectedToDoorLock, setConnectedToDoorLock] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWifi, setSelectedWifi] = useState("");
  const [loading, setLoading] = useState(false);
  const [credentialsSent, setCredentialsSent] = useState(false);
  const [esp32IpAddress, setEsp32IpAddress] = useState<string | null>(null);

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

  const handleConnect = async (password: string) => {
    try {
      setLoading(true);
      const response = await fetch("http://192.168.4.1/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          ssid: selectedWifi,
          password: password,
        }).toString(),
      });
      const responseText = await response.text();
      console.log(response);
      if (response.ok) {
        const ipAddress = responseText.split("IP: ")[1];
        const ssid = selectedWifi;
        await AsyncStorage.setItem("esp32IpAddress", ipAddress);
        await AsyncStorage.setItem("homeWifiSSID", ssid);
        setEsp32IpAddress(ipAddress);
        Alert.alert("Success", "Wi-Fi credentials sent to ESP32.");
        setCredentialsSent(true);
      } else {
        Alert.alert("Error", "Failed to send Wi-Fi credentials to ESP32.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to send Wi-Fi credentials to ESP32.");
      console.error("Error sending Wi-Fi credentials to ESP32:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectToHomeWifi = async () => {
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.WIFI_SETTINGS
    );
    const currentSSID = await WifiManager.getCurrentWifiSSID();
    if (currentSSID === selectedWifi) {
      Alert.alert("Connected", "Successfully connected to Home Wi-Fi.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home", { connected: true }),
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
      <Text style={styles.head}>Setup DoorLock</Text>
      {!connectedToDoorLock && (
        <RedirectBox
          title="Please Connect to DoorLock Wifi Hotspot"
          ssid="DoorLock"
          BtnTitle="Connect"
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
