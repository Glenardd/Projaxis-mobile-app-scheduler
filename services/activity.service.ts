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

// adds label 
const numberToLabel = (num: number) => {
    let label = "";

    while (num >= 0) {
        label = String.fromCharCode((num % 26) + 65) + label;
        num = Math.floor(num / 26) - 1;
    }

    return label;
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

        // console.log("new predecessor made: ", predecessors)

        // get predecessor labels
        const { data: predecessorData } = await supabase
            .from("activity")
            .select("label")
            .in("id", predecessors)
            .eq("project_id", project_id)

        const predecessorsId =
            predecessorData?.map((pred) => pred.label) ?? []

        //get use labels for predecessors
        const { data: activity } = await supabase
            .from("activity")
            .select("label")
            .eq("project_id", project_id)

        const nextIndex = activity?.length ?? 0
        const availableLabel = numberToLabel(nextIndex)

        const payload = {
            activity_name: activity_name,
            optimistic: parseInt(optimistic),
            most_likely: parseInt(mostLikely),
            pessimistic: parseInt(pessimistic),
            project_id: project_id,
            predecessor: predecessorsId,
            expected: expected,
            label: availableLabel,
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
            .in("id", predecessors)
            .eq("project_id", project_id)

        // console.log("Fetched rows:", predecessorLabels);

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
        // console.log(payload);

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
        // get deleted activity
        const { data: deletedActivity, error: deletedFetchError } =
            await supabase
                .from("activity")
                .select("label")
                .eq("id", id)
                .single();

        if (deletedFetchError) throw deletedFetchError;
        const deletedLabel = deletedActivity.label;

        // get all activities before delete
        const { data: allActivities, error: fetchError } =
            await supabase
                .from("activity")
                .select("id, label, predecessor")
                .eq("project_id", project_id)
                .order("id");

        if (fetchError) throw fetchError;

        // delete activity
        const { error: deleteError } =
            await supabase
                .from("activity")
                .delete()
                .eq("id", id);

        if (deleteError) throw deleteError;

        const remainingActivities = allActivities.filter(act => act.id !== id);

        // update predecessors only (no relabeling!)
        for (const act of remainingActivities) {
            const updatedPredecessor = act.predecessor?.filter(
                (p: string) => p !== deletedLabel
            ) ?? [];

            const { error: updateError } =
                await supabase
                    .from("activity")
                    .update({ predecessor: updatedPredecessor })
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
            .in("id", predecessors)
            .eq("project_id", project_id)

        const predecessorsId =
            predecessorData?.map((pred) => pred.label) ?? []

        //get use labels for predecessors
        const { data: activity } = await supabase
            .from("activity")
            .select("label")
            .eq("project_id", project_id)

        const nextIndex = activity?.length ?? 0
        const availableLabel = numberToLabel(nextIndex)

        const payload = {
            activity_name: activity_name,
            project_id: project_id,
            predecessor: predecessorsId,
            expected: expected,
            label: availableLabel,
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

