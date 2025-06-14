import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const UserManagementScreen = () => {
  return (
    <View>
      <Text>UserManagementScreen</Text>
    </View>
  );
};

export default UserManagementScreen;

const styles = StyleSheet.create({});
