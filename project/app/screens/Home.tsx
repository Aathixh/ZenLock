import {
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import Lock from "../../assets/Lock";
import PadLock from "../../assets/PadLock";
import WifiIcon from "../../assets/WifiIcon";
import WifiConnectedIcon from "../../assets/WifiConnectedIcon";
import BatteryIcon from "../../assets/BatteryIcon";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList } from "../types";
import WifiManager from "react-native-wifi-reborn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import LottieView from "lottie-react-native";
import * as Location from "expo-location";
import { showToast } from "../common/ToastMessage";

const { width, height } = Dimensions.get("window");

const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [doorState, setDoorState] = useState("closed");
  const [connected, setConnected] = useState(false);
  const [batteryPercentage, setBatteryPercentage] = useState("");
  const [esp32IpAddress, setEsp32IpAddress] = useState<string | null>(null);
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);
  const resetAnim = useRef(new Animated.Value(0)).current;
  const wifiAnim = useRef(new Animated.Value(0)).current;
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [motorDelay, setMotorDelay] = useState("");
  const [lockDelay, setLockDelay] = useState("");
  const [locationPermission, setLocationPermission] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [GlobalUserID, setGlobalUserID] = useState("");

  useEffect(() => {
    const initialize = async () => {
      await requestLocationPermission();
      await checkStoredIpAddress();
      await verifyAdminStatus();
      // await checkStoredDoorState();
    };
    initialize();

    const intervalId = setInterval(async () => {
      if (esp32IpAddress) {
        await verifyHomeWifiConnection(esp32IpAddress);
      }
      // await checkStoredDoorState();
      // await fetchBatteryPercentage();
    }, 30000); // Check every 30 seconds
  }, [esp32IpAddress]);

  // useEffect(() => {
  //   // This effect runs when esp32IpAddress state is set/changed, or when 'connected' changes
  //   if (esp32IpAddress && connected) {
  //     fetchBatteryPercentage(); // Fetch initial battery percentage

  //     const intervalId = setInterval(() => {
  //       verifyHomeWifiConnection(esp32IpAddress); // Re-verify connection
  //       if (connected) {
  //         // Only fetch if still connected
  //         checkStoredDoorState(); // Not dependent on IP but good to keep in sync
  //         fetchBatteryPercentage();
  //       }
  //     }, 30000); // Check every 30 seconds
  //     return () => clearInterval(intervalId);
  //   }
  // }, [esp32IpAddress, connected]);

  const verifyAdminStatus = async () => {
    const Admin = await AsyncStorage.getItem("isAdmin");
    const UserID = await AsyncStorage.getItem("UserID");
    setGlobalUserID(UserID || "");
    console.log(`GlobalUserID: ${UserID}`);
    setIsAdmin(Admin === "true");
    console.log(`Admin status: ${Admin}`);
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermission(true);
      } else {
        Alert.alert("Permission Denied", "Location permission is required.");
      }
    } catch (error) {
      // Alert.alert("Error", "Unable to request location permission.");
      showToast.error("Unable to request location permission.");
      console.error("Error requesting location permission:", error);
    }
  };

  useEffect(() => {
    if (!connected) {
      resetConnectButton();
    }
  }, [connected]);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        setShowExitAlert(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  // const fetchBatteryPercentage = async () => {
  // };
  //   console.log(`Fetching battery percentage for IP: ${esp32IpAddress}`);
  //   if (!esp32IpAddress || connected) return;
  //   const url = `http://${esp32IpAddress}/battery`;
  //   try {
  //     const response = await fetch(url);
  //     if (response.ok) {
  //       const data = await response.json();
  //       const voltage = data.battery;

  //       // Define voltage range
  //       const minVoltage = 3.7;
  //       const maxVoltage = 4.2;

  //       // Calculate battery percentage
  //       let batteryPercentage;
  //       if (voltage <= minVoltage) {
  //         batteryPercentage = 0; // Battery is 0% if voltage is below 3.3V
  //       } else if (voltage >= maxVoltage) {
  //         batteryPercentage = 100; // Battery is 100% if voltage is above 4.02V
  //       } else {
  //         batteryPercentage =
  //           ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100;
  //       }

  //       setBatteryPercentage(Math.round(batteryPercentage).toString()); // Set battery percentage as integer
  //     }
  //   } catch (error) {
  //     // Alert.alert("Error", "Unable to fetch battery percentage.");
  //     console.error("Error fetching battery percentage:", error);
  //     setBatteryPercentage("");
  //   }

  const checkStoredDoorState = async () => {
    // const storedDoorState = await AsyncStorage.getItem("door_state");
    // if (storedDoorState) {
    //   setDoorState(storedDoorState);
    // }
    console.log(`Checking stored door state for IP: ${esp32IpAddress}`);
    if (!esp32IpAddress || !connected) return; //
    const url = `http://${esp32IpAddress}/doorState`;
    try {
      // console.log(`Checking door state at ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 10 seconds timeout
      const response = await fetch(url, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        console.log("Door state response:", data);
        const state = data.state;
        console.log(`Door state fetched: ${state}`);
        setDoorState(state);
        await AsyncStorage.setItem("doorState", state);
      }
    } catch (error) {
      console.error("Error fetching door state:", error);
      // Alert.alert("Error", "Unable to fetch door state.");
    }
  };

  const checkStoredIpAddress = async () => {
    const storedIpAddress = await AsyncStorage.getItem("esp32IpAddress");
    console.log("Stored IP Address/Hostname:", storedIpAddress);
    if (storedIpAddress) {
      setEsp32IpAddress(storedIpAddress);
      verifyHomeWifiConnection(storedIpAddress);
    } else {
      console.log("ESP32 IP address not found in storage");
    }
  };

  const verifyHomeWifiConnection = useCallback(
    async (addressToPing: string) => {
      console.log(`Verifying Home Wi-Fi connection for IP: ${addressToPing}`);
      try {
        const currentSSID = await WifiManager.getCurrentWifiSSID();
        const storedSSID = await AsyncStorage.getItem("WifiSSID");
        const currentUserID = await AsyncStorage.getItem("UserID");
        console.log(`Current SSID: ${currentSSID}, Stored SSID: ${storedSSID}`);
        console.log(`Pinging address: ${addressToPing}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 65000); // 65 seconds timeout
        console.log(
          `Full URL: http://${addressToPing}/ping?UID=${currentUserID}`
        );
        const response = await fetch(
          `http://${addressToPing}/ping?UID=${currentUserID}`,
          {
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);
        console.log(`Ping response for ${addressToPing}:`, response);

        if (response.ok) {
          const pingData = await response.json();
          console.log("Ping data received:", pingData);

          // Update door state from ping response
          if (pingData.state) {
            setDoorState(pingData.state);
            await AsyncStorage.setItem("doorState", pingData.state);
            console.log(`Door state updated: ${pingData.state}`);
          }

          // Calculate and update battery percentage from ping response
          if (pingData.battery) {
            const voltage = parseFloat(pingData.battery);
            // Define voltage range
            const minVoltage = 3.7;
            const maxVoltage = 4.2;

            // Calculate battery percentage
            let batteryPercentage;
            if (voltage <= minVoltage) {
              batteryPercentage = 0; // Battery is 0% if voltage is below min
            } else if (voltage >= maxVoltage) {
              batteryPercentage = 100; // Battery is 100% if voltage is above max
            } else {
              batteryPercentage =
                ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100;
            }

            setBatteryPercentage(Math.round(batteryPercentage).toString());
            console.log(`Battery updated: ${Math.round(batteryPercentage)}%`);
          }

          // Always set connected to true if we got a successful response
          // setConnected(true);

          if (addressToPing === "zenlock.local" && currentSSID === storedSSID) {
            setConnected(true);
            console.log("Home Wi-Fi connection verified via zenlock.local.");
          } else if (
            addressToPing === "192.168.4.1" &&
            currentSSID === "DoorLock"
          ) {
            // Assuming "DoorLock" is AP SSID
            setConnected(true);
            console.log("ESP32 AP connection verified via 192.168.4.1.");
          } else {
            setConnected(false);
            console.log(
              `Connection check failed: address=${addressToPing}, currentSSID=${currentSSID}, storedSSID=${storedSSID}`
            );
          }
        } else {
          setConnected(false);
        }
      } catch (error: any) {
        setConnected(false);
        console.error(
          `Error verifying Home Wi-Fi connection to ${addressToPing}:`,
          error
        );
      }
    },
    []
  );

  const toggleDoorLock = async () => {
    const url = `http://${esp32IpAddress}/${
      doorState === "closed" ? "open" : "close"
    }`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout
    try {
      console.log("Toggling door lock...");
      setLoading(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          UID: GlobalUserID,
        }).toString(),
        signal: controller.signal,
      });
      console.log("Door lock response:", response);
      // if (response.ok) {
      //   // const newDoorState = doorState === "closed" ? "open" : "closed";
      //   // setDoorState(newDoorState);
      //   //await AsyncStorage.setItem("door_state", newDoorState);
      // }
      checkStoredDoorState(); // Fetch the updated door state
    } catch (error: any) {
      if (error.name === "AbortError") {
        // Alert.alert("Error", "Request timed out. Unable to toggle door lock.");
      } else {
        // Alert.alert("Error", "Unable to toggle door lock.");
        showToast.error("Unable to toggle door lock.");
      }
      console.error("Error toggling door lock:", error);
    } finally {
      clearTimeout(timeoutId);
      checkStoredDoorState();
      setLoading(false);
    }
  };

  const handleExitApp = () => {
    setShowExitAlert(false);
    BackHandler.exitApp();
  };

  const handleCancelExit = () => {
    setShowExitAlert(false);
  };

  const resetESP32 = async () => {
    if (!esp32IpAddress) return;
    const currentID = await AsyncStorage.getItem("UserID");
    const pingUrl = `http://${esp32IpAddress}/ping?UID=${currentID}`;
    const resetUrl = `http://${esp32IpAddress}/reset?UID=${GlobalUserID}`;

    try {
      setLoading(true);

      // Ping the ESP32 to check the connection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
      const pingResponse = await fetch(pingUrl, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!pingResponse.ok) {
        // Alert.alert("Error", "ESP32 is not connected.");
        showToast.error("ESP32 is not connected.");
        return;
      }

      // Send the reset command with a timeout

      const resetResponse = await fetch(resetUrl, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (resetResponse.ok) {
        const responseText = await resetResponse.text();
        if (responseText === "Successfully Reset") {
          Alert.alert("Success", "ESP32 has been reset.");
          await AsyncStorage.removeItem("esp32IpAddress");
          await AsyncStorage.removeItem("WifiSSID");
          await AsyncStorage.removeItem("users");
          await AsyncStorage.removeItem("isAdmin");
          setConnected(false);
          setBatteryPercentage("");
        }
      } else {
        // Alert.alert("Error", "Failed to reset ESP32.");
        showToast.error("Failed to reset ESP32.");
      }
    } catch (error: any) {
      // Assuming success if there is a network error or timeout
      if (
        error.name === "AbortError" ||
        error.message.includes("Network request failed")
      ) {
        // Alert.alert("Success", "ESP32 has been reset.");
        showToast.success("ESP32 has been reset.");
        console.log("ESP32 has been reset.");
        await AsyncStorage.removeItem("esp32IpAddress");
        await AsyncStorage.removeItem("WifiSSID");
        await AsyncStorage.removeItem("users");
        await AsyncStorage.removeItem("isAdmin");
        setConnected(false);
        setBatteryPercentage("");
      } else {
        // Alert.alert("Error", "Unable to reset ESP32.");
        showToast.error("Unable to reset ESP32.");
        console.error("Error resetting ESP32:", error);
      }
    } finally {
      setLoading(false);
      // Reset the animation values to ensure the Wi-Fi connect button returns to its original position
      resetConnectButton();
    }
  };

  const toggleResetButton = () => {
    if (resetVisible) {
      Animated.parallel([
        Animated.timing(resetAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(wifiAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setResetVisible(false));
    } else {
      setResetVisible(true);
      Animated.parallel([
        Animated.timing(resetAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(wifiAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const resetConnectButton = () => {
    Animated.parallel([
      Animated.timing(resetAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(wifiAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setResetVisible(false));
  };

  const sendCalibrationData = async () => {
    if (!esp32IpAddress) return;
    const url = `http://${esp32IpAddress}/calibrate`;

    if (!motorDelay || !lockDelay) {
      showToast.error("Please enter valid motor and lock delay values.");
      return;
    }
    const data = new URLSearchParams({
      motorDelay: motorDelay,
      lockDelay: lockDelay,
      UID: GlobalUserID,
    }).toString();

    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        showToast.success("Calibration data sent successfully!");
        setIsCalibrating(false);
      } else {
        const errorText = await response.text();
        console.error("Error response:", response.status, errorText);
      }
    } catch (error: any) {
      console.error("Error sending calibration data:", error);
      if (error.name === "AbortError") {
        showToast.error("Request timed out. Please try again.");
      } else {
        showToast.error("Unable to send calibration data.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3E5C76", "#74ACDC"]}
        style={styles.background}
      />
      <Text style={styles.head}>Welcome to ZenLock</Text>
      <Text style={styles.subhead}>
        Your Gateway to a Smarter, Safer and Seamless Home Experience.
      </Text>

      <View style={styles.centerContainer}>
        <TouchableOpacity
          style={styles.outerCircle}
          onPress={toggleDoorLock}
          disabled={!connected || loading}
        >
          {!loading && (
            <View style={{ marginTop: RFValue(50) }}>
              {doorState === "closed" ? <Lock /> : <PadLock />}
            </View>
          )}
          {!loading && (
            <Text style={styles.btnText}>
              {doorState === "closed" ? "Open" : "Close"}
            </Text>
          )}
          {loading && (
            <LottieView
              style={{
                width: RFValue(150),
                height: RFValue(150),
                marginTop: RFValue(50),
              }}
              resizeMode="contain"
              source={require("../../assets/loaderAnim.json")}
              autoPlay
              loop
            />
          )}

          <View
            style={[
              styles.led,
              {
                backgroundColor: connected
                  ? doorState === "closed"
                    ? "green"
                    : "red"
                  : "#E0D500",
              },
            ]}
          />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.connectBtn,
          {
            transform: [
              {
                translateX: wifiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -80],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={
            connected
              ? isAdmin
                ? toggleResetButton
                : () =>
                    // Alert.alert(
                    //   "Access Denied",
                    //   "Only administrators can reset the device."
                    // )
                    showToast.error(
                      "Access Denied\nOnly administrators can reset the device."
                    )
              : () => navigation.navigate("WifiScan")
          }
        >
          {connected ? <WifiConnectedIcon /> : <WifiIcon />}
        </TouchableOpacity>
      </Animated.View>

      {connected && resetVisible && (
        <Animated.View
          style={[
            styles.resetBtn,
            {
              transform: [
                {
                  translateX: resetAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 50],
                  }),
                },
              ],
              opacity: resetAnim,
            },
          ]}
        >
          <TouchableOpacity onPress={resetESP32} disabled={loading}>
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollViewContainer}
        snapToInterval={width * 0.92}
        decelerationRate="fast"
      >
        <View style={styles.statusItem}>
          <Text
            style={[styles.statusText, { color: connected ? "green" : "red" }]}
          >
            {connected ? "Connected" : "Not Connected"}
          </Text>
          {connected && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BatteryIcon />
              <Text style={styles.batteryPercent}>{batteryPercentage} %</Text>
            </View>
          )}
        </View>
        {isAdmin && connected && (
          <View style={styles.statusItem}>
            <TouchableOpacity
              style={{ justifyContent: "center" }}
              onPress={() => {
                navigation.navigate("UserManagement");
              }}
            >
              <Text style={styles.statusText}>User Management</Text>
            </TouchableOpacity>
          </View>
        )}
        {isAdmin && connected && (
          <View style={styles.statusItem}>
            <TouchableOpacity
              style={{ justifyContent: "center" }}
              onPress={() => setIsCalibrating(true)}
            >
              <Text style={styles.statusText}>Calibrate Door</Text>
            </TouchableOpacity>
          </View>
        )}
        {!connected && (
          <View style={styles.statusItem}>
            <TouchableOpacity
              style={{ justifyContent: "center" }}
              onPress={() => {
                navigation.navigate("RequestAccess");
              }}
            >
              <Text style={styles.statusText}>Request Access</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isCalibrating}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCalibrating(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calibrationModal}>
            <Text style={styles.modalTitle}>Calibrate Door</Text>

            <Text style={styles.sliderLabel}>
              Motor Delay: {Number(motorDelay) / 1000} s
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={2000}
              maximumValue={60000}
              step={100}
              // value={Number(motorDelay)}
              onValueChange={(value) => setMotorDelay(value.toString())}
              minimumTrackTintColor="#3E5C76"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#3E5C76"
            />

            {/* Lock Delay Slider */}
            <Text style={styles.sliderLabel}>
              Lock Delay: {Number(lockDelay) / 1000} s
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={100}
              maximumValue={3000}
              step={25}
              // value={Number(lockDelay)}
              onValueChange={(value) => setLockDelay(value.toString())}
              minimumTrackTintColor="#3E5C76"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#3E5C76"
            />

            {loading ? (
              <LottieView
                style={{ width: RFValue(50), height: RFValue(50) }}
                source={require("../../assets/loaderAnim.json")}
                autoPlay
                loop
              />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setIsCalibrating(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={sendCalibrationData}
                >
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showExitAlert}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelExit}
        statusBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Do you want to exit?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCancelExit}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleExitApp}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

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
  centerContainer: {
    bottom: height * 0.13,
    height: height * 0.7,
    flex: 1,
  },
  outerCircle: {
    alignItems: "center",
    top: height * 0.2,
    shadowOffset: {
      width: 5,
      height: 15,
    },
    shadowOpacity: 0.9,
    shadowColor: "#000",
    shadowRadius: 10,
    elevation: 20,
    borderRadius: 110,
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: "#fff",
  },
  led: {
    top: RFValue(210),
    width: RFValue(35),
    height: RFValue(10),
    borderRadius: RFValue(5),
    position: "absolute",
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
  subhead: {
    textAlign: "center",
    fontSize: RFValue(13),
    fontFamily: "Poppins-Reg",
    marginLeft: RFValue(20),
    marginRight: RFValue(20),
    color: "#fff",
    lineHeight: RFValue(15),
  },
  connectBtn: {
    borderRadius: 50,
    backgroundColor: "#fff",
    width: RFValue(50),
    height: RFValue(50),
    alignItems: "center",
    justifyContent: "center",
    bottom: height * 0.13,
    shadowOffset: {
      width: 5,
      height: 15,
    },
    shadowOpacity: 0.9,
    shadowColor: "#000",
    shadowRadius: 10,
    elevation: 20,
    top: RFValue(80),
    zIndex: 2,
  },
  resetBtn: {
    borderRadius: 50,
    backgroundColor: "#fff",
    width: RFValue(150),
    height: RFValue(50),
    alignItems: "center",
    justifyContent: "center",
    bottom: height * 0.25,
    shadowOffset: {
      width: 5,
      height: 15,
    },
    shadowOpacity: 0.9,
    shadowColor: "#000",
    shadowRadius: 10,
    elevation: 20,
    position: "absolute",
    zIndex: 5,
  },
  resetBtnText: {
    fontSize: RFValue(16),
    fontFamily: "Poppins-Bold",
    color: "red",
  },
  btnText: {
    fontSize: RFValue(32),
    fontFamily: "Poppins-Bold",
  },
  statusText: {
    fontFamily: "Poppins-Bold",
    fontSize: RFValue(18),
  },
  batteryPercent: {
    fontFamily: "Poppins-SemiBold",
    left: RFValue(5),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.66)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: RFValue(20),
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: RFValue(16),
    fontFamily: "Poppins-Bold",
    marginBottom: RFValue(10),
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  modalButtonText: {
    fontSize: RFValue(16),
    color: "blue",
    fontFamily: "Poppins-Med",
  },
  statusItem: {
    backgroundColor: "#fff",
    padding: RFValue(10),
    marginHorizontal: RFValue(5),
    borderRadius: RFValue(10),
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowColor: "#000",
    shadowRadius: 5,
    elevation: 5,
    height: height * 0.11,
    width: width * 0.9,
  },
  scrollViewContainer: {
    width: width * 1,
    marginBottom: RFValue(-100),
  },
  scrollViewContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: RFValue(10),
    top: RFValue(-20),
    alignContent: "center",
  },

  calibrationModal: {
    width: "80%",
    backgroundColor: "white",
    padding: RFValue(20),
    borderRadius: 10,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  input: {
    width: "100%",
    height: RFValue(40),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: RFValue(10),
    marginBottom: RFValue(15),
    fontSize: RFValue(14),
  },

  slider: {
    width: "100%",
    height: RFValue(40),
    marginBottom: RFValue(15),
  },

  sliderLabel: {
    fontSize: RFValue(14),
    fontFamily: "Poppins-SemiBold",
    marginBottom: RFValue(5),
    color: "#000",
  },
});
