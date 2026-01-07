import { FlatList, Pressable, StyleSheet, Text, View } from "react-native"

interface Item {
    id: number
    title: string
    sub_title: string
}

// header 
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
                marginBottom:10
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

export default function DashboardContent() {

    const data = [
        {
            id: 1,
            title: "Create new Task",
            sub_title: "Input new task"
        },
        {
            id: 2,
            title: "Activity Table",
            sub_title: "View CPM calculations"
        },
        {
            id: 3,
            title: "View Results",
            sub_title: "Project Summary"
        },
        {
            id: 4,
            title: "PERT/CPM Diagrams",
            sub_title: "Network visualizations"
        },
        {
            id: 5,
            title: "Presentation Mode",
            sub_title: "Slide deck view"
        },
        {
            id: 6,
            title: "Task Completed",
            sub_title: "View completed task"
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
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
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
    })

    // map the data here
    const navs = ({ item }: { item: Item }) => {
        return (
            <View style={{height: 215}}>
                <Pressable
                    style={styles.container}
                >
                    <Text style={styles.text_title}>{item.title}</Text>
                    <Text style={styles.text_sub}>{item.sub_title}</Text>
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