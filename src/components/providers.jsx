import { AuthProvider } from "@/context/authContext";
import { TaskProvider } from "@/context/taskContext";
import { UserProvider } from "@/context/userContext";

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <TaskProvider>
        <UserProvider>
          { children }
        </UserProvider>
      </TaskProvider>
    </AuthProvider>
  )
}
export default Providers;