import type { ReactNode } from 'react';

export type WeatherAppLayoutRootProps = {
  children: ReactNode;
};

export type WeatherAppLayoutSidebarProps = {
  children?: ReactNode;
};

export type WeatherAppLayoutContentProps = {
  children?: ReactNode;
};

function WeatherAppLayoutRoot({ children }: WeatherAppLayoutRootProps) {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-950">
      <div className="flex min-h-dvh">{children}</div>
    </div>
  );
}

function WeatherAppLayoutSidebar({ children }: WeatherAppLayoutSidebarProps) {
  return <div className="hidden w-80 shrink-0 border-r border-slate-200 bg-white md:block">{children}</div>;
}

function WeatherAppLayoutContent({ children }: WeatherAppLayoutContentProps) {
  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-y-auto p-4 pb-24 md:p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">{children}</div>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-20 border-t border-slate-200 bg-white md:hidden" />
    </main>
  );
}

WeatherAppLayoutRoot.Sidebar = WeatherAppLayoutSidebar;
WeatherAppLayoutRoot.Content = WeatherAppLayoutContent;

export const WeatherAppLayout = WeatherAppLayoutRoot;
