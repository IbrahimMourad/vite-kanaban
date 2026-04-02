import { useMemo } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createTask, getTasks, deleteTask, updateTask } from "../api/tasks";
const TASKS_QUERY_KEY = ["tasks"];

export function useTasks(search) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: getTasks,
    placeholderData: keepPreviousData,
    select: (data) => (Array.isArray(data) ? data : (data?.tasks ?? [])),
  });

  const filteredTasks = useMemo(() => {
    const normalizedSearch = (search ?? "").toLowerCase();

    return tasksQuery.data?.filter((task) => {
      const title = (task?.title ?? "").toLowerCase();
      const description = (task?.description ?? "").toLowerCase();
      return (
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch)
      );
    });
  }, [tasksQuery.data, search]);

  const createMutation = useMutation({
    mutationFn: (payload) => createTask(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, task }) => updateTask(id, task),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTask(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
  });

  function moveTask(task, column) {
    if (task.column === column) return;
    updateMutation.mutate({
      id: task.id,
      task: {
        title: task.title,
        description: task.description,
        column,
      },
    });
  }

  return {
    tasks: filteredTasks,
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    createTask: createMutation.mutateAsync,
    updateTask: (id, task) => updateMutation.mutateAsync({ id, task }),
    deleteTask: deleteMutation.mutateAsync,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    moveTask,
  };
}
