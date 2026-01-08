import AddProjectButton from "@/components/add-project-button";
import { useOnRefreshByUser } from "@/hooks/useOnRefreshByUser";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { supabase } from "@/lib/supabase";
import { useQuery } from '@tanstack/react-query';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface ProjectType {
    id: number
    created_at: string
    project_name: string
    user_id: string
}

export default function Home() {

    const [data, setData] = useState<ProjectType[]>([])
    const router = useRouter()

    const fetchProjects = async () => {
        const { data: projects } = await supabase.from('projects').select()
        return projects
    }

    const { data: projects, isFetching, dataUpdatedAt, refetch, isPending } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
        staleTime: 1000 * 60 * 5,
    })

    const { isRefetchingByUser, refetchByUser } = useOnRefreshByUser(refetch)
    useRefreshOnFocus(refetch)

    useEffect(() => {
        if (projects && projects.length !== 0) {
            setData(projects)
            // console.log("Project data: ",projects)
        }

        if (isFetching) console.log('🔄 fetching data!')
        if (isPending) console.log("LOADING")

    }, [isFetching, isPending])

    if (!projects) return null

    //render data here
    const Item = ({ item }: { item: ProjectType }) => (
        <View>
            <TouchableOpacity
                onPress={() => {
                    console.log(item.project_name)
                    router.push({
                        pathname: "/(app)/dashboard",
                        params: { project_id: item.project_name }
                    })
                }}
                style={styles.container}
            >
                <Text style={{ color: "white" }}>{item.project_name}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <FlatList
            refreshControl={
                <RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />
            }
            data={projects}
            renderItem={Item}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<AddProjectButton />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                padding: 25
            }}
            ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
            ListHeaderComponentStyle={{
                marginBottom:40
            }}
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