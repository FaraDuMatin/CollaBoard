"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
    AuthLoading,
    Authenticated,
    ConvexReactClient,
} from "convex/react";
import { Loading } from "@/components/auth/loading";


interface ConvexClientProviderProps {
    children: React.ReactNode;
}

const convexUrl =  process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({ children }: ConvexClientProviderProps) => {
    // The guest board works without an account
    const isGuestPage = usePathname()?.startsWith("/guest");

    return (
        <ClerkProvider>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                {isGuestPage ? children : (
                    <>
                        <Authenticated>
                            {children}
                        </Authenticated>
                        <AuthLoading>
                            <Loading />
                        </AuthLoading>
                    </>
                )}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
};