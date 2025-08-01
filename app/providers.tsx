// File: app/providers.tsx

"use client"; // This component must be a client component

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface AppProvidersProps {
  children: React.ReactNode;
  session: null; // NextAuth session object, passed from server
}

export function AppProviders({ children, session }: AppProvidersProps) {
  // Use a state to ensure the query client is only created once per component lifecycle
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
}