"use client";

import { AuthContext } from "@/context/authContext";
import { redirect, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

 
  const token = useContext(AuthContext);

  if(!token){
    return <link href="/login"/>
  }

  return <>{children}</>;
}