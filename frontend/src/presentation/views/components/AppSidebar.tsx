import {
    LayoutDashboard,
    MessageSquare,
    Users,
    History,
    LogOut,
    Bell,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { cn } from "@/shared/utils/utils"
import { useNotifications } from "@/presentation/hooks/useNotifications"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/presentation/views/components/ui/sheet"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/presentation/views/components/ui/sidebar"
import useAuth from "@/application/usecases/useAuth"

export function AppSidebar() {
    const { user, logout } = useAuth()
    const { alerts, count } = useNotifications()
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

                    {/* Notificações */}
                    {user?.role === 'MORADOR' && (
                        <SidebarMenuItem>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip="Notificações"
                                        className="w-full justify-start"
                                    >
                                        <div className="relative">
                                            <Bell className="h-4 w-4" />
                                            {count > 0 && isCollapsed && (
                                                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-in fade-in zoom-in">
                                                    {count}
                                                </span>
                                            )}
                                        </div>
                                        {!isCollapsed && <span className="flex-1">Notificações</span>}
                                        {count > 0 && !isCollapsed && (
                                            <SidebarMenuBadge className="bg-destructive text-destructive-foreground">
                                                {count}
                                            </SidebarMenuBadge>
                                        )}
                                    </SidebarMenuButton>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="w-[300px] sm:w-[400px]"
                                    onCloseAutoFocus={(e) => e.preventDefault()}
                                >
                                    <SheetHeader className="border-b pb-4 mb-4">
                                        <SheetTitle className="flex items-center gap-2">
                                            <Bell className="h-5 w-5" />
                                            Notificações
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-4">
                                        {count === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-8">
                                                Nenhuma notificação importante no momento.
                                            </p>
                                        ) : (
                                            alerts.map((alert, index) => (
                                                <div
                                                    key={index}
                                                    className={cn(
                                                        "p-4 rounded-lg border flex gap-3 transition-colors",
                                                        alert.type === 'PENDING_RESPONSE'
                                                            ? "bg-yellow-50 border-yellow-100 text-yellow-800"
                                                            : "bg-blue-50 border-blue-100 text-blue-800"
                                                    )}
                                                >
                                                    <span className="text-lg">
                                                        {alert.type === 'PENDING_RESPONSE' ? '⌛' : '🔔'}
                                                    </span>
                                                    <p className="text-sm font-medium leading-tight">
                                                        {alert.message}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </SidebarMenuItem>
                    )}

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
