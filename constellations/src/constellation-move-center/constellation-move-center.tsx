import React, { useEffect, useState } from 'react';
import {
  Canvas,
  Circle,
  Group,
} from '@shopify/react-native-skia';
import { Dimensions, StyleSheet } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { getRandomNumber } from '../utils/get-random-number';


const { height, width } = Dimensions.get("window");

const Star = ({
  xPosition,
  yPosition,
}: {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
}) => {
  const initCx = getRandomNumber(0, width);
  const initCy = getRandomNumber(0, height);
  const radius = getRandomNumber(0.1, 2.5);

  const cx = useDerivedValue(() => {

    let newPosX = initCx;

    if (xPosition.value !== -1) {
      newPosX = xPosition.value;
    }
    return withSpring(newPosX, {
      overshootClamping: true,
    });

  }, [xPosition]);

  const cy = useDerivedValue(() => {

    let newPosY = initCy;

    if (yPosition.value !== -1) {
      newPosY = yPosition.value;
    }
    return withSpring(newPosY, {
      overshootClamping: true,
    });

  }, [yPosition]);

  return (
    <Group>
      <Circle cx={cx} cy={cy} r={radius} color={'white'}></Circle>
    </Group >);
}

export const ConstellationMoveCenter = () => {

  const xPosition = useSharedValue(-1);
  const yPosition = useSharedValue(-1);

  const [stars, setStars] = useState<number[]>([]);
  const gesture = Gesture.Tap()
    .onFinalize(() => {
      xPosition.value = width / 2;
      yPosition.value = height / 2;
    });

  useEffect(() => {
    const dotsForHeight = Math.round(height / 25);
    const starsArray = Array.from(Array(12 * dotsForHeight).keys());
    setStars(starsArray);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Canvas
          style={{
            flex: 1,
            backgroundColor: '#000',
            width: "100%",
            height: "100%"
          }}
        >
          {stars.map((index) => {
            return (<Star key={index} xPosition={xPosition} yPosition={yPosition} />);
          })}
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: 400,
  },
});
