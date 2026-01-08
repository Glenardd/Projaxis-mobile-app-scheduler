import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function TaskSearch(){

    const { project_id } = useLocalSearchParams<{ project_id: string }>();

    return(
        <View>
            <Text style={{color:"white"}}>{project_id}</Text>
        </View>
    )
}