"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { authClient } from "~/lib/auth-client"
import { Toaster } from "~/components/ui/sonner"
import { ThemeProvider } from "~/components/theme-provider"


export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <AuthUIProvider
                authClient={authClient as any}
                navigate={router.push}
                replace={router.replace}
                onSessionChange={() => {
                    // Clear router cache (protected routes)
                    router.refresh()
                }}
                Link={Link}
            >
                {children}
                <Toaster />
            </AuthUIProvider>
        </ThemeProvider>
    )
}