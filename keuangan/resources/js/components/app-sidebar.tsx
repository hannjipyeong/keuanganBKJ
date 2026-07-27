import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const dashboardUrl = '/dashboard';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Utang Usaha',
            href: '/accountpayable',
            icon: LayoutGrid,
        },
        {
            title: 'Piutang Usaha',
            href: '/accountreceivable',
            icon: LayoutGrid,
        },
        {
            title: 'Buku Besar',
            href: '/generalledger',
            icon: LayoutGrid,
        },
        {
            title: 'Alur Persetujuan',
            href: '/approvalworkflow',
            icon: LayoutGrid,
        },
        {
            title: 'Pelaporan',
            href: '/reporting',
            icon: LayoutGrid,
        },
        {
            title: 'Pusat Komando Keuangan',
            href: '/financecommandcenter',
            icon: LayoutGrid,
        },
        {
            title: 'Rekonsiliasi',
            href: '/reconciliation',
            icon: LayoutGrid,
        },
        {
            title: 'Jejak Audit',
            href: '/audittrail',
            icon: LayoutGrid,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repositori',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: 'Dokumentasi',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
