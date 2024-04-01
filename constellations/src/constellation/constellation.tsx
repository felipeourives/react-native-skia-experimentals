import React, { useEffect, useState } from 'react';
import {
  Blur,
  Canvas,
  Circle,
  Group,
  Paint,
  SweepGradient,
  runSpring,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import { Dimensions, StyleSheet } from 'react-native';
import { getRandomNumber } from '../utils/get-random-number';

const { height, width } = Dimensions.get("window");

const Star = () => {
  const cx = getRandomNumber(0, width);
  const cy = getRandomNumber(0, height);
  const radius = getRandomNumber(0.1, 2.5);
  const blur = getRandomNumber(0, 1);

  return (
    <Group>
      <Circle cx={cx} cy={cy} r={radius} color={'white'}></Circle>
      <Blur blur={blur} />
    </Group >);
}


export const Constellation = () => {
  const [stars, setStars] = useState<number[]>([]);

  useEffect(() => {
    const dotsForHeight = Math.round(height / 25);
    const starsArray = Array.from(Array(12 * dotsForHeight).keys());
    setStars(starsArray);
  }, []);

  return (
    <Canvas
      style={{
        flex: 1,
        backgroundColor: '#000',
        width: "100%",
        height: "100%"
      }}
    >
      {stars.map((index) => {
        return (<Star key={index} />);
      })}
    </Canvas>
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
