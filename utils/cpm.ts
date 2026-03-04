import { type ActivityObjectType } from "@/services/activity.service";

export interface ActivityWithTiming extends ActivityObjectType {
  ES: number;
  EF: number;
  LS: number;
  LF: number;
  slack: number;
  predecessor: string[];
}

export function criticalPathMethod(activities: ActivityObjectType[]): ActivityWithTiming[] {

  const all: ActivityWithTiming[] = activities.map(a => ({
    ...a,
    ES: 0,
    EF: 0,
    LS: 0,
    LF: 0,
    slack: 0,
  }));

  const map = new Map(all.map(a => [a.label, a]));

  // Topological Sort
  const inDegree = new Map<string, number>();

  all.forEach(a => inDegree.set(a.label, 0));

  all.forEach(a => {
    a.predecessor.forEach(p => {
      inDegree.set(a.label, (inDegree.get(a.label) ?? 0) + 1);
    });
  });

  const queue: ActivityWithTiming[] = [];
  inDegree.forEach((deg, label) => {
    if (deg === 0) queue.push(map.get(label)!);
  });

  const topo: ActivityWithTiming[] = [];

  while (queue.length) {
    const current = queue.shift()!;
    topo.push(current);

    all.forEach(a => {
      if (a.predecessor.includes(current.label)) {
        inDegree.set(a.label, inDegree.get(a.label)! - 1);
        if (inDegree.get(a.label) === 0) {
          queue.push(a);
        }
      }
    });
  }

  if (topo.length !== all.length) {
    throw new Error("Cycle detected in activity network");
  }
  
  // Forward Pass (ES, EF)
  topo.forEach(activity => {
    const predecessors = activity.predecessor.map(p => map.get(p)!);

    activity.ES =
      predecessors.length > 0
        ? Math.max(...predecessors.map(p => p.EF))
        : 0;

    activity.EF = activity.ES + (activity.expected ?? 0);
  });

  // Project duration
  const projectFinish = Math.max(...topo.map(a => a.EF));

  // Backward Pass (LS, LF)
  [...topo].reverse().forEach(activity => {
    const successors = topo.filter(a =>
      a.predecessor.includes(activity.label)
    );

    activity.LF =
      successors.length > 0
        ? Math.min(...successors.map(s => s.LS))
        : projectFinish;

    activity.LS = activity.LF - (activity.expected ?? 0);
    activity.slack = activity.LS - activity.ES;
  });

  
  // Debug logs
  // -----------------------------
  console.log("ES:", topo.map(a => a.ES));
  console.log("EF:", topo.map(a => a.EF));
  console.log("LS:", topo.map(a => a.LS));
  console.log("LF:", topo.map(a => a.LF));
  console.log("Slack:", topo.map(a => a.slack));
  // critical path
  console.log(topo.filter((a => a.slack === 0)).map(a => a.label).join(", "));
  // non critical
  console.log(topo.filter((a => a.slack > 0)).map(a => a.label).join(", "));
  // duration
  console.log("Project Duration:", projectFinish);

  return topo;
}
