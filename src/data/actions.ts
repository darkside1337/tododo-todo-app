"use server";

import prisma from "@/lib/db";
import { actionClient } from "@/lib/safe-actions";
import { todoSchema } from "@/lib/schema";
import { flattenValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function fetchTodos() {
  const todos = await prisma.todo.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return todos;
}

export const createTodo = actionClient
  .schema(todoSchema)
  .action(async ({ parsedInput: { body, status } }) => {
    try {
      const createdTodo = await prisma.todo.create({
        data: {
          body,
          status,
        },
      });
      revalidatePath("/");
      return { data: createdTodo };
    } catch (error) {
      return { error: "Failed to create todo. Please try again later." };
    }
  });
export const editTodo = actionClient
  .schema(todoSchema)
  .action(async ({ parsedInput: { body, status, id } }) => {
    try {
      const todo = await prisma.todo.findFirst({
        where: {
          id,
        },
      });

      if (!todo) {
        return { error: "Todo not found" };
      }

      const updatedTodo = await prisma.todo.update({
        where: {
          id,
        },
        data: {
          body,
          status,
        },
      });

      return { data: updatedTodo };
    } catch (error) {
      console.log("Error updating todo", error);
      return { error: "Failed to update todo. Please try again later." };
    }
  });

export const deleteTodo = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const todo = await prisma.todo.findFirst({
        where: {
          id,
        },
      });

      if (!todo) {
        return { error: "Todo not found" };
      }

      const deletedTodo = await prisma.todo.delete({
        where: {
          id,
        },
        select: {
          id: true,
          body: true,
        },
      });

      revalidatePath("/");
      return {
        data: deletedTodo,
      };
    } catch (error) {
      return { error: "Failed to delete todo. Please try again later." };
    }
  });
