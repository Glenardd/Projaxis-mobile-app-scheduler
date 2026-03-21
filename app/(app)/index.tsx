import AddProjectButton from "@/components/add-project-button";
import LoadingIndicator from "@/components/loadingIndicator";
import ProjectCard from "@/components/project-card";
import { useViewProjects } from "@/services/projects.service";
import { responsiveSize } from "@/utils/reponsiveSize";
import { useEffect } from "react";
import {
    RefreshControl,
    Text,
    View,
    VirtualizedList
} from "react-native";

export default function Projects() {
    const { projects, isLoading, refetchByUser, isRefetchingByUser, isPending } = useViewProjects()

    useEffect(() => {
        if (isLoading) console.log('🔄 LOADING PROJECTS!')
        if (isPending) console.log('🔄 PENDING PROJECT!')
    }, [isLoading, isPending]) // Add projects here!

    return isLoading ? <LoadingIndicator /> : (
        <VirtualizedList
            data={projects}
            getItem={(data, index) => data[index]}           
            getItemCount={(data) => data?.length ?? 0}   
            renderItem={({ item }) => <ProjectCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
                <RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />
            }
            ListHeaderComponent={<AddProjectButton />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: responsiveSize(25), flexGrow: 1 }}
            ItemSeparatorComponent={() => <View style={{ height: responsiveSize(20) }} />}
            ListHeaderComponentStyle={{ marginBottom: responsiveSize(25) }}
            ListEmptyComponent={
                <View style={{ justifyContent: "center", alignItems: "center", flex:1 }}>
                    <Text style={{ color: "#30396cff", fontSize: responsiveSize(15) }}>Empty</Text>
                </View>
            }
        />
    )
}