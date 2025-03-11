import {
  Alert,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import WifiManager, { WifiEntry } from "react-native-wifi-reborn";
import {
  check,
  PERMISSIONS,
  request,
  RESULTS,
  openSettings,
} from "react-native-permissions";

const WifiScan = () => {
  const [networks, setNetworks] = useState<WifiEntry[]>([]);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
        if (
          granted["android.permission.ACCESS_FINE_LOCATION"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted["android.permission.ACCESS_COARSE_LOCATION"] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          loadNetworks();
        } else {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to scan for Wi-Fi networks."
          );
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const loadNetworks = async () => {
      try {
        const wifiList = await WifiManager.loadWifiList();
        console.log(wifiList);
        setNetworks(wifiList);
      } catch (error) {
        Alert.alert(
          "Error",
          "Unable to load Wi-Fi networks.\nCheck whether Location is enabled on your device."
        );
        console.error("Error loading Wi-Fi networks:", error);
      }
    };

    requestPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <Text>WifiScan</Text>

      <FlatList
        data={networks}
        keyExtractor={(item) => item.BSSID}
        renderItem={({ item }) => <Text>{item.SSID}</Text>}
      />
    </View>
  );
};

export default WifiScan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
