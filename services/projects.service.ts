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

interface UseProjectByIdReturn {
    searchProject: ProjectObjectType | undefined
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
const useProjectById = (id: number): UseProjectByIdReturn => {
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

        if (error) throw error;
        const projectId = projects[0].id

        // add starting node
        const startingActivites = [
            {
                activity_name: "START",
                project_id: projectId,
                predecessor: [],      
                label: "A",
                expected: 0,
                optimistic: 0,
                most_likely: 0,
                pessimistic: 0,
                isDone: false,
            }
        ];

        const { error: actError } = await supabase
            .from("activity")
            .insert(startingActivites);

        if (actError) throw actError;

        // error checking
        if (error) throw error
        return projects
    }

    // updates the data
    const { mutate: insertProject, isPending, isSuccess, error: error_mutation } = useMutation({
        mutationFn: addProject,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["activity"],
                exact: false
            });
        }
    })

    // error mutation checks
    if (error_mutation) throw error_mutation
    return { insertProject, isPending }
}

const useDeleteProject = () => {
    const queryClient = useQueryClient()

    const deleteProjectById = async (id: number) => {
        const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", id)

        if (error) throw error
        return id
    }

    const { mutate: deleteProject, isPending } = useMutation({
        mutationFn: deleteProjectById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
                exact: false
            })
        }
    })

    return { deleteProject, isPending }
}

//project name update only
const useUpdateProject = () => {
    const queryClient = useQueryClient();

    const updateProjectName = async ({
        id,
        project_name,
    }: {
        id: number;
        project_name: string;
    }) => {
        const { data, error } = await supabase
            .from("projects")
            .update({ project_name })
            .eq("id", id)
            .select();

        if (error) throw error;
        return data;
    };

    const { mutate: updateProject, isPending, isSuccess } = useMutation({
        mutationFn: updateProjectName,
        onSuccess: (_, variable) => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
                exact: false,
            });

            // ✅ also invalidate single project query
            queryClient.invalidateQueries({
                queryKey: ["projects", variable.id],
            });
        },
    });

    return { updateProject, isPending, isSuccess };
};

//duplicates project
const useDuplicateProject = () => {
    const queryClient = useQueryClient()

    const duplicateProject = async (projectId: number) => {

        const { data: project, error: projectError } = await supabase
            .from("projects")
            .select("project_name, user_id")
            .eq("id", projectId)
            .single()

        if (projectError) throw projectError;
        if (!project) return

        const newName = project.project_name + " (Copy)";

        const { data: newProject, error: insertError } = await supabase
            .from("projects")
            .insert([{ project_name: newName, user_id: project.user_id }])
            .select()
            .single()

        if (insertError) throw insertError;
        if (!newProject) return;

        const newProjectId = newProject.id;

        const { data: activities, error: actError } = await supabase
            .from("activity")
            .select("*")
            .eq("project_id", projectId);

        if (actError) throw actError;

        if (activities && activities.length > 0) {

            const duplicates = activities.map((act) => ({
                activity_name: act.activity_name,
                project_id: newProjectId,
                predecessor: act.predecessor ?? [],
                label: act.label,
                isDone: act.isDone,
                optimistic: act.optimistic,
                most_likely: act.most_likely,
                pessimistic: act.pessimistic,
                expected: act.expected
            }))

            const { error: bulkError } = await supabase
                .from("activity")
                .insert(duplicates);

            if (bulkError) throw bulkError;
        }

        return newProject
    }

    const { mutate: duplicate, isPending } = useMutation({
        mutationFn: duplicateProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"], exact: false })
            queryClient.invalidateQueries({ queryKey: ["activity"], exact: false })
        },
    })

    return { duplicate, isPending }
};

export { useDeleteProject, useDuplicateProject, useInsertProject, useProjectById, useUpdateProject, useViewProjects }

