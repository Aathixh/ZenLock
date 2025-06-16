import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "../common/Slider";
import Copy from "../../assets/Copy";
import * as Clipboard from "expo-clipboard";
import Cancel from "../../assets/Cancel";
import { showToast } from "../common/ToastMessage";

const { width, height } = Dimensions.get("window");

interface User {
  id: string;
  name: string;
}

const getESP32Address = async () => {
  try {
    const storedAddress = await AsyncStorage.getItem("esp32IpAddress");
    console.log("Retrieved ESP32 address:", storedAddress);
    return storedAddress;
  } catch (error) {
    console.error("Error getting ESP32 address:", error);
    return null;
  }
};

const sendUserToESP32 = async (user: User) => {
  try {
    const esp32Address = await getESP32Address();
    if (!esp32Address) {
      // Alert.alert(
      //   "Error",
      //   "ESP32 not connected. Please connect to ESP32 first."
      // );
      showToast.warning("ESP32 not connected. Please connect to ESP32 first.");
      return false;
    }

    console.log(`Sending user to ESP32 at ${esp32Address}:`, user);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`http://${esp32Address}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        id: user.id,
        name: user.name,
      }).toString(),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    console.log("ESP32 registration response:", response.ok);

    if (!response.ok) {
      throw new Error(`ESP32 returned status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Failed to send user to ESP32:", error);
    return false;
  }
};

