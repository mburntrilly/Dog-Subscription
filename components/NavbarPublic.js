import Link from 'next/link';

export default function NavbarPublic() {
  return (
    <nav className="flex justify-between items-center py-4 px-6 md:px-12 bg-white/70 backdrop-blur sticky top-0 z-20 shadow-sm">
      <Link href="/" className="font-script text-2xl text-slate-800">Good Dog Mail Club</Link>
      <div className="flex gap-4 items-center text-sm">
        <Link href="/" className="hover:text-sage">Home</Link>
        <Link href="/signup" className="hover:text-sage">Pricing</Link>
        <Link href="/login" className="btn-secondary text-sm">Member Login</Link>
      </div>
    </nav>
  );
}
