import { ActivityObjectType } from "@/services/activity.service";
import { ActivityWithTiming } from "@/utils/cpm";

export interface PositionedTask extends ActivityObjectType {
    x: number
    y: number
    depth: number
    row: number
}

export interface NodeProps {
    task: PositionedTask
    data: ActivityWithTiming
    NODE_W: number
    NODE_H: number
    onPress: (task: ActivityWithTiming) => void
}

export interface ArrowProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    keyId: string;
    from: ActivityWithTiming; // predecessor
    to: ActivityWithTiming;   // current activity
}