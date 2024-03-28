"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export type NavLink = {
    title: string;
    href: string;
}
export default function NestedNav({ items, button = (<></>) }: { items: NavLink[], button: ReactNode }) {
    const path = usePathname()
    console.log(path)
    return (
        <div className="flex justify-between items-end border-b pb-2">
            <nav className="font-medium p-2 flex gap-[1.875rem] max-sm:gap-3 max-sm:text-sm">
                {items.map((item) => path === item.href ? (
                    <Link href={item.href} key={`nav-${item.title}`}
                        className="relative text-black | after:content-[''] after:absolute after:-bottom-4 after:left-0 after:w-full after:h-1 after:rounded-full after:bg-[#0A349E]">{item.title}</Link>
                ) : (
                    <Link href={item.href} key={`nav-${item.title}`} className="">
                        {item.title}
                    </Link>
                )
                )}
            </nav>
            {button}
        </div>
    )
}
