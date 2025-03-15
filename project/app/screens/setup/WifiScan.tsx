import {
  Alert,
  Button,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import WifiManager, { WifiEntry } from "react-native-wifi-reborn";
import * as Location from "expo-location";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import RedirectBox from "../../common/redirectBox";

const WifiScan = () => {
  const [networks, setNetworks] = useState<WifiEntry[]>([]);
  const [locationPermission, setLocationPermission] = useState(false);
  const [connectedToDoorLock, setConnectedToDoorLock] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3E5C76", "#74ACDC"]}
        style={styles.background}
      />
      <Text style={styles.head}>Setup DoorLock</Text>
      {!connectedToDoorLock && <RedirectBox ssid="DoorLock" />}
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
});
