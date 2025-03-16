"use client";
import { useAuthStore } from '@/stores/Auth';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login"); // Redirect if not logged in
  }, [session, status, router]);
  const { checkSession, isAuthenticated, isLoading, user } = useAuthStore();


  console.log(user)
  useEffect(() => {
    checkSession();
  }, [checkSession]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user?.email}!</p>
      
      <button onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Phone: {user?.phone}</p>
      {/* Display other user information */}
    </div>
    </div>
  );
}

