import { useOnRefreshByUser } from "@/hooks/useOnRefreshByUser"
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus"
import { supabase } from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"

interface ProjectTableType {
    isRefetchingByUser: boolean
    refetchByUser: () => void
    isFetching: boolean
    isPending: boolean
    projects: ProjectObjectType[] | undefined
}

export interface ProjectObjectType{
    id: number
    created_at: string
    project_name: string
    user_id: string,
}

// view list of projects
const useProjects = () : ProjectTableType =>{

    //fetch
    const fetchProjects = async () : Promise<ProjectObjectType[]> => {
        const { data: projects } = await supabase.from('projects').select()
        return projects || []
    }

    //query cache
    const { data: projects, isFetching, dataUpdatedAt, refetch, isPending } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
        staleTime: 1000 * 60 * 5,
    })

    // for refetching data
    const { isRefetchingByUser, refetchByUser } = useOnRefreshByUser(refetch)
    useRefreshOnFocus(refetch)

    // return cache
    return { isRefetchingByUser, refetchByUser, isFetching, isPending, projects }
}

export { useProjects }

