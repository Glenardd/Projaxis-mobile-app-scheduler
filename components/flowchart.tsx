import { type ActivityObjectType } from "@/services/activity.service";
import { type ActivityWithTiming } from "@/utils/cpm";
import { responsiveImageSize } from "@/utils/reponsiveImageSize";
import { responsiveFont } from "@/utils/responsiveFontSize";
import { memo, useMemo } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import Svg, { G, Line, Rect, Text as SvgText } from "react-native-svg";
import LoadingIndicator from "./loadingIndicator";

interface PositionedTask extends ActivityObjectType {
  x: number
  y: number
  depth: number
  row: number
}

interface NodeProps {
  task: PositionedTask;
  data: ActivityWithTiming;
  NODE_W: number;
  NODE_H: number;
}

const Node = memo(({ task, data, NODE_W, NODE_H }: NodeProps) => (
  <G key={task.label}>
    <Rect
      x={task.x - NODE_W / 2}
      y={task.y - NODE_H / 2}
      width={NODE_W}
      height={NODE_H}
      rx={10}
      fill="#1E3E67"
      strokeWidth={2}
    />

    {/* for the linear gradient */}
    <Rect
      x={task.x - NODE_W / 2 + 10}
      y={task.y - 17.5}
      width={35}
      height={35}
      rx={10}
      fill={data.slack === 0 ? "#F24B6F" : "#5fc1ebff"}
    />
    <SvgText
      x={task.x + NODE_W / 2 - 72}
      y={task.y + 1}
      fontSize={16}
      fontWeight="bold"
      textAnchor="middle"
      alignmentBaseline="middle"
      fill="white"
    >
      {task.label}
    </SvgText>
    <SvgText
      x={task.x + NODE_W / 2 - 30}
      y={task.y + 1}
      fontSize={12}
      fontWeight="bold"
      textAnchor="middle"
      alignmentBaseline="middle"
      fill="white"
    >
      {data.expected + " days"}
    </SvgText>
  </G>
))


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
      isRefetchingByUser: boolean,
      refetchByUser: () => void,
      background?: "none" | "#172038" | "black"
      small?: boolean
    }
) {

  const styles = StyleSheet.create({
    floatingButton: {
      position: "absolute",
      top: 15,
      right: small === true ? responsiveImageSize(10) :30,
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
      fontSize: small === true ? responsiveFont(10): 15,
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
    }
  });

  /* ----------------------- panning and pinching ---------------------------- */

  const { width, height } = Dimensions.get("screen")

  const NODE_W = 0.26 * width
  const NODE_H = 0.07 * height
  const ROW_GAP = 0.15 * height// vertical distance between depth levels
  const COL_GAP = 0.30 * width // horizontal distance between siblings
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

  // Native scroll gesture
  const nativeScroll = Gesture.Native()

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value },
      { scale: scale.value }
    ],
  }));

  // if diagram is moved turn on btn opacity
  const buttonStyle = useAnimatedStyle(() => ({
    opacity: hasMovedX.value || hasMovedY.value ? 1 : 0,
    pointerEvents: hasMovedX.value || hasMovedY.value ? 'auto' : 'none',
  }));

  // Combine both gestures
  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture, nativeScroll)

  /* ----------------------- diagrams ---------------------------- */

  // topological sort and positioning of x and y
  const computeLayout = (tasks: ActivityObjectType[], screenWidth: number): PositionedTask[] => {
    const taskMap = new Map(tasks.map((t) => [t.label, t]))

    // Calculate depth for each task based on longest predecessor chain
    const depthMap = new Map<string, number>()

    // will determine who's on top to bottom
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

    // Group tasks by depth level
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

      // spread children evenly, centered on screen
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

  // Calculate canvas height
  const maxY = Math.max(...positioned.map((t) => t.y)) + NODE_H / 2 + PAD_Y;
  const canvasH = maxY;

  // lines rendered here
  const renderArrow = (x1: number, y1: number, x2: number, y2: number, key: string, data: ActivityWithTiming[], index: number) => {
    return (
      <G key={key}>
        <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={data[index].slack === 0 ? "#F24B6F" : "#6b7280"} strokeWidth={2} />
      </G>
    );
  }

  // build lines here
  const edges = useMemo(() => {
    const result: React.ReactNode[] = [];

    positioned.forEach((task, index) => {
      task.predecessor.forEach((predLabel) => {
        const pred = posMap.get(predLabel);
        if (!pred) return;

        result.push(
          renderArrow(
            pred.x,
            pred.y + NODE_H / 2,
            task.x,
            task.y - NODE_H / 2,
            `${predLabel}->${task.label}`,
            data,
            index
          )
        );
      });
    });

    return result;
  }, [positioned]);

  // final render
  return isLoading ? <LoadingIndicator /> : (
    <>
      <View
        style={{ flex: 1, backgroundColor: background }}
      >
        <View style={{ zIndex: 1 }}>
          <View style={styles.legendContainer}>
            <View style={{ flexDirection: "column", justifyContent: "center", gap: 5 }}>
              <Text style={styles.labelText}>Critical</Text>
              <Text style={styles.labelText}>Non-critical</Text>
            </View>
            <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", gap: 5 }}>
              <View style={styles.critical} />
              <View style={styles.nonCritical} />
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
              {/* lines */}
              {edges}

              {/* Nodes */}
              {positioned.map((task, i) => (
                <Node key={task.label} task={task} data={data[i]} NODE_W={NODE_W} NODE_H={NODE_H} />
              ))}
            </Svg>
          </Animated.View>
        </GestureDetector>
      </View>
    </>
  )
}