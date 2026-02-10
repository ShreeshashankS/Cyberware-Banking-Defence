import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/header';
import { Dashboard } from '@/components/dashboard';
import { SidebarItems } from '@/components/sidebar-items';
import { GameProvider } from '@/lib/game-context';

export default function Home() {
  return (
    <GameProvider>
      <SidebarProvider>
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <SidebarContent>
            <SidebarItems />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <AppHeader />
          <main className="p-4 lg:p-6">
            <Dashboard />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </GameProvider>
  );
}
