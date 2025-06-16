import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  BaseToast,
  ErrorToast,
  InfoToast,
  ToastConfig as RNToastConfig,
  ToastConfigParams,
} from "react-native-toast-message";
import { RFValue } from "react-native-responsive-fontsize";
import Cancel from "../../assets/Cancel";

export const toastConfig: RNToastConfig = {
  success: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#2ECC71", borderRadius: 8 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: RFValue(15),
        fontFamily: "Poppins-Med",
      }}
      text2Style={{
        fontSize: RFValue(13),
        fontFamily: "Poppins-Reg",
      }}
    />
  ),
  error: (props: ToastConfigParams<any>) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#E74C3C", borderRadius: 8 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: RFValue(15),
        fontFamily: "Poppins-Med",
      }}
      text2Style={{
        fontSize: RFValue(13),
        fontFamily: "Poppins-Reg",
      }}
    />
  ),
  info: (props: ToastConfigParams<any>) => (
    <InfoToast
      {...props}
      style={{ borderLeftColor: "#3498DB", borderRadius: 8 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: RFValue(15),
        fontFamily: "Poppins-Med",
      }}
      text2Style={{
        fontSize: RFValue(13),
        fontFamily: "Poppins-Reg",
      }}
    />
  ),
  warning: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#F39C12", borderRadius: 8 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: RFValue(15),
        fontFamily: "Poppins-Med",
      }}
      text2Style={{
        fontSize: RFValue(13),
        fontFamily: "Poppins-Reg",
      }}
    />
  ),
};