const deleteUserFromESP32 = async (userId: string) => {
  try {
    const esp32Address = await getESP32Address();
    if (!esp32Address) {
      // Alert.alert(
      //   "Error",
      //   "ESP32 not connected. Please connect to ESP32 first."
      // );
      showToast.warning("ESP32 not connected. Please connect to ESP32 first.");
      return false;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`http://${esp32Address}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        id: userId,
      }).toString(),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ESP32 returned status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Failed to delete user from ESP32:", error);
    return false;
  }
};

const UserManagementScreen = () => {
  const [generatedId, setGeneratedId] = useState("");
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const userNameRef = useRef("");
  const generatedIdRef = useRef("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // If name is empty, clear the ID
    if (!userName.trim()) {
      setGeneratedId("");
      generatedIdRef.current = "";
      return;
    }

    // Set a new timeout
    typingTimeoutRef.current = setTimeout(() => {
      // Generate ID after typing stops for 500ms
      const newId = generateID();
      setGeneratedId(newId);
      generatedIdRef.current = newId; // Store in ref too
      console.log("Generated ID:", newId); // Debug log
    }, 500);

    // Cleanup on unmount or when userName changes again
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [userName]);

  const loadUsers = async () => {
    try {
      const savedUsers = await AsyncStorage.getItem("users");
      console.log("Loading users from storage:", savedUsers);
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        console.log("Parsed users:", parsedUsers);
        setUsers(parsedUsers);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const saveUsers = async (updatedUsers: User[]) => {
    try {
      const usersString = JSON.stringify(updatedUsers);
      console.log("Saving users to storage:", usersString);
      await AsyncStorage.setItem("users", usersString);
    } catch (error) {
      console.error("Failed to save users:", error);
    }
  };

  const copyToClipboard = async () => {
    if (generatedId) {
      await Clipboard.setStringAsync(generatedId);
      // Alert.alert("Copied to clipboard");
      showToast.info("Copied to clipboard");
    }
  };

  const generateID = () => {
    // Combine timestamp and random for better uniqueness
    const timestamp = Date.now() % 1000; // Last 3 digits of timestamp
    const random = Math.floor(Math.random() * 1000); // Random 3 digits

    const id = timestamp * 1000 + random;
    return id.toString().padStart(6, "0");
  };

  const handleAddUser = async () => {
    const currentName = userNameRef.current;
    console.log("Current userName ref value:", currentName);
    console.log("Current generatedId state:", generatedId);
    console.log("Current generatedId ref:", generatedIdRef.current);

    if (!currentName.trim()) {
      // Alert.alert("Error", "Please enter a user name");
      showToast.warning("Please enter a user name");
      return;
    }

    // Use either the state or ref value, whichever exists
    const idToUse = generatedId || generatedIdRef.current || generateID();
    console.log("Using ID:", idToUse);

    const newUser: User = {
      id: idToUse,
      name: currentName,
    };
    setLoading(true);
    try {
      const sentToESP32 = await sendUserToESP32(newUser);
      if (sentToESP32) {
        // Use a callback to ensure we have the latest users state
        setUsers((currentUsers) => {
          const updatedUsers = [...currentUsers, newUser];
          // Save to AsyncStorage
          saveUsers(updatedUsers);
          return updatedUsers;
        });

        // Reset input field
        setUserName("");
        userNameRef.current = "";
        setGeneratedId("");
        generatedIdRef.current = "";

        // Alert.alert("Success", "User added successfully");
        showToast.success("User added successfully");
      } else {
        // Alert.alert("Error", "Failed to add user to ESP32");
        showToast.error("Failed to add user to ESP32");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      // Alert.alert("Error", "Failed to add user");
      showToast.error("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <View>
        <Text style={styles.userName}>
          {item.name.length > 15
            ? item.name.substring(0, 16) + "..."
            : item.name}
        </Text>
        <Text style={styles.userId}>ID: {item.id}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setStringAsync(item.id);
            // Alert.alert("Copied", "User ID copied to clipboard");
            showToast.info("User ID copied to clipboard");
          }}
          style={styles.copyButton}
        >
          <Copy />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteUser(item.id)}
          style={styles.deleteButton}
        >
          <Cancel />
        </TouchableOpacity>
      </View>
    </View>
  );

  const deleteUser = (userId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const deletedFromESP32 = await deleteUserFromESP32(userId);
              if (deletedFromESP32) {
                setUsers((currentUsers) => {
                  const updatedUsers = currentUsers.filter(
                    (user) => user.id !== userId
                  );
                  saveUsers(updatedUsers);
                  return updatedUsers;
                });
                // Alert.alert("Success", "User deleted successfully");
                showToast.success("User deleted successfully");
                setLoading(false);
              } else {
                // Alert.alert("Error", "Failed to delete user from ESP32");
                showToast.error("Failed to delete user from ESP32");
                setLoading(false);
                return;
              }
            } catch (error) {
              console.error("Error deleting user:", error);
              // Alert.alert("Error", "Failed to delete user");
              showToast.error("Failed to delete user");
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3E5C76", "#74ACDC"]}
        style={styles.background}
      />
      <Text style={[styles.head, { marginTop: height * 0.1 }]}>Add User</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter User Name"
        value={userName}
        onChangeText={(text) => {
          console.log("Input changed to:", text);
          setUserName(text);
          userNameRef.current = text;
        }}
      />

      <Slider onComplete={handleAddUser} />

      <View style={styles.idDisplayContainer}>
        <Text
          style={[
            styles.idDisplayText,
            { color: generatedId ? "#000" : "#999" },
          ]}
        >
          {generatedId || "User ID will appear here"}
        </Text>
        <TouchableOpacity onPress={copyToClipboard}>
          <Copy />
        </TouchableOpacity>
      </View>
      <Text style={[styles.head, { marginTop: height * 0.05 }]}>
        Active Users
      </Text>
      {loading ? (
        <View>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      ) : users.length === 0 ? (
        <Text style={styles.noUsersText}>No active users found</Text>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          style={styles.usersList}
          contentContainerStyle={styles.usersListContent}
        />
      )}
    </View>
  );
};

export default UserManagementScreen;

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
    textAlign: "center",
    fontSize: RFValue(30),
    fontFamily: "Poppins-SemiBold",
    height: RFValue(40),
    marginBottom: RFValue(3),
    color: "#fff",
  },
  input: {
    width: width * 0.8,
    height: RFValue(50),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: RFValue(10),
    paddingHorizontal: RFValue(10),
    marginTop: RFValue(20),
    backgroundColor: "#fff",
  },
  idDisplayContainer: {
    width: width * 0.8,
    height: RFValue(50),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: RFValue(10),
    // paddingHorizontal: RFValue(10),
    marginTop: RFValue(50),
    backgroundColor: "#f8f9ff",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: RFValue(20),
    paddingLeft: RFValue(10),
  },
  idDisplayText: {
    fontSize: RFValue(14),
    fontFamily: "Poppins-Reg",
  },
  usersList: {
    width: width * 0.9,
    marginTop: RFValue(10),
  },
  usersListContent: {
    paddingBottom: RFValue(20),
  },
  userItem: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: RFValue(8),
    padding: RFValue(12),
    marginVertical: RFValue(5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: RFValue(16),
    fontFamily: "Poppins-Med",
    color: "#333",
  },
  userId: {
    fontSize: RFValue(12),
    fontFamily: "Poppins-Reg",
    color: "#666",
    marginTop: 2,
  },
  copyButton: {
    paddingRight: RFValue(15),
  },
  noUsersText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "Poppins-Reg",
    fontSize: RFValue(14),
    marginTop: RFValue(20),
  },
  userActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: RFValue(5),
    marginRight: RFValue(10),
  },
  deleteButton: {
    // backgroundColor: "#FF3B30",
    padding: RFValue(5),
    borderRadius: RFValue(5),
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Med",
    fontSize: RFValue(12),
    paddingHorizontal: RFValue(5),
  },
  loadingText: {
    color: "#fff",
    fontFamily: "Poppins-Reg",
    fontSize: RFValue(14),
    textAlign: "center",
    marginTop: RFValue(10),
  },
});
