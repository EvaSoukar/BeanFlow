"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Navigate to Login
  const handleClick = () => {
    router.push("/login")
  }

  // Navigate to Dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;
  if (user) return null;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[url('/home-bg.jpg')] bg-cover bg-center">
      <main className="flex flex-col items-center justify-center row-start-2 text-center sm:items-start sm:text-left gap-8">
        <div className="max-w-xl space-y-4 bg-[#F5F3F0]/90 p-6 sm:p-8 text-center rounded-2xl shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#6F4E37]">Welcome to BeanFlow Team Portal!</h1>
          <p className="sm:text-lg text-[#3E3E3E] font-semibold">Keep the flow smooth and the beans brewing!
            Here at BeanFlow, our task dashboard helps managers and team members stay on top of daily goals, 
            coffee deliveries, staff duties, and more. Whether you're brewing espresso or scheduling shifts, everything starts here.
          </p>
          <Button onClick={handleClick} className="bg-[#3E3E3E] w-full sm:p-6 text-[#F5F3F0] font-bold text-lg">Login to see your tasks!</Button>
        </div>
      </main>
    </div>
  );
}

