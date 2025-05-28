"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "./authContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    if (!user || user.role !== "admin") {
      setUsers([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const allUsers = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
      }));
      setUsers(allUsers);
      setLoading(false);
    }, (error) => {
      console.error("Firestore users snapshot error:", error);
      setUsers([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  const value = {
    users,
    loading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
export const useUsers = () => useContext(UserContext);