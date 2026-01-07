import AddProjectButton from "@/components/add-project-button";
import { useOnRefreshByUser } from "@/hooks/useOnRefreshByUser";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { supabase } from "@/lib/supabase";
import { useQuery } from '@tanstack/react-query';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface ProjectType{
    project_name: string
    id:number
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
        queryFn:fetchProjects ,
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
        if(isPending) console.log("LOADING")

    }, [isFetching, isPending])

    if(!projects) return null

    return (
        // return list
        <ScrollView
            style={{
                backgroundColor: "#070C27"
            }}
            contentContainerStyle={{
                gap: 25,
                padding: 30
            }}
            refreshControl={
                <RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser}/>
            }
        >
            <AddProjectButton />
            {data.map((projects_) => {
                return (
                    <TouchableOpacity
                        key={projects_?.id}
                        onPress={() => {
                            console.log(projects_?.project_name)
                            router.push({
                                pathname:"/(app)/dashboard",
                                params: {project_id: projects_?.project_name}
                            })
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "#172038",
                                padding: 10,
                                borderRadius: 10,
                                borderColor: "#625B71",
                                borderWidth: 1.5,
                            }}
                        >
                            <Text style={text.white}>
                                {projects_.project_name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
    )
}

//text color
const text = StyleSheet.create({
    white: {
        color: "white"
    }
})