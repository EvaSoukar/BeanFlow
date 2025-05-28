"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { useUsers } from "@/context/userContext";
import { useTasks } from "@/context/taskContext";
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import { Toast } from "./toast";

const taskSchema = z.object({
  title: z.string().nonempty({ message: "Please enter a title."}),
  description: z.string().nonempty({ message: "Description is required" }),
  deadline: z.string().nonempty({ message: "Deadline is required" }),
  assignedTo: z.string().nonempty({ message: "Assigned user is required" }),
});

export const TaskForm = () => {
  const { user, loading: authLoading } = useAuth();  // get current user and loading state
  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      assignedTo: "",
    },
  });

  const { users, loading: usersLoading } = useUsers();
  const { addTask } = useTasks();
  const [toastMessage, setToastMessage] = useState(null)

  const onSubmit = async (data) => {
    await addTask(data);
    form.reset();
    setToastMessage("Task created successfully!");
    setTimeout(() => setToastMessage(null), 3000)
  };

  if (authLoading) return <p>Loading...</p>;

  if (!user || user.role !== "admin") {
    return <p>Access denied. You do not have permission to create tasks.</p>;
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#3E3E3E]">Task Title</FormLabel>
                <FormControl>
                  <Input className="bg-[#CBB092]" placeholder="Write report" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#3E3E3E]">Description</FormLabel>
                <FormControl>
                  <Textarea className="bg-[#CBB092]" placeholder="What is the task about?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#3E3E3E]">Deadline</FormLabel>
                <FormControl>
                  <Input className="bg-[#CBB092]" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#3E3E3E]">Assign To</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={usersLoading}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#CBB092]">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(users || []).map((user) => (
                      <SelectItem key={user.uid} value={user.uid}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-[#3E3E3E] w-full text-[#F5F3F0] font-bold" disabled={usersLoading}>
            Create Task
          </Button>
        </form>
      </Form>
      {toastMessage && <Toast message={toastMessage} />}
    </>
  );
};