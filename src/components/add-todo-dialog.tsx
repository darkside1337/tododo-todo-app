import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
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
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { createTodo } from "@/data/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

/* 

*/

const AddTodoDialog = ({ onAddTodo }: { onAddTodo: () => Promise<void> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      body: "",
      status: "incomplete",
    },
  });

  const { execute, result, isPending } = useAction(createTodo, {
    onSuccess: ({ data }) => {
      setIsOpen(false);
      onAddTodo();
      router.refresh();
    },
    onError: ({ error }) => {
      console.log(error);
    },
  });

  function onSubmit(data: z.infer<typeof todoSchema>) {
    execute({
      body: data.body,
      status: data.status,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="absolute -bottom-4 -right-4">
        <Button variant={"outline"} size="icon" className="rounded-full">
          <PlusIcon className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Add Todo:</DialogTitle>
          <DialogDescription>
            Enter the todo title, and select its status:
          </DialogDescription>
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
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                ) : (
                  "Add Todo"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoDialog;
