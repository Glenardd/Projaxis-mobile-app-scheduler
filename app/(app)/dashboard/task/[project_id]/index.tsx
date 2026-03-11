import ActivityContainer from "@/components/activity-card";
import AddActivityButton from "@/components/add-activity-button";
import LoadingIndicator from "@/components/loadingIndicator";
import { ActivityObjectType, useSearchActivity } from "@/services/activity.service";
import { criticalPathMethod } from "@/utils/cpm";
import { useLocalSearchParams } from "expo-router";
import { RefreshControl, Text, View, VirtualizedList } from "react-native";

export default function TaskSearch() {

    const { project_id } = useLocalSearchParams<{ project_id: string }>()

    //searched activity
    const { activity: data, isRefetchingByUser, refetchByUser, isLoading } = useSearchActivity(parseInt(project_id))

    // sort data
    const sortedData = data?.sort((a, b) => {
        if (a.label.length !== b.label.length) {
            return a.label.length - b.label.length
        }
        return a.label.localeCompare(b.label)
    })

    const onGoingTask = sortedData?.filter((data) => data.isDone === false)
    const cpm = criticalPathMethod(sortedData || []);

    return isLoading ? <LoadingIndicator /> : (
        <>
            <VirtualizedList
                initialNumToRender={15}
                data={onGoingTask}
                renderItem={({ item }: {item: ActivityObjectType}) => (
                    <ActivityContainer
                        item={item}
                        project_id={project_id}
                        isComplete={true}
                        cpm={cpm}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                getItemCount={(data) => (data ? data.length : 0)}
                getItem={(data, index) => data[index]}

                ListHeaderComponent={<AddActivityButton project_id={project_id} />}
                refreshControl={
                    <RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />
                }
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                contentContainerStyle={{
                    padding: 25,
                    flexGrow: 1
                }}
                ListHeaderComponentStyle={{
                    marginBottom: 25
                }}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#30396cff", fontSize: 15 }}>Empty</Text>
                    </View>
                }
                style={{ width: "100%" }}
            />
        </>
    )
}
