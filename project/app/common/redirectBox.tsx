import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { BlurView } from "@react-native-community/blur";
import { TextInput } from "react-native-gesture-handler";

interface RedirectBoxProps {
  title: string;
  ssid: string;
  connectFn: (password: string) => void;
  inputfield: boolean;
  BtnTitle: string;
  cancelBtn: boolean;
  cancelFn?: () => void;
  loading?: boolean;
  loadingText?: string;
}
const RedirectBox: React.FC<RedirectBoxProps> = ({
  title,
  ssid,
  connectFn,
  inputfield,
  BtnTitle,
  cancelBtn,
  cancelFn,
  loading,
  loadingText,
}) => {
  const [password, setPassword] = useState("");
  return (
    <>
      <BlurView
        style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}
        blurType="dark"
        blurAmount={5}
      />
      <View style={styles.popUpContainer}>
        <Text style={styles.popupHead}>{title}</Text>
        <Text style={styles.popupText}>SSID: {ssid}</Text>

        {inputfield && (
          <TextInput
            placeholder="Enter Password"
            style={styles.input}
            onChangeText={setPassword}
          />
        )}
        {!loading ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: RFValue(200),
            }}
          >
            <Button title={BtnTitle} onPress={() => connectFn(password)} />
            {cancelBtn && (
              <Button title="Cancel" onPress={cancelFn} color={"red"} />
            )}
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
            <Text style={styles.loadingText}>{loadingText}</Text>
          </View>
        )}
      </View>
    </>
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
    top: RFPercentage(40),
    zIndex: 2,
    position: "absolute",
  },
  popupHead: {
    fontSize: RFValue(18),
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    bottom: RFValue(10),
  },
  popupText: {
    fontSize: RFValue(15),
    fontFamily: "Poppins-Med",
    margin: RFValue(10),
    bottom: RFValue(10),
  },
  input: {
    width: RFValue(250),
    height: RFValue(40),
    borderWidth: 1,
    borderRadius: RFValue(5),
    bottom: RFValue(12),
    padding: RFValue(5),
  },
  loadingContainer: {
    alignItems: "center",
    height: RFValue(30),
  },
  loadingText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins-Reg",
    color: "#000",
  },
});
