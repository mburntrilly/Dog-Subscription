import NavbarMember from '../../components/NavbarMember';
import { requireUser } from '../../lib/auth';
import prisma from '../../lib/prisma';

export async function getServerSideProps({ req }) {
  const user = await requireUser(req);
  if (!user || user.role !== 'ADMIN') return { redirect: { destination: '/login', permanent: false } };
  const dogs = await prisma.dog.findMany({
    include: { user: true }
  });
  const active = await prisma.monthlyAdventure.findFirst({ where: { isActive: true } });
  return {
    props: {
      user: { name: user.name },
      activeMonth: active?.monthKey || 'N/A',
      rows: dogs.map(d => ({
        dogName: d.name,
        ownerName: d.user.name,
        addressLine1: d.user.addressLine1,
        city: d.user.city,
        state: d.user.state,
        postalCode: d.user.postalCode
      }))
    }
  };
}

export default function MailExport({ user, rows, activeMonth }) {
  const download = () => {
    const header = 'Dog Name,Owner Name,Street,City,State,ZIP\n';
    const body = rows.map(r => [r.dogName, r.ownerName, r.addressLine1, r.city, r.state, r.postalCode].join(',')).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mail-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-parchment min-h-screen">
      <NavbarMember dogName={user.name} />
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-4">
        <h1 className="text-3xl font-script">Mail Export</h1>
        <p className="text-slate-700">Current active month: {activeMonth}</p>
        <div className="card space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Dogs + Addresses</h2>
            <button className="btn-primary" onClick={download}>Download CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="p-2">Dog</th>
                  <th className="p-2">Owner</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">City</th>
                  <th className="p-2">State</th>
                  <th className="p-2">ZIP</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className="border-t border-kraft/40">
                    <td className="p-2">{row.dogName}</td>
                    <td className="p-2">{row.ownerName}</td>
                    <td className="p-2">{row.addressLine1}</td>
                    <td className="p-2">{row.city}</td>
                    <td className="p-2">{row.state}</td>
                    <td className="p-2">{row.postalCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
