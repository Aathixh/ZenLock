import Toast from "react-native-toast-message";

export const showToast = {
  success: (message: string, title = "Success") => {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
      position: "bottom",
      visibilityTime: 4000,
    });
  },

  error: (message: string, title = "Error") => {
    Toast.show({
      type: "error",
      text1: title,
      text2: message,
      position: "bottom",
      visibilityTime: 4000,
    });
  },

  info: (message: string, title = "Info") => {
    Toast.show({
      type: "info",
      text1: title,
      text2: message,
      position: "bottom",
      visibilityTime: 4000,
    });
  },

  warning: (message: string, title = "Warning") => {
    Toast.show({
      type: "warning",
      text1: title,
      text2: message,
      position: "bottom",
      visibilityTime: 4000,
    });
  },
};
