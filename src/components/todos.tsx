import { TodoType } from "@/lib/types";
import { Checkbox } from "./ui/checkbox";
import { TrashIcon, Pencil2Icon, UpdateIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import EditTodoModal from "./edit-todo-dialog";
import { useState } from "react";

import { editTodo } from "@/data/actions";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import DeleteTodoModal from "./delete-todo-modal";
//

function TodoItem({
  body,
  status,
  id,
  setCurrentActiveTodoId,
  openEditModal,
  refetchTodos,
  openDeleteModal,
}: {
  body: string;
  status: "complete" | "incomplete";
  id?: string;
  setCurrentActiveTodoId: (id: string) => void;
  refetchTodos: () => Promise<void>;
  openEditModal: () => void;
  openDeleteModal: () => void;
}) {
  const router = useRouter();
  const onClickEdit = () => {
    setCurrentActiveTodoId(id as string);
    openEditModal();
  };

  const onClickDelete = () => {
    setCurrentActiveTodoId(id as string);
    openDeleteModal();
  };

  const { execute, result, isPending } = useAction(editTodo, {
    onSuccess: () => {
      refetchTodos();
    },
  });

  function handleToggle() {
    execute({
      body,
      status: status === "complete" ? "incomplete" : "complete",
      id,
    });
  }

  return (
    <div className="border border-black flex gap-8 items-center px-3 py-2 justify-between">
      <div className="flex gap-4">
        <Checkbox
          className="size-6"
          checked={status === "complete"}
          disabled={isPending}
          onCheckedChange={handleToggle}
        />
        <h1 className={`${status === "complete" ? "line-through" : ""}`}>
          {body}
        </h1>
      </div>
      <div className="flex gap-2">
        <Button variant={"outline"} size="icon" onClick={onClickDelete}>
          <TrashIcon className="size-5" stroke="red" strokeWidth={0.5} />
        </Button>
        <Button variant={"outline"} size="icon" onClick={onClickEdit}>
          <Pencil2Icon className="size-5" stroke="#005ce6" strokeWidth={0.5} />
        </Button>
      </div>
    </div>
  );
}

const Todos = ({
  todos,
  refetchTodos,
}: {
  todos: TodoType[];
  refetchTodos: () => Promise<void>;
}) => {
  const [currentActiveTodoId, setCurrentActiveTodoId] = useState<string | null>(
    null
  );

  const [editModalStatus, setEditModalStatus] = useState(false);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);

  const currentActiveTodo =
    todos.find((todo) => todo.id === currentActiveTodoId) || null;

  const toggleModalStatus = () => {
    setEditModalStatus(!editModalStatus);
  };

  const toggleDeleteStatus = () => {
    setDeleteModalStatus(!deleteModalStatus);
  };
  return (
    <>
      <EditTodoModal
        currentActiveTodo={currentActiveTodo}
        modalStatus={editModalStatus}
        setEditModalStatus={setEditModalStatus}
        refetchTodos={refetchTodos}
      />
      <DeleteTodoModal
        currentActiveTodo={currentActiveTodo}
        modalStatus={deleteModalStatus}
        setDeleteModalStatus={setDeleteModalStatus}
        refetchTodos={refetchTodos}
      />
      <div className="border border-black">
        {todos.map(({ id, body, status }) => (
          <TodoItem
            key={id}
            status={status}
            body={body}
            id={id}
            setCurrentActiveTodoId={setCurrentActiveTodoId}
            openEditModal={toggleModalStatus}
            openDeleteModal={toggleDeleteStatus}
            refetchTodos={refetchTodos}
          />
        ))}
      </div>
    </>
  );
};

export default Todos;
