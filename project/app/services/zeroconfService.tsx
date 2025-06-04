import Zeroconf from "react-native-zeroconf";
import AsyncStorage from "@react-native-async-storage/async-storage";

const zeroconf = new Zeroconf();

export const discoverESP32 = async () => {
  return new Promise((resolve, reject) => {
    console.log("Starting Zeroconf scan...");
    zeroconf.scan();

    zeroconf.on("start", () => {
      console.log("Zeroconf scan started.");
    });

    zeroconf.on("resolved", async (service) => {
      console.log("Service resolved:", service);
      if (service.name === "zenlock") {
        const ipAddress = service.addresses[0];
        console.log("ESP32 found at IP address:", ipAddress);
        await AsyncStorage.setItem("esp32IpAddress", ipAddress);
        zeroconf.stop();
        resolve(ipAddress);
      }
    });

    zeroconf.on("error", (error) => {
      console.error("Zeroconf error:", error);
      zeroconf.stop();
      reject(error);
    });

    zeroconf.on("stop", () => {
      console.log("Zeroconf scan stopped.");
    });
  });
};
