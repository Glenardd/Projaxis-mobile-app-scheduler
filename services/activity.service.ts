import { useOnRefreshByUser } from "@/hooks/useOnRefreshByUser";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ActivityTableType {
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
    optimistic: number
    most_likely: number
    pessimistic: number
    project_id: number | undefined
    predecessor: string[]
    label: string
    expected: number
    isDone: boolean
}

//for insert only
interface InsertPayload {
    activity_name: string
    project_id: number | undefined
    predecessors: string[]
    optimistic: string
    mostLikely: string
    pessimistic: string
    expected: number
    isDone?: boolean
}

interface InsertDuration {
    activity_name: string
    project_id: number | undefined
    predecessors: string[]
    expected: number
    isDone?: boolean
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

// updates isDone
const updateActivityStatus = async (id: number, isDone: boolean) => {
    const { data, error } = await supabase
        .from("activity")
        .update({ isDone })   // ✅ only update isDone
        .eq("id", id)

    if (error) throw error
    return data
}

const useUpdateActivityStatus = (onSuccessCallBack?: () => void) => {
    const queryClient = useQueryClient()

    const { mutate: updateStatus, error, isPending, isSuccess } = useMutation({
        mutationFn: ({ id, isDone }: { id: number; isDone: boolean }) =>
            updateActivityStatus(id, isDone),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["activity"],
                exact: false
            })

            if (onSuccessCallBack) {
                onSuccessCallBack()
            }
        }
    })

    if (error) throw error

    return { updateStatus, isPending, isSuccess }
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
const useInsertActivity = (onSuccessCallBack?: () => void) => {
    const queryClient = useQueryClient()

    const insertActivity = async (InsertPayload: InsertPayload) => {

        const alphabet = Array.from({ length: 26 }, (_, i) => ({
            label: String.fromCharCode(65 + i) // A-Z
        }))

        const {
            activity_name,
            optimistic,
            mostLikely,
            pessimistic,
            project_id,
            predecessors,
            expected,
            isDone
        } = InsertPayload

        // get predecessor labels
        const { data: predecessorData } = await supabase
            .from("activity")
            .select("label")
            .in("activity_name", predecessors)
            .eq("project_id", project_id)

        const predecessorsId =
            predecessorData?.map((pred) => pred.label) ?? []

        //get use labels for predecessors
        const { data: activity } = await supabase
            .from("activity")
            .select("label")
            .eq("project_id", project_id)

        const usedLabels = new Set(
            activity?.map((obj) => obj.label) ?? []
        )

        //find first available label
        const availableLabel = alphabet.find(
            (l) => !usedLabels.has(l.label)
        )

        if (!availableLabel) {
            throw new Error("No available labels left (A-Z limit reached)")
        }

        const payload = {
            activity_name: activity_name,
            optimistic: parseInt(optimistic),
            most_likely: parseInt(mostLikely),
            pessimistic: parseInt(pessimistic),
            project_id: project_id,
            predecessor: predecessorsId,
            expected: expected,
            label: availableLabel.label,
            isDone: isDone
        }

        //insert
        const { data: insertData, error } = await supabase
            .from("activity")
            .insert([payload])
            .select()

        if (error) {
            // Handle unique constraint error (Postgres)
            if (error.code === "23505") {
                throw new Error("Label already exists for this project")
            }
            throw error
        }

        return insertData
    }

    const {
        mutate: insert_Activity,
        error: error_mutation,
        isPending,
        isSuccess
    } = useMutation({
        mutationFn: insertActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["activity"],
                exact: false
            })

            if (onSuccessCallBack) {
                onSuccessCallBack()
            }
        }
    })

    if (error_mutation) throw error_mutation

    return { insert_Activity, isPending, isSuccess }
}

const useUpdateActivity = (id: number, onSuccessCallBack?: () => void) => {

    const updateActivity = async (InsertPayload: InsertPayload) => {

        const {
            activity_name,
            optimistic,
            mostLikely,
            pessimistic,
            predecessors,
            project_id,
            expected,
            isDone
        } = InsertPayload

        // Fetch the labels for the given predecessor activity names
        const { data: predecessorLabels } = await supabase
            .from("activity")
            .select("label")
            .in("activity_name", predecessors)
            .eq("project_id", project_id)

        const predecessorsAlphabet = predecessorLabels?.map((pred) => pred.label) ?? [];

        const payload = {
            activity_name: activity_name,
            optimistic: parseInt(optimistic),
            most_likely: parseInt(mostLikely),
            pessimistic: parseInt(pessimistic),
            project_id: project_id,
            predecessor: predecessorsAlphabet,
            expected: expected,
            isDone: isDone
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
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["activity", id],
            })

            if (onSuccessCallBack) {
                onSuccessCallBack()
            }
        }
    });

    if (error_mutation) throw error_mutation;
    return { updateActivityMutate, isPending, isSuccess };
}

