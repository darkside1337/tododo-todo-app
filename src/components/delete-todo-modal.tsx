import { TodoType } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { deleteTodo } from "@/data/actions";
import { useAction } from "next-safe-action/hooks";
import { ReloadIcon } from "@radix-ui/react-icons";
const DeleteTodoModal = ({
  currentActiveTodo,
  modalStatus,
  setDeleteModalStatus,
  refetchTodos,
}: {
  currentActiveTodo: TodoType | null;
  modalStatus: boolean;
  setDeleteModalStatus: Dispatch<SetStateAction<boolean>>;
  refetchTodos: () => Promise<void>;
}) => {
  const { execute, isPending } = useAction(deleteTodo, {
    onSuccess: () => {
      setDeleteModalStatus(false);
      refetchTodos();
    },
  });

  function handleSubmit() {
    execute({ id: currentActiveTodo?.id as string });
  }

  return (
    <Dialog open={modalStatus} onOpenChange={setDeleteModalStatus}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Todo</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this todo?
          </DialogDescription>
        </DialogHeader>
        <div>
          <h2>{currentActiveTodo?.body}</h2>
        </div>
        <div>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <ReloadIcon className="h-4 w-4 animate-spin" />
            ) : (
              "Delete Todo"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTodoModal;
