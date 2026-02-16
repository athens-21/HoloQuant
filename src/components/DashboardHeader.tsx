import { Activity, Bell, Search, Settings } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-6 h-12 border-b border-border bg-card">
      <div className="flex items-center gap-2.5">
        <Activity className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground tracking-tight">HoloQuant Pro</span>
        <span className="hidden sm:inline text-[10px] font-mono ml-1 px-1.5 py-0.5 rounded text-sidebar-primary bg-secondary">v2.1</span>
      </div>

      <div className="flex items-center gap-0.5">
        <div className="hidden sm:flex items-center gap-1.5 mr-3 px-2 py-1 rounded text-[10px] font-mono text-muted-foreground bg-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-positive" />
          Markets Open
        </div>
        {[Search, Bell, Settings].map((Icon, i) =>
        <button
          key={i}
          className="p-2 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150">

            <Icon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </header>);

}