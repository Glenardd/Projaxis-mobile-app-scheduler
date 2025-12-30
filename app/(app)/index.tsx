import AddProjectButton from "@/components/add-project-button";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function Home() {
    const [data, setData] = useState<string[]|number[]>([])
    useEffect(() => {
        const test = async () => {
            const { data: projects } = await supabase.from('projects').select();
            if(projects){
                setData(projects)
            }
        }

        test();
    }, [])

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
        >
            <AddProjectButton />
            {data.map((projects_: any) => {

                return (
                    <Pressable
                        key={projects_?.id}
                        onPress={() => {
                            console.log(projects_.activity_name)
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
                                {projects_.activity_name}
                            </Text>
                        </View>
                    </Pressable>
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