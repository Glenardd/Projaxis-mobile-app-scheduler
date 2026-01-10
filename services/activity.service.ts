import { useOnRefreshByUser } from "@/hooks/useOnRefreshByUser";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface ActivityTableType {
    isRefetchingByUser: boolean
    refetchByUser: () => void
    isFetching: boolean
    isPending: boolean
    activity: ActivityObjectType[] | undefined
}

export interface ActivityObjectType {
    id: number
    created_at: Date
    activity_name: string
    optimistic: number
    most_likely: number
    pessimistic: number
    project_id: number | undefined
}

//search the project here
const useSearchActivity = (project_id : string) : ActivityTableType => {
    const fetchData = async (): Promise<ActivityObjectType[]> => {
        const { data: projects, error: projectError } = await supabase
            .from('projects')
            .select("id")
            .eq("project_name", project_id)
            .single();
    
            if(projectError) throw console.log(projectError)
    
        const { data: activity, error: activityError } = await supabase
            .from("activity")
            .select()
            .eq("project_id", projects.id);
    
            return activity || [];
    }

    const { data: activity, isFetching, dataUpdatedAt, refetch, isPending } = useQuery({
        queryKey: ['activity', project_id],
        queryFn: fetchData,
        staleTime: 1000 * 60 * 5,
    })

    const { isRefetchingByUser, refetchByUser } = useOnRefreshByUser(refetch)
    useRefreshOnFocus(refetch)

    // return cache
    return { isRefetchingByUser, refetchByUser, isFetching, isPending, activity }
}

export { useSearchActivity };

