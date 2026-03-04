import { ArrowProps } from "@/utils/flowchartTypes";
import { memo } from "react";
import { Defs, G, Line, Marker, Path } from "react-native-svg";

function Arrow({ x1, y1, x2, y2, keyId, from, to }: ArrowProps) {
  const spacing = 12; // gap before arrowhead

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);

  const newX2 = x2 - (dx / len) * spacing;
  const newY2 = y2 - (dy / len) * spacing;

  const isCriticalEdge =
    from.slack === 0 &&
    to.slack === 0 &&
    from.EF === to.ES;

  const strokeColor = isCriticalEdge ? "#F24B6F" : "#6b7280";

  return (
    <G key={keyId}>
      <Defs>
        <Marker
          id="arrow-red"
          markerWidth={6}
          markerHeight={6}
          refX={5}
          refY={5}
          orient="auto"
        >
          <Path d="M0,0 L10,5 L0,10 Z" fill="#F24B6F" />
        </Marker>
        <Marker
          id="arrow-gray"
          markerWidth={6}
          markerHeight={6}
          refX={5}
          refY={5}
          orient="auto"
        >
          <Path d="M0,0 L10,5 L0,10 Z" fill="#6b7280" />
        </Marker>
      </Defs>
      <Line
        x1={x1}
        y1={y1}
        x2={newX2}
        y2={newY2}
        stroke={strokeColor}
        strokeWidth={2}
        markerEnd={`url(#${isCriticalEdge ? "arrow-red" : "arrow-gray"})`}
      />
    </G>
  );
}

export default memo(Arrow);
