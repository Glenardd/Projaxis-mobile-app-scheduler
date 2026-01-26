import { useOnRefreshByUser } from "@/hooks/useOnRefreshByUser"
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus"
import { supabase } from "@/lib/supabase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface ProjectTableType {
    isRefetchingByUser: boolean
    refetchByUser: () => void
    isLoading: boolean
    projects: ProjectObjectType[] | undefined
    isPending: boolean
}

export interface ProjectObjectType {
    id: number
    created_at: string
    project_name: string
    user_id: string,
}

// list of all projects
const useViewProjects = (): ProjectTableType => {

    // fetch
    const fetchProjects = async (): Promise<ProjectObjectType[]> => {
        const { data: projects } = await supabase.from('projects').select()
        return projects || []
    }

    // query cache
    const { data: projects, isFetching, dataUpdatedAt, refetch, isPending, isLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: fetchProjects,
        staleTime: 1000 * 60 * 60 * 24,
        refetchOnMount: "always"
    })

    // for refetching data
    const { isRefetchingByUser, refetchByUser } = useOnRefreshByUser(refetch)
    useRefreshOnFocus(refetch)

    // return cache
    return { isRefetchingByUser, refetchByUser, isLoading, projects, isPending }
}

//search project by id
const useProjectById = (id: number) => {
    const fetchProjects = async (): Promise<ProjectObjectType> => {
        const { data: projects } = await supabase.from('projects').select().eq("id", id).single()
        return projects
    }

    // query cache
    const { data: searchProject } = useQuery({
        queryKey: ["projects", id],
        queryFn: fetchProjects,
        staleTime: 1000 * 60 * 60 * 24,
        refetchOnMount: "always"
    })
    
    return { searchProject }
}

// insert data and mutate or update data
const useInsertProject = () => {
    const queryClient = useQueryClient()

    const addProject = async (projectName: string) => {

        // get the user
        const {
            data: { user },
        } = await supabase.auth.getUser(); // user is an object

        // json data payload
        const payload = {
            project_name: projectName,
            user_id: user?.id
        }

        // insert data
        const { data: projects, error } = await supabase
            .from('projects')
            .insert([payload]) // wrap in array
            .select()

        // console.log('Inserted project:', projects)

        // error checking
        if (error) throw error
        return projects
    }

    // updates the data
    const { mutate: updatedProject, isPending, isSuccess, error: error_mutation } = useMutation({
        mutationFn: addProject,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
                exact: false
            })
        }
    })

    // error mutation checks
    if (error_mutation) throw error_mutation
    return { updatedProject, isPending }
}

export { useInsertProject, useProjectById, useViewProjects }

