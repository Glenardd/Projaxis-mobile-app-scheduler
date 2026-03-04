import FlowChart from "@/components/flowchart/flowchart";
import LoadingIndicator from "@/components/loadingIndicator";
import { useSearchActivity } from "@/services/activity.service";
import { criticalPathMethod, type ActivityWithTiming } from "@/utils/cpm";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
export default function PertChart() {
  const { project_id } = useLocalSearchParams<{ project_id: string }>();

  const {
    activity,
    isLoading,
    isRefetchingByUser,
    refetchByUser
  } = useSearchActivity(Number(project_id));


  const data: ActivityWithTiming[] = useMemo(() => {
    if (!activity) return [];
    return criticalPathMethod(activity) || [];
  }, [activity]);

  return isLoading ? <LoadingIndicator /> : (
      <FlowChart
        data={data}
        isLoading={isLoading}
        isRefetchingByUser={isRefetchingByUser}
        refetchByUser={refetchByUser}
        background="#172038" 
      />
  );
}
