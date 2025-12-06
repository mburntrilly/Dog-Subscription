import NavbarMember from '../../components/NavbarMember';
import prisma from '../../lib/prisma';
import { requireUser } from '../../lib/auth';
import { monthNumberToName } from '../../lib/date';

export async function getServerSideProps({ req }) {
  const user = await requireUser(req);
  if (!user) return { redirect: { destination: '/login', permanent: false } };
  const dog = user.dogs[0];
  return {
    props: {
      dogName: dog?.name || 'Buddy',
      birthMonth: dog?.birthMonth || 1
    }
  };
}

export default function Birthday({ dogName, birthMonth }) {
  return (
    <div className="bg-parchment min-h-screen">
      <NavbarMember dogName={dogName} />
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-4">
        <h1 className="text-3xl font-script">Birthday</h1>
        <div className="card space-y-2">
          <p className="text-xl">{dogName}\'s Birthday Month: {monthNumberToName(birthMonth)} 🎂</p>
          <p className="text-green-700 font-semibold">Birthday Surprise Status: ✅ Locked & Waiting</p>
          <p className="text-slate-600">We make sure {dogName} receives something extra special during their birthday month.</p>
        </div>
      </main>
    </div>
  );
}
