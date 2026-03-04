import { NodeProps } from "@/utils/flowchartTypes";
import { memo } from "react";
import { G, Rect, Text as SvgText } from "react-native-svg";

function Node({ task, data, NODE_W, NODE_H, onPress }: NodeProps) {

  const isDone = task.isDone === false ? "#1E3E67" : "#3b77c6ff"

  return (
    <G
      key={task.label}
      onPressIn={() => onPress(data)} // on press callback
    >
      <Rect
        x={task.x - NODE_W / 2}
        y={task.y - NODE_H / 2}
        width={NODE_W}
        height={NODE_H}
        rx={10}
        fill={isDone}
        strokeWidth={2}
      />

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
        {data.expected + " day/s"}
      </SvgText>
    </G>
  )
}
export default memo(Node);