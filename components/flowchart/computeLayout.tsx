import { ActivityObjectType } from "@/services/activity.service"
import { PositionedTask } from "@/utils/flowchartTypes"

const computeLayout = (
    tasks: ActivityObjectType[],
    screenWidth: number,
    layout: {
        NODE_W: number
        NODE_H: number
        ROW_GAP: number
        COL_GAP: number
        PAD_Y: number
        PAD_X: number
    }
): PositionedTask[] => {
    const { NODE_W, NODE_H, ROW_GAP, COL_GAP, PAD_Y, PAD_X } = layout

    const taskMap = new Map(tasks.map((t) => [t.label, t]))
    const depthMap = new Map<string, number>()

    const getDepth = (label: string): number => {
        if (depthMap.has(label)) return depthMap.get(label)!
        const task = taskMap.get(label)
        if (!task || task.predecessor.length === 0) {
            depthMap.set(label, 0)
            return 0
        }
        const depth = Math.max(...task.predecessor.map((p) => getDepth(p))) + 1
        depthMap.set(label, depth)
        return depth
    }

    tasks.forEach((t) => getDepth(t.label))

    const levels = new Map<number, string[]>()
    depthMap.forEach((depth, label) => {
        if (!levels.has(depth)) levels.set(depth, [])
        levels.get(depth)!.push(label)
    })

    const centerX = layout.PAD_X + screenWidth / 2

    return tasks.map((task) => {
        const depth = depthMap.get(task.label)!
        const levelTasks = levels.get(depth)!
        const index = levelTasks.indexOf(task.label)
        const count = levelTasks.length
        const totalSpan = (count - 1) * COL_GAP
        const startX = centerX - totalSpan / 2

        return {
            ...task,
            depth,
            row: index,
            x: startX + index * COL_GAP,
            y: PAD_Y + depth * ROW_GAP + NODE_H / 2,
        }
    })
}

export default computeLayout