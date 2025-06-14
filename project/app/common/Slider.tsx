import NextArrow from "../../assets/NextArrow";
import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Animated,
  PanResponder,
  PanResponderInstance,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface SliderProps {
  onComplete?: () => void;
}

const SLIDER_WIDTH = RFValue(280);
const HANDLE_WIDTH = RFValue(50);
const MAX_VALUE = SLIDER_WIDTH - HANDLE_WIDTH - 10; // Accounting for padding
const THRESHOLD = MAX_VALUE * 0.989; // 98.9% of the way

const Slider: React.FC<SliderProps> = ({ onComplete }) => {
  const offset = useRef(new Animated.Value(0)).current;
  const currentValue = useRef(0);

  const resetSlider = () => {
    currentValue.current = 0;
    Animated.timing(offset, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const panResponder: PanResponderInstance = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        offset.setOffset(currentValue.current);
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = gestureState.dx;
        const clampedValue = Math.max(0, Math.min(newValue, MAX_VALUE));
        offset.setValue(clampedValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        offset.flattenOffset();
        const finalValue = Math.max(
          0,
          Math.min(currentValue.current + gestureState.dx, MAX_VALUE)
        );
        currentValue.current = finalValue;

        if (finalValue >= THRESHOLD && onComplete) {
          onComplete();
          // Reset slider after sending message
          setTimeout(() => {
            resetSlider();
          }, 100);
        } else if (finalValue < THRESHOLD) {
          resetSlider();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.shadowContainer}>
        <View style={styles.sliderTrack}>
          <Text
            style={{
              textAlign: "center",
              color: "#FFFFFF",
              fontFamily: "Poppins-Reg",
              fontSize: RFValue(15),
            }}
          >
            Slide to Send
          </Text>
          <Animated.View
            style={[
              styles.sliderHandle,
              {
                transform: [{ translateX: offset }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <NextArrow
              color={"black"}
              style={styles.arrow}
              height={20}
              width={15}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    top: RFValue(20),
  },
  shadowContainer: {
    borderRadius: RFValue(30),
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  sliderTrack: {
    width: SLIDER_WIDTH,
    height: RFValue(60),
    backgroundColor: "#4CAF50",
    borderRadius: RFValue(30),
    justifyContent: "center",
    padding: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    // Additional inner shadow using border
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  sliderHandle: {
    width: HANDLE_WIDTH,
    height: RFValue(50),
    backgroundColor: "#f8f9ff",
    borderRadius: RFValue(25),
    position: "absolute",
    left: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  arrow: {
    top: RFValue(15),
    left: RFValue(20),
  },
});

export default Slider;
