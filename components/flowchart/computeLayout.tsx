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

  const taskMap = new Map(tasks.map(t => [t.label, t]))
  const depthMap = new Map<string, number>()

  // compute depth based on predecessors
  const getDepth = (label: string): number => {
    if (depthMap.has(label)) return depthMap.get(label)!
    const task = taskMap.get(label)
    if (!task || task.predecessor.length === 0) {
      depthMap.set(label, 0)
      return 0
    }
    const depth = Math.max(...task.predecessor.map(p => getDepth(p))) + 1
    depthMap.set(label, depth)
    return depth
  }

  // ✅ compute depth for all tasks
  tasks.forEach(t => {
    if (t.activity_name === "END") {
      const maxDepth = Math.max(0, ...Array.from(depthMap.values()))
      depthMap.set(t.label, maxDepth + 1)
    } else {
      getDepth(t.label)
    }
  })

  // group tasks by depth
  const levels = new Map<number, ActivityObjectType[]>()
  tasks.forEach(task => {
    const depth = depthMap.get(task.label)!
    if (!levels.has(depth)) levels.set(depth, [])
    levels.get(depth)!.push(task)
  })

  // assign positions
  const positioned: PositionedTask[] = []

  levels.forEach((levelTasks, depth) => {
    const count = levelTasks.length
    const totalWidth = (count - 1) * COL_GAP
    const canvasWidth = Math.max(screenWidth, totalWidth + PAD_X * 2)
    const startX = canvasWidth / 2 - totalWidth / 2 + NODE_W / 2
    
    levelTasks.forEach((task, i) => {
      positioned.push({
        ...task,
        depth,
        row: i,
        x: startX + i * COL_GAP,
        y: PAD_Y + depth * ROW_GAP + NODE_H / 2,
      })
    })
  })

  // ✅ compute bounding box
  const minX = Math.min(...positioned.map(t => t.x - NODE_W / 2))
  const maxX = Math.max(...positioned.map(t => t.x + NODE_W / 2))
  const minY = Math.min(...positioned.map(t => t.y - NODE_H / 2))
  const maxY = Math.max(...positioned.map(t => t.y + NODE_H / 2))

  // attach bounds to each task (optional, useful for centering later)
  return positioned.map(t => ({
    ...t,
    bounds: { minX, maxX, minY, maxY }
  }))
}

export default computeLayout
