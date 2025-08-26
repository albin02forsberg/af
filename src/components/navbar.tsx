"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Folder, Users, Settings, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { OrganizationSwitcher, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuBadge,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";

export function Navbar() {
    const { state } = useSidebar();
    const isExpanded = state === "expanded";
    const pathname = usePathname();

    const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

    return (
        <TooltipProvider delayDuration={200}>
            <Sidebar collapsible="icon" className="border-r bg-background text-foreground">
                        <SidebarHeader className="px-4 py-3 group-data-[collapsible=icon]:group-data-[state=collapsed]:px-0">
                            <div className="flex items-center justify-between group-data-[collapsible=icon]:group-data-[state=collapsed]:justify-center">
                                <Link
                                    href="/"
                                    className={`overflow-hidden transition-all ${isExpanded ? "w-32" : "w-0"} group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden`}
                                >
                            <span className="font-bold text-xl">My App</span>
                        </Link>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                        <SidebarTrigger className="size-8 p-0" />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>{isExpanded ? "Collapse" : "Expand"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </SidebarHeader>

                    <SidebarSeparator className="mx-0 w-full" />

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className={`${isExpanded ? "opacity-100" : "opacity-0"} transition-opacity`}>
                            Main
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                                              <SidebarMenu className="mt-2 px-2 group-data-[collapsible=icon]:px-0">
                                                                <SidebarMenuItem>
                                                                                        <SidebarMenuButton
                                                                        asChild
                                                                        tooltip="Dashboard"
                                                                        isActive={isActive("/")}
                                                                                            className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0"
                                                                    >
                                                        <Link href="/" className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                                                            <LayoutDashboard className="h-5 w-5" />
                                                            <span>Dashboard</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuBadge>New</SidebarMenuBadge>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                                                        <SidebarMenuButton
                                                                        asChild
                                                                        tooltip="Projects"
                                                                        isActive={isActive("/projects")}
                                                                                            className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0"
                                                                    >
                                                        <Link href="/projects" className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                                                            <Folder className="h-5 w-5" />
                                                            <span>Projects</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                                                        <SidebarMenuButton
                                                                        asChild
                                                                        tooltip="Team"
                                                                        isActive={isActive("/team")}
                                                                                            className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0"
                                                                    >
                                                        <Link href="/team" className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                                                            <Users className="h-5 w-5" />
                                                            <span>Team</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                                                        <SidebarMenuButton
                                                                        asChild
                                                                        tooltip="Billing"
                                                                        isActive={isActive("/billing")}
                                                                                            className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0"
                                                                    >
                                                        <Link href="/billing" className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                                                            <CreditCard className="h-5 w-5" />
                                                            <span>Billing</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                                                        <SidebarMenuButton
                                                                        asChild
                                                                        tooltip="Settings"
                                                                        isActive={isActive("/settings")}
                                                                                            className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0"
                                                                    >
                                                        <Link href="/settings" className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                                                            <Settings className="h-5 w-5" />
                                                            <span>Settings</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="px-2 py-3">
                    <SignedOut>
                        <div className="flex flex-col gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SignInButton>
                                        <Button variant="ghost" size="sm" className={`justify-start ${!isExpanded ? "size-8 p-0" : ""}`}>
                                            {isExpanded ? "Sign in" : <span className="sr-only">Sign in</span>}
                                        </Button>
                                    </SignInButton>
                                </TooltipTrigger>
                                {!isExpanded && <TooltipContent side="right">Sign in</TooltipContent>}
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SignUpButton>
                                        <Button size="sm" className={`justify-start ${!isExpanded ? "size-8 p-0" : ""}`}>
                                            {isExpanded ? "Sign up" : <span className="sr-only">Sign up</span>}
                                        </Button>
                                    </SignUpButton>
                                </TooltipTrigger>
                                {!isExpanded && <TooltipContent side="right">Sign up</TooltipContent>}
                            </Tooltip>
                        </div>
                    </SignedOut>
                                <SignedIn>
                                    <div className={`flex items-center gap-2 ${!isExpanded ? "justify-center" : ""}`}>
                                        <div className={`${isExpanded ? "flex-1" : "hidden"}`}>
                                <OrganizationSwitcher />
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <UserButton />
                                    </div>
                                </TooltipTrigger>
                                {!isExpanded && <TooltipContent side="right">Account</TooltipContent>}
                            </Tooltip>
                        </div>
                    </SignedIn>
                </SidebarFooter>
            </Sidebar>
        </TooltipProvider>
    );
}