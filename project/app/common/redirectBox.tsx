import { View, Text, Button, StyleSheet } from "react-native";
import React from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

interface RedirectBoxProps {
  ssid: string;
}
const RedirectBox: React.FC<RedirectBoxProps> = ({ ssid }) => {
  return (
    <View style={styles.popUpContainer}>
      <Text style={styles.popupHead}>
        Please Connect to DoorLock Wifi Hotspot
      </Text>
      <Text style={styles.popupText}>SSID: {ssid}</Text>
      <Button title="Connect" onPress={() => {}} />
    </View>
  );
};

export default RedirectBox;

const styles = StyleSheet.create({
  popUpContainer: {
    backgroundColor: "#fff",
    padding: RFValue(20),
    borderRadius: RFValue(10),
    width: RFValue(300),
    height: RFValue(200),
    alignItems: "center",
    elevation: RFValue(10),
    alignSelf: "center",
    justifyContent: "center",
    top: RFPercentage(25),
  },
  popupHead: {
    fontSize: RFValue(18),
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  popupText: {
    fontSize: RFValue(15),
    fontFamily: "Poppins-Med",
    margin: RFValue(20),
  },
});
