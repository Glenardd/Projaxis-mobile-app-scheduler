import { Users } from "@/data/mockData";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function Home() {
    const data_ = new Users();
    const userData = data_.getData();

    return (
        // return list
        <ScrollView
            style={{
                backgroundColor: "#070C27"
            }}
            contentContainerStyle={{
                gap: 20,
                padding: 30
            }}
        >
            {userData.map((user_) => {
                return (
                    <Pressable
                        key={user_.id}
                        onPress={()=>{
                            console.log(data_.findData(user_.id));
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
                                {user_.projectName}
                            </Text>
                        </View>
                    </Pressable>
                )
            })}
        </ScrollView>
    );
};

//text color
const text = StyleSheet.create({
    white: {
        color: "white"
    }
});