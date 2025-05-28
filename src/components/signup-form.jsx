"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { useState } from "react";
import { useAuth } from "@/context/authContext";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().nonempty({ message: "Please enter a password."})
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().nonempty({ message: "Please repeat your password" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const SignupForm = () => {
  const { signup } = useAuth();
  const router = useRouter();
  const [firebaseError, setFirebaseError] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
  
  const onSubmit = async (values) => {
    try {
      setFirebaseError("");
      await signup(values.email, values.password, values.name);
      router.push("/dashboard");
    } catch (error) {
      setFirebaseError(error.message || "Signup failed");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#3E3E3E]">Name</FormLabel>
              <FormControl><Input {...field} placeholder="Your full name" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#3E3E3E]">Email</FormLabel>
              <FormControl><Input {...field} type="email" placeholder="email@example.com" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#3E3E3E]">Password</FormLabel>
              <FormControl><Input {...field} type="password" placeholder="Enter password" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#3E3E3E]">Repeat Password</FormLabel>
              <FormControl><Input {...field} type="password" placeholder="Repeat password" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {firebaseError && <p className="text-red-500 text-sm">{firebaseError}</p>}

        <Button type="submit" className="bg-[#3E3E3E] w-full text-[#F5F3F0] font-bold">Sign Up</Button>
      </form>
    </Form>
  )
}