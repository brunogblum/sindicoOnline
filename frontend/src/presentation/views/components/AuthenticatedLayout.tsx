import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/presentation/views/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Separator } from "./ui/separator"

interface AuthenticatedLayoutProps {
    children: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex-1">
                        {/* Espaço para pães de cristo ou informações específicas da página */}
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-muted/20">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
