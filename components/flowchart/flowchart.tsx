import { type ActivityObjectType } from "@/services/activity.service";
import { type ActivityWithTiming } from "@/utils/cpm";
import { responsiveSize } from "@/utils/reponsiveSize";
import { useMemo, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import Svg from "react-native-svg";
import LoadingIndicator from "../loadingIndicator";

import { PositionedTask } from "@/utils/flowchartTypes";
import Arrow from "./arrow";
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

  const [nodeData, setNodeData] = useState<ActivityWithTiming>()
  const [modalVisible, setModalVisible] = useState(false);

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
      gap: 10
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
    }
  })

  /* ----------------------- panning and pinching ---------------------------- */

  const { width, height } = Dimensions.get("screen")

  const NODE_W = 0.26 * width
  const NODE_H = 0.07 * height
  const ROW_GAP = 0.20 * height
  const COL_GAP = 0.30 * width
  const PAD_Y = 0.2 * height
  const PAD_X = 0.5 * width
  const INIT_SCALE = width < 375 ? 0.7 : width < 768 ? 0.8 : 1.0

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

  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onUpdate((e) => {
      positionX.value = offsetX.value + e.translationX
      positionY.value = offsetY.value + e.translationY
    })
    .onEnd((e) => {
      offsetX.value = positionX.value
      offsetY.value = positionY.value

      hasMovedX.value = true
      hasMovedY.value = true
    })

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale
    })
    .onEnd(() => {
      savedScale.value = scale.value

      hasMovedX.value = true
      hasMovedY.value = true
    })

  const nativeScroll = Gesture.Native()

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value },
      { scale: scale.value }
    ],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: hasMovedX.value || hasMovedY.value ? 1 : 0,
    pointerEvents: hasMovedX.value || hasMovedY.value ? 'auto' : 'none',
  }));

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture, nativeScroll)

  /* ----------------------- diagrams ---------------------------- */

  const computeLayout = (tasks: ActivityObjectType[], screenWidth: number): PositionedTask[] => {
    const taskMap = new Map(tasks.map((t) => [t.label, t]))

    const depthMap = new Map<string, number>()

    const getDepth = (label: string): number => {
      if (depthMap.has(label)) return depthMap.get(label)!;
      const task = taskMap.get(label);
      if (!task || task.predecessor.length === 0) {
        depthMap.set(label, 0)
        return 0
      }
      const depth = Math.max(...task.predecessor.map((p) => getDepth(p))) + 1
      depthMap.set(label, depth)
      return depth
    }

    tasks.forEach((t) => {
      getDepth(t.label)
    })

    const levels = new Map<number, string[]>()
    depthMap.forEach((depth, label) => {
      if (!levels.has(depth)) levels.set(depth, [])
      levels.get(depth)!.push(label)
    })

    const centerX = PAD_X + screenWidth / 2

    return tasks.map((task) => {
      const depth = depthMap.get(task.label)!
      const levelTasks = levels.get(depth)!
      const index = levelTasks.indexOf(task.label);
      const count = levelTasks.length;

      const totalSpan = (count - 1) * COL_GAP
      const startX = centerX - totalSpan / 2

      return {
        ...task,
        depth,
        row: index,
        x: startX + index * COL_GAP,
        y: PAD_Y + depth * ROW_GAP + NODE_H / 2,
      };
    });
  }

  const positioned = useMemo(() => {
    return computeLayout(data, width);
  }, [data, width]);

  const posMap = useMemo(
    () => new Map(positioned.map((t) => [t.label, t])),
    [positioned]
  );

  const maxY = Math.max(...positioned.map((t) => t.y)) + NODE_H / 2 + PAD_Y;
  const canvasH = maxY;

  // build edges with correct slack lookup by label
  const edges = useMemo(() => {
    const result: React.ReactNode[] = [];

    // Map data by label for correct slack lookup
    const dataMap = new Map(data.map(d => [d.label, d]));

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
  }, [positioned, data]);

  return isLoading ? <LoadingIndicator /> : (
    <>
      <View style={{ flex: 1, backgroundColor: background }}>
        <View style={{ zIndex: 1 }}>
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
                positionX.value = 0
                positionY.value = 0
                offsetX.value = 0
                offsetY.value = 0
                hasMovedX.value = false
                hasMovedY.value = false
                scale.value = INIT_SCALE
              }}>
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
          </Animated.View>
        </View>

        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[animatedStyle, { alignItems: "center", justifyContent: "center" }]}>
            <Svg width={width * 2} height={canvasH}>

              {/* Edges */}
              {edges}

              {/* Nodes */}
              {positioned.map((task, i) => (
                <Node
                  onPress={(task) => {
                    setNodeData(task)
                    setModalVisible(true)
                  }}
                  key={task.label}
                  task={task}
                  data={data[i]}
                  NODE_W={NODE_W}
                  NODE_H={NODE_H}
                />
              ))}

              <ScheduleInfo
                isVisible={modalVisible}
                onClose={() => setModalVisible(!modalVisible)}
                nodeData={nodeData}
              />
            </Svg>
          </Animated.View>
        </GestureDetector>
      </View>
    </>
  )
}