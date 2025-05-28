"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/context/authContext";
import { TaskForm } from "@/components/task-form";

const CreateTaskPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Navigate to Home if not admin
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-3xl mx-auto px-6 py-16 mt-32 sm:mt-12 rounded-lg bg-[#F5F3F0]">
        <h2 className="text-2xl sm:text-2xl text-center font-extrabold text-[#3E3E3E]">Create New Task</h2>
        <TaskForm />
      </main>
    </div>
  );
}
export default CreateTaskPage;