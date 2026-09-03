"use client";

"use client";

import { AuthContext } from "@/context/authContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

 
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!auth?.isLoading && !auth?.isAuthenticated) {
      router.replace('/login');
    }
  }, [auth, router]);

  if (!auth || auth.isLoading || !auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="protected-shell">
      <header className="site-nav">
        <Link className="site-nav__brand" href="/Home">localEvent</Link>
        <nav className="site-nav__links" aria-label="Main navigation">
          <Link href="/Home">Home</Link>
          <Link href="/event">Events</Link>
          <Link href="/Category">Categories</Link>
          <Link href="/chat">Chat</Link>
        </nav>
        <button className="site-nav__logout" type="button" onClick={auth.logout}>
          Log out
        </button>
      </header>
      <div className="protected-content">{children}</div>
      <footer className="site-footer">
        <span>localEvent</span>
        <span>Find your next good night out.</span>
      </footer>
    </div>
  );
}