import React, { useEffect, useState } from 'react';
import {
  Blur,
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
  index,
  xPosition,
  yPosition,
}: {
  index: number;
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
}) => {
  const cx = getRandomNumber(0, width);
  const cy = getRandomNumber(0, height);
  const initRadius = getRandomNumber(0.1, 2.5);

  const radius = useDerivedValue(() => {
    const hypoteneuse = Math.hypot(
      xPosition.value - cx,
      yPosition.value - 30 - cy
    );

    let newRadius = initRadius;
    if (hypoteneuse <= 55 && xPosition.value !== -1) {
      newRadius = 7;
    }

    return withSpring(newRadius, {
      overshootClamping: true,
    });
  }, [xPosition, yPosition]);

  return (
    <Group>
      <Circle cx={cx} cy={cy} r={radius} color={'white'}></Circle>
    </Group >);
}


export const ConstellationGesture = () => {
  const [stars, setStars] = useState<number[]>([]);

  useEffect(() => {
    const dotsForHeight = Math.round(height / 25);
    const starsArray = Array.from(Array(12 * dotsForHeight).keys());
    setStars(starsArray);
  }, []);

  const xPosition = useSharedValue(-1);
  const yPosition = useSharedValue(-1);

  const gesture = Gesture.Pan()
    .onBegin(({ x, y }) => {
      xPosition.value = x;
      yPosition.value = y;
    })
    .onChange(({ x, y }) => {
      xPosition.value = x;
      yPosition.value = y;
    })
    .onEnd(() => {
      xPosition.value = -1;
      yPosition.value = -1;
    })
    .onFinalize(() => {
      xPosition.value = -1;
      yPosition.value = -1;
    });


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
            return (<Star key={index} index={index} xPosition={xPosition} yPosition={yPosition} />);
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
