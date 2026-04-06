import { type ActivityWithTiming } from "@/utils/cpm";
import { responsiveSize } from "@/utils/reponsiveSize";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import Svg from "react-native-svg";
import LoadingIndicator from "../loadingIndicator";

import Arrow from "./arrow";
import computeLayout from "./computeLayout";
import Node from "./node";
import ScheduleInfo from "./schecduleInfo";

export default function FlowChart(
  {
    data,
    isLoading,
    isRefetchingByUser,
    background,
    small = false,
    refetchByUser }:
    {
      data: ActivityWithTiming[],
      isLoading: boolean,
      isRefetchingByUser: boolean
      refetchByUser: () => void
      background?: "none" | "#172038" | "black"
      small?: boolean
    }
) {

  const [nodeData, setNodeData] = useState<ActivityWithTiming | undefined>()
  const [modalVisible, setModalVisible] = useState(false);
  const [svgLayout, setSvgLayout] = useState({ width: 0, height: 0 });

  const styles = StyleSheet.create({
    floatingButton: {
      position: "absolute",
      top: 15,
      right: small === true ? responsiveSize(10) : 30,
      zIndex: 1,
      padding: 10,
      borderRadius: 12,
      backgroundColor: "#1E3E67",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      elevation: 5
    },
    buttonText: {
      fontSize: small === true ? responsiveSize(10) : 15,
      color: "#fff",
    },
    labelText: {
      fontSize: 15,
      color: "#fff",
    },
    legendContainer: {
      position: "absolute",
      flexDirection: "row",
      top: 10,
      left: 15,
      gap: 10,
      zIndex: 2,
    },
    critical: {
      width: Dimensions.get("screen").width * 0.2 - 50,
      height: Dimensions.get("screen").height * 0.01 - 4,
      backgroundColor: '#F24B6F',
    },
    nonCritical: {
      width: Dimensions.get("screen").width * 0.2 - 50,
      height: Dimensions.get("screen").height * 0.01 - 4,
      backgroundColor: "#6b7280"
    },
    completed: {
      width: Dimensions.get("screen").width * 0.2 - 50,
      height: Dimensions.get("screen").height * 0.01 - 4,
      backgroundColor: "#3b77c6ff"
    },
    container: {
      flex: 1,
      backgroundColor: background || "#172038",
    },
    svgContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    }
  })

  /* ----------------------- panning and pinching ---------------------------- */

  const { width: screenWidth, height: screenHeight } = Dimensions.get("screen")

  const layout = useMemo(() => ({
    NODE_W: Math.min(0.26 * screenWidth, 300),
    NODE_H: Math.min(0.06 * screenHeight, 60),
    ROW_GAP: 0.15 * screenHeight,
    COL_GAP: Math.min(0.29 * screenWidth, 140),
    PAD_Y: 0.2 * screenHeight,
    PAD_X: 40,
    INIT_SCALE: screenWidth < 375 ? 0.7 : screenWidth < 768 ? 0.8 : 1.0
  }), [screenWidth, screenHeight])

  const { NODE_W, NODE_H, ROW_GAP, COL_GAP, PAD_Y, PAD_X, INIT_SCALE } = layout

  // x axis
  const positionX = useSharedValue(0)
  const offsetX = useSharedValue(0)
  const hasMovedX = useSharedValue(false)

  // y axis
  const positionY = useSharedValue(0)
  const offsetY = useSharedValue(0)
  const hasMovedY = useSharedValue(false)

  const scale = useSharedValue(INIT_SCALE)
  const savedScale = useSharedValue(1)

  const panGesture = useMemo(() => Gesture.Pan()
    .minDistance(0)
    .onUpdate((e) => {
      'worklet'
      positionX.value = offsetX.value + e.translationX
      positionY.value = offsetY.value + e.translationY
    })
    .onEnd(() => {
      'worklet'
      offsetX.value = positionX.value
      offsetY.value = positionY.value

      hasMovedX.value = true
      hasMovedY.value = true
    }), [])

  const pinchGesture = useMemo(() =>
    Gesture.Pinch()
      .onUpdate((e) => {
        'worklet'

        const newScale = Math.min(Math.max(savedScale.value * e.scale, 0.3), 5)

        const focalX = e.focalX
        const focalY = e.focalY

        positionX.value =
          focalX - (focalX - offsetX.value) * (newScale / savedScale.value)

        positionY.value =
          focalY - (focalY - offsetY.value) * (newScale / savedScale.value)

        scale.value = newScale
      })
      .onEnd(() => {
        'worklet'
        savedScale.value = scale.value
        offsetX.value = positionX.value
        offsetY.value = positionY.value

        hasMovedX.value = true
        hasMovedY.value = true
      }),
    []
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: positionX.value },
      { translateY: positionY.value },
    ]
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: hasMovedX.value || hasMovedY.value ? 1 : 0,
    pointerEvents: hasMovedX.value || hasMovedY.value ? 'auto' : 'none',
  }));

  const composedGesture = useMemo(
    () => Gesture.Simultaneous(panGesture, pinchGesture),
    [panGesture, pinchGesture]
  )

  /* ----------------------- diagrams ---------------------------- */

  const positioned = useMemo(() => {
    if (!data || data.length === 0) return [];
    return computeLayout(data, screenWidth, { NODE_W, NODE_H, ROW_GAP, COL_GAP, PAD_Y, PAD_X })
  }, [data, screenWidth, NODE_W, NODE_H, ROW_GAP, COL_GAP, PAD_Y, PAD_X])

  const dataMap = useMemo(() => new Map(data.map(d => [d.label, d])), [data])

  const posMap = useMemo(
    () => new Map(positioned.map((t) => [t.label, t])),
    [positioned]
  );

  // Calculate bounds based on actual node positions (without extra padding for viewBox)
  const nodeBounds = useMemo(() => {
    if (positioned.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    
    const minX = Math.min(...positioned.map(t => t.x - NODE_W / 2));
    const maxX = Math.max(...positioned.map(t => t.x + NODE_W / 2));
    const minY = Math.min(...positioned.map(t => t.y - NODE_H / 2));
    const maxY = Math.max(...positioned.map(t => t.y + NODE_H / 2));
    
    return { minX, maxX, minY, maxY };
  }, [positioned, NODE_W, NODE_H]);

  // Add padding for better visibility
  const bounds = useMemo(() => {
    const padding = 50;
    return {
      minX: nodeBounds.minX - padding,
      maxX: nodeBounds.maxX + padding,
      minY: nodeBounds.minY - padding,
      maxY: nodeBounds.maxY + padding,
    };
  }, [nodeBounds]);

  const canvasWidth = bounds.maxX - bounds.minX;
  const canvasHeight = bounds.maxY - bounds.minY;

  // Center the view on the nodes
  const centerView = useCallback(() => {
    'worklet'
    if (positioned.length === 0 || svgLayout.width === 0) return;
    
    // Calculate the center of the node bounds
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    // Calculate translation to center the content in the viewport
    // We want the center of the content to align with the center of the SVG container
    const translateX = svgLayout.width / 2 - centerX * scale.value;
    const translateY = svgLayout.height / 2 - centerY * scale.value;
    
    positionX.value = translateX;
    positionY.value = translateY;
    offsetX.value = translateX;
    offsetY.value = translateY;
  }, [bounds, svgLayout, positioned.length, scale]);

  // Reset view to centered position
  const resetView = useCallback(() => {
    'worklet'
    if (positioned.length === 0 || svgLayout.width === 0) return;
    
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    const translateX = svgLayout.width / 2 - centerX * INIT_SCALE;
    const translateY = svgLayout.height / 2 - centerY * INIT_SCALE;
    
    positionX.value = translateX;
    positionY.value = translateY;
    offsetX.value = translateX;
    offsetY.value = translateY;
    hasMovedX.value = false;
    hasMovedY.value = false;
    scale.value = INIT_SCALE;
    savedScale.value = INIT_SCALE;
  }, [bounds, svgLayout, INIT_SCALE, positioned.length]);

  // Initial centering when layout is ready
  useEffect(() => {
    if (positioned.length > 0 && svgLayout.width > 0 && svgLayout.height > 0) {
      const centerX = (bounds.minX + bounds.maxX) / 2;
      const centerY = (bounds.minY + bounds.maxY) / 2;
      
      const translateX = svgLayout.width / 2 - centerX * INIT_SCALE;
      const translateY = svgLayout.height / 2 - centerY * INIT_SCALE;
      
      positionX.value = translateX;
      positionY.value = translateY;
      offsetX.value = translateX;
      offsetY.value = translateY;
      scale.value = INIT_SCALE;
      savedScale.value = INIT_SCALE;
    }
  }, [bounds, svgLayout, INIT_SCALE, positioned.length]);

  // Build edges
  const edges = useMemo(() => {
    const result: React.ReactNode[] = [];

    positioned.forEach((task) => {
      task.predecessor.forEach((predLabel) => {
        const pred = posMap.get(predLabel);
        if (!pred) return;

        const fromActivity = dataMap.get(predLabel)
        const toActivity = dataMap.get(task.label)

        if (!fromActivity || !toActivity) return

        result.push(
          <Arrow
            key={`${predLabel}->${task.label}`}
            x1={pred.x}
            y1={pred.y + NODE_H / 2}
            x2={task.x}
            y2={task.y - NODE_H / 2}
            keyId={`${predLabel}->${task.label}`}
            from={fromActivity}
            to={toActivity}
          />
        );
      });
    });

    return result;
  }, [positioned, dataMap, posMap, NODE_H]);

  const handleNodePress = useCallback((task: ActivityWithTiming) => {
    setNodeData(task)
    setModalVisible(true)
  }, [])

  const handleModalClose = useCallback(() => setModalVisible(false), [])

  if (isLoading) {
    return <LoadingIndicator />
  }

  return (
    <View style={styles.container}>
      <View style={{ zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0 }}>
        <View style={styles.legendContainer}>
          <View style={{ flexDirection: "column", justifyContent: "center", gap: 5 }}>
            <Text style={styles.labelText}>Critical</Text>
            <Text style={styles.labelText}>Non-critical</Text>
            <Text style={styles.labelText}>Completed</Text>
          </View>
          <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", gap: 20 }}>
            <View style={styles.critical} />
            <View style={styles.nonCritical} />
            <View style={styles.completed} />
          </View>
        </View>
        <Animated.View style={buttonStyle}>
          <Pressable
            style={styles.floatingButton}
            disabled={isRefetchingByUser}
            onPress={() => {
              resetView()
            }}>
            <Text style={styles.buttonText}>Reset</Text>
          </Pressable>
        </Animated.View>
      </View>

      <GestureDetector gesture={composedGesture}>
        <View 
          style={styles.svgContainer}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setSvgLayout({ width, height });
          }}
        >
          <Animated.View style={animatedStyle}>
            <Svg 
              width={canvasWidth} 
              height={canvasHeight}
              viewBox={`${bounds.minX} ${bounds.minY} ${canvasWidth} ${canvasHeight}`}
            >
              {/* Edges */}
              {edges}
              
              {/* Nodes */}
              {positioned.map((task) => (
                <Node
                  onPress={handleNodePress}
                  key={task.label}
                  task={task}
                  data={dataMap.get(task.label)!}
                  NODE_W={NODE_W}
                  NODE_H={NODE_H}
                />
              ))}
            </Svg>
          </Animated.View>
        </View>
      </GestureDetector>
      
      <ScheduleInfo
        isVisible={modalVisible}
        onClose={handleModalClose}
        nodeData={nodeData}
      />
    </View>
  )
}