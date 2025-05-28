"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { collection, onSnapshot, orderBy, query, where, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const loadTasks = () => {
      if (!user || !user.uid || !user.role) {
        setTasks([]);
        setLoading(false);
        return;
      }

      const tasksRef = collection(db, "tasks");
      const q =
        user.role === "admin"
          ? query(tasksRef, orderBy("createdAt", "desc"))
          : query(
              tasksRef,
              where("assignedTo", "==", user.uid),
              orderBy("createdAt", "desc")
            );

      setLoading(true);
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetched = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(fetched);
          setLoading(false);
        },
        (error) => {
          console.error("Firestore snapshot error:", error);
          setTasks([]);
          setLoading(false);
        }
      );
    };

    if (!authLoading) {
      loadTasks();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, authLoading]);

  const addTask = async (task) => {
    const newTask = {
      ...task,
      completed: false,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, "tasks"), newTask);
  };

  const markTaskComplete = async (taskId) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { completed: true });
  };

  const markTaskIncomplete = async (taskId) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { completed: false });
  };

  const deleteTask = async (taskId) => {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
  };

  const value = {
    tasks,
    loading,
    addTask,
    markTaskComplete,
    markTaskIncomplete,
    deleteTask
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
export const useTasks = () => useContext(TaskContext);