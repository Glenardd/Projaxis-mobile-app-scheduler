import { LinearGradient } from "expo-linear-gradient";
import { FlatList, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";

interface Item {
    id: number
    title: string
    sub_title: string
    color: [string, string, string]
    icon: ImageSourcePropType
}

// dashboard header 
const scrollHeader = () => {

    const styles = StyleSheet.create({
        container: {
            borderWidth: 2,
            borderColor: "#625B71",
            borderRadius: 10,
            backgroundColor: "#172038",
            minHeight: 80,
            minWidth: 110,
            justifyContent: "center",
            alignItems: "center",
            gap: 5
        },
        text_digit: {
            color: "white",
            fontSize: 25
        },
        text_title: {
            color: "#AEB7DA",
            fontSize: 12
        }
    })

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
                justifyContent: "center",
                minHeight: 115,
                marginBottom: 10
            }}
        >
            <View style={styles.container}>
                <Text style={styles.text_title}>Activities</Text>
                <Text style={styles.text_digit}>0</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.text_title}>Duration</Text>
                <Text style={styles.text_digit}>0</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.text_title}>Critical</Text>
                <Text style={styles.text_digit}>0</Text>
            </View>
        </View>
    )
}

// main dashboard content
export default function DashboardContent() {

    const data: Item[] = [
        {
            id: 1,
            title: "Create new Task",
            sub_title: "Input new task",
            color: ["#63D0FF", "#4297E8", "#235691"],
            icon: require("@/assets/dashboard_icons/task.png")
        },
        {
            id: 2,
            title: "Activity Table",
            sub_title: "View CPM calculations",
            color: ["#650CFF", "#8C30EF", "#C568CA"],
            icon: require("@/assets/dashboard_icons/activity_table.png")
        },
        {
            id: 3,
            title: "View Results",
            sub_title: "Project Summary",
            color: ["#C568CA", "#EF30A3", "#D32254"],
            icon: require("@/assets/dashboard_icons/view_results.png")
        },
        {
            id: 4,
            title: "PERT/CPM Diagrams",
            sub_title: "Network visualizations",
            color: ["#EA4F9F", "#F34548", "#C40003"],
            icon: require("@/assets/dashboard_icons/diagram.png")
        },
        {
            id: 5,
            title: "Presentation Mode",
            sub_title: "Slide deck view",
            color: ["#FF6932", "#D35731", "#EE3333"],
            icon: require("@/assets/dashboard_icons/presentation.png")
        },
        {
            id: 6,
            title: "Task Completed",
            sub_title: "View completed task",
            color: ["#1BE37F", "#51BD2A", "#4EA197"],
            icon: require("@/assets/dashboard_icons/task_completed.png")
        },
    ]

    const styles = StyleSheet.create({
        container: {
            borderWidth: 2,
            borderColor: 'rgba(98,91,113,0.38)',
            borderRadius: 15,
            backgroundColor: "rgba(98,91,113,0.38)",
            minHeight: 199,
            maxHeight: 199,
            maxWidth: 172,
            minWidth: 172,
            justifyContent: "space-evenly",
            alignItems: "center",
            gap: 5,
            padding:15
        },
        text_title: {
            color: "white",
            fontSize: 20,
            textAlign: "center",
        },
        text_sub: {
            color: "#AEB7DA",
            fontSize: 12,
            textAlign: "center"
        },
        icon_container: {
            padding: 5,
            borderRadius: 10
        }
    })

    // renders data here
    const navs = ({ item }: { item: Item }) => {
        return (
            <View style={{ height: 215 }}>
                <Pressable
                    style={styles.container}
                >
                    <LinearGradient
                        colors={item.color}
                        style={styles.icon_container}
                        start={{x:0, y:0}}
                        end={{x:0, y:1}}
                    >
                        <Image source={item.icon} style={{ height: 50, width: 50 }} />
                    </LinearGradient>
                    <View style={{gap: 5}}>
                        <Text style={styles.text_title}>{item.title}</Text>
                        <Text style={styles.text_sub}>{item.sub_title}</Text>
                    </View>
                </Pressable>
            </View>
        )
    }

    return (
        <View
            style={{
                gap: 15,
                padding: 5,
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <FlatList<Item>
                data={data}
                renderItem={navs}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={scrollHeader}
                numColumns={2}
                columnWrapperStyle={{ gap: 15 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}