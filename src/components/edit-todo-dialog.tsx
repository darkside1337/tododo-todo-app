import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoSchema } from "@/lib/schema";
import { Switch } from "./ui/switch";
import { editTodo } from "@/data/actions";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { TodoType } from "@/lib/types";
import { Button } from "./ui/button";

function EditTodoModal({
  currentActiveTodo,
  modalStatus,
  setEditModalStatus,
  refetchTodos,
}: {
  currentActiveTodo: TodoType | null;
  modalStatus: boolean;
  setEditModalStatus: Dispatch<SetStateAction<boolean>>;
  refetchTodos: () => Promise<void>;
}) {
  const form = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      body: currentActiveTodo?.body || "",
      status: currentActiveTodo?.status || "incomplete",
    },
  });
  const router = useRouter();

  const { execute, result, isPending } = useAction(editTodo, {
    onSuccess: () => {
      setEditModalStatus(false);
      refetchTodos();
      router.refresh();
    },
  });

  function onSubmit(data: z.infer<typeof todoSchema>) {
    execute({
      body: data.body,
      status: data.status,
      id: currentActiveTodo?.id,
    });
  }

  useEffect(() => {
    if (currentActiveTodo) {
      form.reset({
        body: currentActiveTodo?.body || "",
        status: currentActiveTodo?.status || "incomplete",
      });
    }
  }, [currentActiveTodo, form]);

  return (
    <Dialog open={modalStatus} onOpenChange={setEditModalStatus}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Edit Todo:</DialogTitle>
          <DialogDescription>Enter the new data:</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Body:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Status:</FormLabel>
                    <FormControl>
                      <>
                        <Switch
                          {...field}
                          checked={field.value === "complete"}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? "complete" : "incomplete")
                          }
                          // make the switch turn blue when its checked
                          className="data-[state=checked]:bg-blue-400 data-[state=unchecked]:bg-red-500"
                        />
                        <span>
                          {field.value === "incomplete"
                            ? "Incomplete"
                            : "Complete"}
                        </span>
                      </>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant={isPending ? "outline" : "default"}
                disabled={isPending}
                type="submit"
                className={`${!isPending && "bg-blue-400"}`}
                size={isPending ? "icon" : "default"}
              >
                {isPending ? (
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Todo"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default EditTodoModal;
