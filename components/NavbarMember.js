import Link from 'next/link';

export default function NavbarMember({ dogName = 'Buddy' }) {
  const navItems = [
    { href: '/app/month', label: 'This Month' },
    { href: '/app/archive', label: `${dogName}'s Archive` },
    { href: '/app/birthday', label: 'Birthday' },
    { href: '/app/account', label: 'Account' },
  ];

  return (
    <nav className="flex justify-between items-center py-4 px-6 md:px-12 bg-white/80 shadow-sm sticky top-0 z-20">
      <Link href="/app" className="font-script text-2xl text-slate-800">Good Dog Mail Club</Link>
      <div className="flex gap-4 text-sm">
        {navItems.map(item => (
          <Link key={item.href} href={item.href} className="hover:text-sage font-semibold">
            {item.label}
          </Link>
        ))}
        <Link href="/api/logout" className="text-slate-500 hover:text-slate-900">Logout</Link>
      </div>
    </nav>
  );
}
