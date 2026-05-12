import type { ReactNode } from 'react';

export type WeatherAppLayoutRootProps = {
  children: ReactNode;
};

export type WeatherAppLayoutSidebarProps = {
  children?: ReactNode;
};

export type WeatherAppLayoutContentProps = {
  children?: ReactNode;
  rainy?: boolean;
};

function WeatherAppLayoutRoot({ children }: WeatherAppLayoutRootProps) {
  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-950 font-sans text-white select-none md:select-auto">
      {children}
    </div>
  );
}

function WeatherAppLayoutSidebar({ children }: WeatherAppLayoutSidebarProps) {
  return (
    <aside className="z-30 hidden h-screen w-[350px] flex-col border-r border-white/5 bg-gray-800/40 backdrop-blur-3xl md:flex lg:w-[400px]">
      {children}
    </aside>
  );
}

function WeatherAppLayoutContent({ children, rainy = false }: WeatherAppLayoutContentProps) {
  return (
    <main
      className={`relative h-screen flex-1 overflow-y-auto transition-colors duration-700 ${rainy ? 'bg-slate-800' : 'bg-blue-500'}`}
    >
      {children}
    </main>
  );
}

WeatherAppLayoutRoot.Sidebar = WeatherAppLayoutSidebar;
WeatherAppLayoutRoot.Content = WeatherAppLayoutContent;

export const WeatherAppLayout = WeatherAppLayoutRoot;
