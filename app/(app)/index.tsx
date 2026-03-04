import AddProjectButton from "@/components/add-project-button";
import LoadingIndicator from "@/components/loadingIndicator";
import ProjectCard from "@/components/project-card";
import { useViewProjects } from "@/services/projects.service";
import { responsiveSize } from "@/utils/reponsiveSize";
import { useEffect } from "react";
import {
    FlatList,
    RefreshControl,
    Text,
    View
} from "react-native";

export default function Home() {
    const { projects, isLoading, refetchByUser, isRefetchingByUser, isPending } = useViewProjects()

    useEffect(() => {
        if (isLoading) console.log('🔄 LOADING PROJECTS!')
        if (isPending) console.log('🔄 PENDING PROJECT!')
    }, [isLoading, isPending]) // Add projects here!

    return isLoading ? <LoadingIndicator /> : (
        <FlatList
            refreshControl={
                <RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />
            }
            data={projects}
            renderItem={({item}) => <ProjectCard item={item}/>}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<AddProjectButton />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                padding: responsiveSize(25)
            }}
            ItemSeparatorComponent={() => <View style={{ height: responsiveSize(20) }} />}
            ListHeaderComponentStyle={{
                marginBottom: responsiveSize(25)
            }}
            ListEmptyComponent={
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "#30396cff", fontSize: responsiveSize(15) }}>Empty</Text>
                </View>
            }
        />
    )
}