// delete a row
const useDeleteActivity = (project_id: number) => {
    const queryClient = useQueryClient();

    const deleteActivity = async (id: number) => {

        // get label and predecessor
        const { data: deletedActivity, error: deletedFetchError } =
            await supabase
                .from("activity")
                .select("label, predecessor")
                .eq("id", id)
                .single();

        if (deletedFetchError) throw deletedFetchError;

        const deletedLabel = deletedActivity.label;
        const deletedPredecessors = deletedActivity.predecessor ?? [];

        // get all activities before delete
        const { data: allActivities, error: fetchError } =
            await supabase
                .from("activity")
                .select("id, label, predecessor")
                .eq("project_id", project_id)
                .order("label");

        if (fetchError) throw fetchError;

        // delete activity
        const { error: deleteError } =
            await supabase
                .from("activity")
                .delete()
                .eq("id", id);

        if (deleteError) throw deleteError;

        // remaining activities
        const remainingActivities = allActivities.filter(
            act => act.id !== id
        );

        // reconnect predecessors first, middle last
        for (const act of remainingActivities) {

            let predecessors = act.predecessor ?? [];

            // if activity depended on deleted
            if (predecessors.includes(deletedLabel)) {

                // remove deleted reference
                predecessors = predecessors.filter(
                    (p: string) => p !== deletedLabel
                );

                
                deletedPredecessors.forEach((p: string) => {
                    if (!predecessors.includes(p)) {
                        predecessors.push(p);
                    }
                });

                act.predecessor = predecessors;
            }
        }

        // relabel after deletion
        const alphabet = Array.from({ length: 26 }, (_, i) =>
            String.fromCharCode(65 + i)
        );

        const labelMap = new Map<string, string>();

        remainingActivities.forEach((act, index) => {
            labelMap.set(act.label, alphabet[index]);
        });

        // update db base on label map
        for (const act of remainingActivities) {

            const newLabel = labelMap.get(act.label)!;

            const updatedPredecessor =
                act.predecessor?.map((p: string) =>
                    labelMap.get(p) ?? p
                ) ?? [];

            const { error: updateError } =
                await supabase
                    .from("activity")
                    .update({
                        label: newLabel,
                        predecessor: updatedPredecessor
                    })
                    .eq("id", act.id);

            if (updateError) throw updateError;
        }

        return remainingActivities;
    };

    const { mutate: deleteActivityMutate, error: error_mutation, isPending } =
        useMutation({
            mutationFn: deleteActivity,
            onSuccess: () =>
                queryClient.invalidateQueries({
                    queryKey: ["activity"],
                    exact: false
                }),
        });

    if (error_mutation) throw error_mutation;

    return { deleteActivity: deleteActivityMutate, isPending };
};

const useInsertActivityDuration = (onSuccessCallBack?: () => void) => {
    const queryClient = useQueryClient()

    const insertActivityDuration = async (InsertDuration: InsertDuration) => {

        const alphabet = Array.from({ length: 26 }, (_, i) => ({
            label: String.fromCharCode(65 + i) // A-Z
        }))

        const {
            activity_name,
            project_id,
            expected,
            predecessors,
            isDone
        } = InsertDuration

        // get predecessor labels
        const { data: predecessorData } = await supabase
            .from("activity")
            .select("label")
            .in("activity_name", predecessors)
            .eq("project_id", project_id)

        const predecessorsId =
            predecessorData?.map((pred) => pred.label) ?? []

        //get use labels for predecessors
        const { data: activity } = await supabase
            .from("activity")
            .select("label")
            .eq("project_id", project_id)

        const usedLabels = new Set(
            activity?.map((obj) => obj.label) ?? []
        )

        //find first available label
        const availableLabel = alphabet.find(
            (l) => !usedLabels.has(l.label)
        )

        if (!availableLabel) {
            throw new Error("No available labels left (A-Z limit reached)")
        }

        const payload = {
            activity_name: activity_name,
            project_id: project_id,
            predecessor: predecessorsId,
            expected: expected,
            label: availableLabel.label,
            isDone: isDone
        }

        //insert
        const { data: insertData, error } = await supabase
            .from("activity")
            .insert([payload])
            .select()

        if (error) {
            // Handle unique constraint error (Postgres)
            if (error.code === "23505") {
                throw new Error("Label already exists for this project")
            }
            throw error
        }

        return insertData
    }

    const {
        mutate: insert_Activity_duration,
        error: error_mutation,
        isPending,
        isSuccess
    } = useMutation({
        mutationFn: insertActivityDuration,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["activity"],
                exact: false
            })

            if (onSuccessCallBack) {
                onSuccessCallBack()
            }
        }
    })

    if (error_mutation) throw error_mutation

    return { insert_Activity_duration, isPending, isSuccess }
}

export { updateActivityStatus, useActivityById, useDeleteActivity, useInsertActivity, useInsertActivityDuration, useSearchActivity, useUpdateActivity, useUpdateActivityStatus };

