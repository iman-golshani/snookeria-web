"use client";

import { Trophy, GraduationCap, Globe2 } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
{
label: "مسابقات",
href: "/tournaments",
icon: Trophy,
},
{
label: "آکادمی",
href: "/academy",
icon: GraduationCap,
},
{
label: "دنیای اسنوکر",
href: "/snooker-world",
icon: Globe2,
},
];

export default function BottomNav() {
const pathname = usePathname();

return ( <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3"> <div className="mx-auto flex h-[68px] max-w-md items-center justify-around rounded-2xl border border-white/10 bg-[#101012]/95 px-2 shadow-2xl shadow-black/50 backdrop-blur-2xl">
{items.map((item) => {
const Icon = item.icon;

      const active =
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(item.href));

      return (
        <a
          key={item.href}
          href={item.href}
          className="flex h-full min-w-[82px] flex-col items-center justify-center gap-1.5"
        >
          <div
            className={`flex h-8 w-12 items-center justify-center rounded-xl transition-all ${
              active
                ? "bg-[#e21d2f]/10 text-[#e21d2f]"
                : "text-zinc-500"
            }`}
          >
            <Icon
              className={`h-[19px] w-[19px] ${
                active ? "stroke-[2.2]" : "stroke-[1.7]"
              }`}
            />
          </div>

          <span
            className={`text-[10px] transition ${
              active
                ? "font-bold text-white"
                : "font-medium text-zinc-500"
            }`}
          >
            {item.label}
          </span>
        </a>
      );
    })}
  </div>
</nav>

);
}
