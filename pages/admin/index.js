import NavbarMember from '../../components/NavbarMember';
import { requireUser } from '../../lib/auth';
import prisma from '../../lib/prisma';

export async function getServerSideProps({ req }) {
  const user = await requireUser(req);
  if (!user || user.role !== 'ADMIN') {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const [userCount, dogCount, activeSubs, activeAdventure] = await Promise.all([
    prisma.user.count(),
    prisma.dog.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.monthlyAdventure.findFirst({ where: { isActive: true } })
  ]);

  return {
    props: {
      user: { name: user.name },
      stats: {
        userCount,
        dogCount,
        activeSubs,
        activeMonth: activeAdventure?.monthKey || 'N/A'
      }
    }
  };
}

export default function AdminDashboard({ user, stats }) {
  return (
    <div className="bg-parchment min-h-screen">
      <NavbarMember dogName={user.name} />
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-3xl font-script">Admin Mailroom</h1>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.userCount },
            { label: 'Total Dogs', value: stats.dogCount },
            { label: 'Active Subscriptions', value: stats.activeSubs },
            { label: 'Current Month', value: stats.activeMonth }
          ].map(item => (
            <div key={item.label} className="card text-center">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Admin Links</h2>
          <div className="flex gap-4">
            <a className="btn-primary" href="/admin/adventures">Manage Adventures</a>
            <a className="btn-secondary" href="/admin/mail-export">Mail Export</a>
          </div>
        </div>
      </main>
    </div>
  );
}
