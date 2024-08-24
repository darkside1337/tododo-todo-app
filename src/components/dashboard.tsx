"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import Navbar from "@/components/navbar";
import Todos from "@/components/todos";
import { filterTodos } from "@/lib/helpers";
import { TodoType, filtersType } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import AddTodoDialog from "./add-todo-dialog";
import { fetchTodos } from "@/data/actions";
import EmptyTodosImage from "@/assets/empty-todos-image.svg";
import Image from "next/image";
//

const Dashboard = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);

  const [filterBy, setFilterBy] = useState<filtersType>("all");

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [debouncedSearchQuery] = useDebounceValue(searchQuery, 500);

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, debouncedSearchQuery, filterBy);
  }, [filterBy, debouncedSearchQuery, todos]);

  const fetchTodosData = async () => {
    const fetchedTodos = await fetchTodos();
    setTodos(fetchedTodos);
  };
  useEffect(() => {
    fetchTodosData();
  }, []);

  return (
    <MaxWidthWrapper className="relative min-w-auto md:min-w-[800px] py-8 md:py-12">
      <Navbar
        setFilterBy={setFilterBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {todos.length === 0 ? (
        <Image src={EmptyTodosImage} alt="Empty todos image" />
      ) : (
        <Todos todos={filteredTodos} refetchTodos={fetchTodosData} />
      )}

      <AddTodoDialog onAddTodo={fetchTodosData} />
    </MaxWidthWrapper>
  );
};
export default Dashboard;
