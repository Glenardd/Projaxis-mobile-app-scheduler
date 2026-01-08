import ScreenHeader from "@/components/screen-header";
import { useLocalSearchParams } from "expo-router";

export default function ProjectHeader() {
  const { project_id } = useLocalSearchParams<{ project_id: string }>();

  return (
      <ScreenHeader
        title={project_id}
        subtitle="Project dashboard"
        currentPage="Project Library"
      />
  );
}
