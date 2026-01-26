import AddProjectButton from "@/components/add-project-button";
import LoadingIndicator from "@/components/loadingIndicator";
import { useViewProjects, type ProjectObjectType } from "@/services/projects.service";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function Home() {

    const [data, setData] = useState<ProjectObjectType[]>([])
    const router = useRouter()
    const { projects, isLoading, refetchByUser, isRefetchingByUser, isPending } = useViewProjects()

    useEffect(() => {
        // Update local state whenever projects changes
        if (projects && projects.length !== 0) {
            setData(projects)
        }

        if (isLoading) console.log('🔄 LOADING PROJECTS!')
        if (isPending) console.log('🔄 PENDING PROJECT!')
    }, [projects, isLoading, isPending]) // Add projects here!

    //render data here
    const Item = ({ item }: { item: ProjectObjectType }) => (
        <View>
            <Pressable
                onPress={() => {
                    console.log(item.project_name)
                    router.push({
                        pathname: "/(app)/dashboard/[project_id]",
                        params: { project_id: item.id }
                    })
                }}
                style={styles.container}
            >
                <Text style={{ color: "white" }}>{item.project_name}</Text>
            </Pressable>
        </View>
    );

    return isLoading ? <LoadingIndicator /> : (
        <FlatList
            refreshControl={
                <RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />
            }
            data={data}
            renderItem={Item}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<AddProjectButton />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                padding: 25
            }}
            ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
            ListHeaderComponentStyle={{
                marginBottom: 40
            }}
            ListEmptyComponent={
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "#30396cff", fontSize: 15 }}>Empty</Text>
                </View>
            }
        />
    )
}

//text color
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#172038",
        padding: 10,
        borderRadius: 10,
        borderColor: "#625B71",
        borderWidth: 1.5,
    }
})