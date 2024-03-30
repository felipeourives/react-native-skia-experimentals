import React, { useMemo } from 'react';
import {
  Blur,
  Canvas,
  Circle,
  ColorMatrix,
  Group,
  Paint,
  SweepGradient,
  runSpring,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import { useWindowDimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";

const RADIUS = 80;
export default function App() {

  const {
    width: windowWidth,
    height: windowHeight,
  } = useWindowDimensions();

  const cx = useValue(windowWidth / 2);
  const cy = useValue(windowHeight / 2);

  const layer = useMemo(() => {
    return (
      <Paint>
        <Blur blur={30} />
        <ColorMatrix
          matrix={[
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 90, -30,
          ]}
        />
      </Paint>
    );
  }, []);

  const gesture = Gesture.Pan()
    .onChange(({ x, y }) => {
      cx.current = x;
      cy.current = y;
    })
    .onEnd(({ x, y }) => {
      runSpring(cx, windowWidth / 2);
      runSpring(cy, windowHeight / 2);
    });


  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Canvas
          style={{
            flex: 1,
            backgroundColor: '#fff',
            width: "100%",
            height: "100%"
          }}
        >
          <Group layer={layer}>
            <Circle cx={cx} cy={cy} r={RADIUS} color={'red'}></Circle>
            <Circle cx={windowWidth / 2} cy={windowHeight / 2} r={RADIUS} />
            <SweepGradient c={vec(0, 0)} colors={['cyan', 'magenta', 'cyan']} />
          </Group>
        </Canvas>
      </GestureDetector >
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
