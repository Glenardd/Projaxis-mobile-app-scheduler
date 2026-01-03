import { supabase } from "@/lib/supabase";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, TextInput, View } from "react-native";

export default function Forms() {
    const [projectName, setProjectName] = useState("");
    const [optimistic, setOptimistic] = useState("");
    const [mostLikely, setMostLikey] = useState("");
    const [pessimistic, setPessimistic] = useState("");


    const addNewProject = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser(); // user is an object

        const data_ = {
            project_name: projectName,
            optimistic_time: parseInt(optimistic),
            most_likely_time: parseInt(mostLikely),
            pessimistic_time: parseInt(pessimistic),
            user_id: user?.id
        }

        const { data: projects, error } = await supabase
            .from('projects')
            .insert([data_]) // wrap in array
            .select();

        if (error) {
            console.error('Failed to insert project:', error);
            return;
        }

        console.log('Inserted project:', projects);
        // Here you can mutate your state or React Query cache
    };

    // const [isFocus, setIsFocus] = useState(false);

    // const [child, setChild] = useState<string[] | number[]>([])

    // //fetch project to display in drop bar
    // const fetchProjects = async () => {
    //     const { data: projects } = await supabase.from('projects').select()
    //     return projects
    // }

    // const { data: projects, isFetching, dataUpdatedAt, refetch, isPending } = useQuery({
    //     queryKey: ['projects'],
    //     queryFn: fetchProjects,
    //     staleTime: 1000 * 60 * 5,
    // })

    // // const { isRefetchingByUser, refetchByUser } = useOnRefreshByUser(refetch)
    // useRefreshOnFocus(refetch)

    // useEffect(() => {
    //     if (projects && projects.length !== 0) {
    //         setChild(projects)
    //     }

    //     if (isFetching) console.log('🔄 fetching data!')
    //     if (isPending) console.log("LOADING")

    // }, [isFetching, isPending])

    // if (!projects) return null

    // //will be used by drop down
    // const data = [
    //     ...child?.map((data: any | string) => ({
    //         label: data?.activity_name,
    //         value: data?.id
    //     }))
    // ]

    const navigation = useNavigation();

    return (
        <View
            style={{
                backgroundColor: "#070C27",
                flex: 1
            }}
        >
            <View style={styles.container}>
                <Text style={{ color: "#AEB7DA" }}>Project Name</Text>
                <TextInput
                    onChangeText={setProjectName}
                    value={projectName}
                    placeholder="Activity"
                    style={styles.input}
                    placeholderTextColor="#575884"
                />
                <Text style={{ color: "#AEB7DA" }}>Optimistic Time/s</Text>
                <TextInput
                    keyboardType="numeric"
                    onChangeText={setOptimistic}
                    value={optimistic}
                    placeholder="Time"
                    style={styles.input}
                    placeholderTextColor="#575884"
                />
                <Text style={{ color: "#AEB7DA" }}>Most Like Time</Text>
                <TextInput
                    keyboardType="numeric"
                    onChangeText={setMostLikey}
                    value={mostLikely}
                    placeholder="Time"
                    style={styles.input}
                    placeholderTextColor="#575884"
                />
                <Text style={{ color: "#AEB7DA" }}>Pessimistic Time</Text>
                <TextInput
                    onChangeText={setPessimistic}
                    value={pessimistic}
                    placeholder="Time"
                    style={styles.input}
                    placeholderTextColor="#575884"
                />
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 20 }}>
                    <View style={{ minWidth: Dimensions.get("screen").width / 2.5 }}>
                        <Button title="Add" onPress={() => {
                            addNewProject()
                            navigation.goBack()
                        }}
                        />
                    </View>
                    <View style={{ minWidth: Dimensions.get("screen").width / 2.5 }}>
                        <Button title="Cancel" onPress={() => navigation.goBack()} />
                    </View>

                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 30,
        gap: 10
    },
    input: {
        color: "#AEB7DA",
        height: 40,
        padding: 10,
        maxWidth: 360,
        backgroundColor: "#252A4A",
        borderRadius: 10
    },
});