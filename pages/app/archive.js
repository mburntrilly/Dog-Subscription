import NavbarMember from '../../components/NavbarMember';
import prisma from '../../lib/prisma';
import { requireUser } from '../../lib/auth';
import { monthNameFromKey } from '../../lib/date';

export async function getServerSideProps({ req }) {
  const user = await requireUser(req);
  if (!user) return { redirect: { destination: '/login', permanent: false } };

  const adventures = await prisma.monthlyAdventure.findMany({
    orderBy: { monthKey: 'desc' }
  });

  return {
    props: {
      dogName: user.dogs[0]?.name || 'Buddy',
      adventures: adventures.map(a => ({
        id: a.id,
        monthKey: a.monthKey,
        title: a.title,
        missionTitle: a.missionTitle,
        missionSteps: a.missionSteps,
        messageToDogTemplate: a.messageToDogTemplate,
        funFeatureContent: a.funFeatureContent
      }))
    }
  };
}

export default function Archive({ dogName, adventures }) {
  return (
    <div className="bg-parchment min-h-screen">
      <NavbarMember dogName={dogName} />
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-3xl font-script">{dogName}\'s Archive</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {adventures.map(adventure => (
            <div key={adventure.id} className="card space-y-2">
              <p className="text-slate-500 text-sm">{monthNameFromKey(adventure.monthKey)}</p>
              <h3 className="text-xl font-semibold">{adventure.title}</h3>
              <p className="text-slate-600">{adventure.messageToDogTemplate.replace('{{dogName}}', dogName)}</p>
              <div>
                <h4 className="font-semibold">Mission: {adventure.missionTitle}</h4>
                <ul className="list-disc pl-6 text-slate-600 space-y-1">
                  {adventure.missionSteps.map((step, idx) => <li key={idx}>{step}</li>)}
                </ul>
              </div>
              <div className="bg-sage/10 p-3 rounded-lg border border-sage/30 text-slate-700">
                <strong>Fun Feature:</strong> {adventure.funFeatureContent?.blurb || 'A cozy surprise'}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
