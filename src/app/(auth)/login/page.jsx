"use client";

import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  
  // Function to navigate to Signup
  const handleClick = () => {
    router.push("/signup");
  };
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-[#CBB092]">
      <main className="flex flex-col items-center justify-center row-start-2 text-center sm:items-start sm:text-left gap-8">
        <div className="max-w-xl space-y-4 bg-[#F5F3F0] p-6 sm:p-8 text-center rounded-2xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3E3E3E]">Login</h2>
          <LoginForm />
          <p className="text-sm text-[#6BA368] font-semibold">Don't have an account yet?</p>
          <Button onClick={handleClick} type="button" className="bg-[#3E3E3E]/80 w-full text-[#F5F3F0] font-bold">Sign up here!</Button>
        </div>
       </main>
    </div>
  )
}
export default LoginPage;