import { useOnRefreshByUser } from "@/hooks/useOnRefreshByUser";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ActivityTableType {
    isRefetchingByUser: boolean
    refetchByUser: () => void
    isLoading: boolean
    activity: ActivityObjectType[] | undefined
}

// single object return only
interface ActivityTableType_two {
    isRefetchingByUser: boolean
    refetchByUser: () => void
    isLoading: boolean
    activity: ActivityObjectType | undefined
}

// return value of the activity
export interface ActivityObjectType {
    id: number
    created_at: Date
    activity_name: string
    time: number
    project_id: number | undefined
    predecessor: string[]
    label: string
}

//for insert only
interface InsertPayload {
    activity_name: string
    project_id: number | undefined
    predecessors: string[]
    time: string
}

//search the activity by project here
const useSearchActivity = (project_id: number): ActivityTableType => {

    // fetch 
    const fetchData = async (): Promise<ActivityObjectType[]> => {

        //get activity data
        const { data: activity, error: activityError } = await supabase
            .from("activity")
            .select()
            .eq("project_id", project_id)

        return activity || [];
    }

    // query cache
    const { data: activity, isFetching, dataUpdatedAt, refetch, isPending, isLoading } = useQuery({
        queryKey: ["activity", project_id],
        queryFn: fetchData,
        staleTime: 1000 * 60 * 60 * 24,
        refetchOnMount: "always"
    })

    // for refetching data
    const { isRefetchingByUser, refetchByUser } = useOnRefreshByUser(refetch)
    useRefreshOnFocus(refetch)

    // return cache
    return { isRefetchingByUser, refetchByUser, isLoading, activity }
}

// use activity id to get the activity content
const useActivityById = (activity_id: number): ActivityTableType_two => {

    //get activity content
    const fetchActivity = async (): Promise<ActivityObjectType> => {
        const { data: activity } = await supabase
            .from("activity")
            .select()
            .eq("id", activity_id)
            .single()

        return activity || []
    }

    const { data: activity, isFetching, dataUpdatedAt, refetch, isPending, isLoading } = useQuery({
        queryKey: ["activity", activity_id],
        queryFn: fetchActivity,
        staleTime: 1000 * 60 * 60 * 24,
        refetchOnMount: "always"
    })

    const { isRefetchingByUser, refetchByUser } = useOnRefreshByUser(refetch)
    useRefreshOnFocus(refetch)

    return { isRefetchingByUser, refetchByUser, isLoading, activity }
}

// insert new data
const useInsertActivity = () => {
    const queryClient = useQueryClient()

    //insert data example
    const insertActivity = async (InsertPayload: InsertPayload) => {

        const alphabet = [{ "label": "A" }, { "label": "B" }, { "label": "C" }, { "label": "D" }, { "label": "E" }, { "label": "F" }, { "label": "G" }, { "label": "H" }, { "label": "I" }, { "label": "J" }, { "label": "K" }, { "label": "L" }, { "label": "M" }, { "label": "N" }, { "label": "O" }, { "label": "P" }, { "label": "Q" }, { "label": "R" }, { "label": "S" }, { "label": "T" }, { "label": "U" }, { "label": "V" }, { "label": "W" }, { "label": "X" }, { "label": "Y" }, { "label": "Z" }]

        const {
            activity_name,
            time,
            project_id,
            predecessors
        } = InsertPayload

        //get the activity id
        const { data: predecessorId } = await supabase
            .from("activity")
            .select("label")
            .in("activity_name", predecessors)

        // get all labels in activity
        const { data: activity } = await supabase
            .from("activity")
            .select("label")
            .eq("project_id", project_id)
        const usedLabels = new Set(activity?.map((obj) => obj?.label) || [])

        // extract id
        const predecessorsId = predecessorId?.map((pred) => pred.label)

        // vacant labels
        const label = alphabet.filter((label_) => !usedLabels.has(label_.label))

        const payload = {
            activity_name: activity_name,
            time: parseInt(time),
            project_id: project_id,
            predecessor: predecessorsId,
            label: label[0].label,
        }

        const { data: insertData, error } = await supabase
            .from("activity")
            .insert([payload])
            .select()

        if (error) throw console.log(error)

        return insertData
    }

    const { mutate: insert_Activity, error: error_mutation, isPending, isSuccess } = useMutation({
        mutationFn: insertActivity,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ["activity"],
            exact: false
        })
    })

    if (error_mutation) throw error_mutation
    return { insert_Activity, isPending, isSuccess }
}

