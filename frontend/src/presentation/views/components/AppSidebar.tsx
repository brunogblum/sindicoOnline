import {
    LayoutDashboard,
    MessageSquare,
    Users,
    History,
    LogOut,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { cn } from "@/shared/utils/utils"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/presentation/views/components/ui/sidebar"
import useAuth from "@/application/usecases/useAuth"

export function AppSidebar() {
    const { user, logout } = useAuth()
    const location = useLocation()
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"

    const items = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Reclamações",
            url: "/complaints",
            icon: MessageSquare,
        },
    ]

    // Add items based on roles
    if (['ADMIN', 'SINDICO'].includes(user?.role || '')) {
        items.push({
            title: "Usuários",
            url: "/users",
            icon: Users,
        })
    }

    if (user?.role === 'ADMIN') {
        items.push({
            title: "Auditoria",
            url: "/admin/audit-logs",
            icon: History,
        })
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className={cn("border-b px-6 py-4", isCollapsed && "px-2")}>
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                        S
                    </div>
                    {!isCollapsed && <span className="font-semibold text-lg truncate">SindicoOnline</span>}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    {!isCollapsed && <SidebarGroupLabel>Navegação</SidebarGroupLabel>}
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.url}
                                        tooltip={item.title}
                                    >
                                        <Link to={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            {!isCollapsed && <span>{item.title}</span>}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className={cn("border-t p-4", isCollapsed && "p-2")}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className={cn("flex items-center gap-3 px-2 py-2", isCollapsed && "px-0 justify-center")}>
                            <div className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted transition-all",
                                isCollapsed && "h-8 w-8"
                            )}>
                                <Users className={cn("h-5 w-5 text-muted-foreground", isCollapsed && "h-4 w-4")} />
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm font-medium truncate">{user?.id || 'Usuário'}</span>
                                    <span className="text-xs text-muted-foreground truncate">{user?.role}</span>
                                </div>
                            )}
                        </div>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={logout}
                            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                            tooltip="Sair"
                        >
                            <LogOut className="h-4 w-4" />
                            {!isCollapsed && <span>Sair</span>}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
