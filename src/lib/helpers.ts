import { TodoType, filtersType } from "@/lib/types";

export function filterTodos(
  todos: TodoType[],
  searchQuery: string,
  filterBy: filtersType
): TodoType[] {
  const filteredTodos = todos.filter((todo) => {
    const matchesFilter = filterBy === "all" || todo.status === filterBy;
    const matchesSearch = todo.body
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });
  return filteredTodos;
}