const useUpdateActivity = (id: number) => {

    const updateActivity = async (InsertPayload: InsertPayload) => {

        const {
            activity_name,
            time,
            predecessors,
            project_id
        } = InsertPayload

        // Fetch the labels for the given predecessor activity names
        const { data: predecessorLabels } = await supabase
            .from("activity")
            .select("label")
            .in("activity_name", predecessors);

        const predecessorsAlphabet = predecessorLabels?.map((pred) => pred.label) ?? [];

        const payload = {
            activity_name: activity_name,
            time: parseInt(time),
            project_id: project_id,
            predecessor: predecessorsAlphabet,
        }
        console.log(payload);

        const { data: updatedActivity, error } = await supabase
            .from("activity")
            .update([payload])
            .eq("id", id)

        if (error) throw error;
        return updatedActivity;
    }

    const queryClient = useQueryClient();
    const { mutate: updateActivityMutate, error: error_mutation, isPending, isSuccess } = useMutation({
        mutationFn: updateActivity,
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ["activity", id],
        })
    });

    if (error_mutation) throw error_mutation;
    return { updateActivityMutate, isPending, isSuccess };
}

// delete a row
const useDeleteActivity = (project_id: number) => {
    const queryClient = useQueryClient()

    const alphabet = [{ "label": "A" }, { "label": "B" }, { "label": "C" }, { "label": "D" }, { "label": "E" }, { "label": "F" }, { "label": "G" }, { "label": "H" }, { "label": "I" }, { "label": "J" }, { "label": "K" }, { "label": "L" }, { "label": "M" }, { "label": "N" }, { "label": "O" }, { "label": "P" }, { "label": "Q" }, { "label": "R" }, { "label": "S" }, { "label": "T" }, { "label": "U" }, { "label": "V" }, { "label": "W" }, { "label": "X" }, { "label": "Y" }, { "label": "Z" }]

    const deleteActivity = async (id: number) => {

        // get activity id
        const { data: deletedActivity, error: deletedFetchError } = await supabase.from("activity").select("label").eq("id", id).single()
        if (deletedFetchError) throw deletedFetchError

        // store the deleted label
        const deletedlabel = deletedActivity.label

        // all actvities
        const { data: allActivities, error: fetchError } = await supabase.from("activity").select("id, label, predecessor").eq("project_id", project_id).order("label")
        if (fetchError) throw fetchError

        // filter the removed id
        const remainingActivities = allActivities.filter(act => act.id !== id)

        //delete label
        const { error: deleteError } = await supabase.from("activity").delete().eq("id", id)
        if (deleteError) throw deleteError

        //for updating label
        const labelMap = new Map<string, string>()

        remainingActivities.forEach((act, index) => {
            labelMap.set(act.label, alphabet[index].label)
        })

        // update predecessor
        for (const act of remainingActivities) {
            const newLabel = labelMap.get(act.label)!

            const predecessors = act.predecessor ?? []

            const updatedPredecessor = predecessors.filter(
                (label: string) => label !== deletedlabel
            )

            const { error: updateError } = await supabase
                .from("activity")
                .update({ label: newLabel, predecessor: updatedPredecessor })
                .eq("id", act.id)

            if (updateError) throw updateError
        }

        return remainingActivities
    }

    const { mutate: deleteActivityMutate, error: error_mutation, isPending } = useMutation({
        mutationFn: deleteActivity,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ["activity"],
                exact: false
            }),
    })

    if (error_mutation) throw error_mutation
    return { deleteActivity: deleteActivityMutate, isPending }
}

export { useActivityById, useDeleteActivity, useInsertActivity, useSearchActivity, useUpdateActivity };

