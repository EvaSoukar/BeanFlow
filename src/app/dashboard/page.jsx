"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { useTasks } from "@/context/taskContext";
import { useUsers } from "@/context/userContext";
import { useState } from "react";

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading, markTaskComplete, markTaskIncomplete, deleteTask } = useTasks();
  const { users, loading: usersLoading } = useUsers();

  const [filterUserId, setFilterUserId] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const TASKS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  if (authLoading || tasksLoading || usersLoading) return <p className="text-center text-2xl">Loading...</p>;
  if (!user) return <p>Please log in to see the dashboard.</p>;

  // Create userId to name map
  const userIdToName = {};
  users.forEach((u) => {
    userIdToName[u.uid] = u.name || u.email;
  });

  // Filter tasks
  let filteredTasks = [...tasks];

  if (user.role === "admin" && filterUserId) {
    filteredTasks = filteredTasks.filter((task) => task.assignedTo === filterUserId);
  }
  if (filterDate) {
    filteredTasks = filteredTasks.filter((task) => task.deadline >= filterDate);
  }
  if (filterStatus === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed === true);
  } else if (filterStatus === "uncompleted") {
    filteredTasks = filteredTasks.filter((task) => task.completed === false);
  }
  // Sort tasks
  filteredTasks.sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return dateB - dateA;
  });

  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );

  const toggleCompletion = async (task) => {
    if (task.completed) {
      await markTaskIncomplete(task.id);
    } else {
      await markTaskComplete(task.id);
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-[#F5F3F0] text-[#3E3E3E]">
      <main className="max-w-6xl mt-24 sm:mt-12 mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#6F4E37]">
          Welcome to your dashboard, {user.name || user.email}!
        </h1>
        {user.role === "admin" && (
          <section className="mb-6 border p-4 rounded bg-[#CBB092]">
            <h2 className="text-xl font-semibold mb-2">Filter Tasks</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col">
                <label htmlFor="filterUser" className="font-medium mb-1">User</label>
                <select id="filterUser" value={filterUserId} className="border rounded px-2 py-1 bg-[#F5F3F0]"
                  onChange={(e) => {
                    setFilterUserId(e.target.value);
                    setCurrentPage(1);
                  }}>
                  <option value="">All Users</option>
                  {users.map((u) => (
                    <option key={u.uid} value={u.uid}>{u.name || u.email}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="filterDate" className="font-medium mb-1">Deadline on or after</label>
                <input type="date" id="filterDate" value={filterDate} className="border rounded px-2 py-1 bg-[#F5F3F0]"
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                    setCurrentPage(1);
                  }}/>
              </div>
              <div className="flex flex-col">
                <label htmlFor="filterStatus" className="font-medium mb-1">Status</label>
                <select id="filterStatus" value={filterStatus} className="border rounded px-2 py-1 bg-[#F5F3F0]"
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}>
                  <option value="">All</option>
                  <option value="completed">Completed</option>
                  <option value="uncompleted">Uncompleted</option>
                </select>
              </div>
            </div>
          </section>
        )}
        <section>
          <h2 className="text-xl font-bold mb-4">{user.role === "admin" ? "All Tasks:" : "Your Tasks:"}</h2>
          {paginatedTasks.length === 0 ? (
            <p className="text-xl font-bold text-[#D2691E]">No tasks found.</p>
          ) : (
            <ul className="space-y-4">
              {paginatedTasks.map((task) => {
                const assignedUserName =
                  user.role === "admin"
                    ? userIdToName[task.assignedTo] || task.assignedTo
                    : "You";

                return (
                  <li key={task.id} className={`p-4 border rounded-md flex flex-col gap-4 sm:gap-0 sm:flex-row sm:justify-between sm:items-center ${task.completed ? "bg-[#6BA368]/40" : "bg-white"}`}>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-[#6F4E37]">{task.title}</h3>
                      <p className="max-w-3/4">{task.description}</p>
                      <p><span className="font-bold">Deadline:</span> {task.deadline}</p>
                      {user.role === "admin" && <p><span className="font-bold">Assigned To:</span> {assignedUserName}</p>}
                      <p><span className="font-bold">Status:</span> {" "}{task.completed ? "Completed" : "Pending"}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => toggleCompletion(task)} className={`${task.completed ? "bg-[#6BA368] hover:bg-[#4e764b]" : "bg-[#3E3E3E] hover:bg-[#3E3E3E]/80"} text-white`}>
                        {task.completed ? "Mark Uncompleted" : "Mark Completed"}
                      </Button>
                      {
                        user.role === "admin" && (
                        <Button onClick={() => deleteTask(task.id)} className="bg-[#3E3E3E] hover:bg-[#3E3E3E]/80 text-white">
                          Delete
                        </Button>)
                      }
                    </div>
                    
                  </li>
                );
              })}
            </ul>
          )}
        </section>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <nav className="mt-6 flex justify-center items-center gap-4">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">
              Next
            </button>
          </nav>
        )}
      </main>
    </div>
  );
}
export default DashboardPage;