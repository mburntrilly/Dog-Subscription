import NavbarMember from '../../components/NavbarMember';
import prisma from '../../lib/prisma';
import { requireUser } from '../../lib/auth';
import MissionChecklist from '../../components/MissionChecklist';

export async function getServerSideProps({ req }) {
  const user = await requireUser(req);
  if (!user) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  const dog = user.dogs[0];
  const adventure = await prisma.monthlyAdventure.findFirst({ where: { isActive: true } });
  const completion = dog ? await prisma.adventureCompletion.findUnique({
    where: { dogId_monthlyAdventureId: { dogId: dog.id, monthlyAdventureId: adventure?.id || '' } }
  }) : null;

  return {
    props: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        dog,
        subscription: user.subscription
      },
      adventure: adventure ? {
        ...adventure,
        missionSteps: adventure.missionSteps,
        funFeatureContent: adventure.funFeatureContent
      } : null,
      completion: completion ? {
        stepsCompleted: completion.stepsCompleted,
        isComplete: completion.isComplete
      } : { stepsCompleted: [], isComplete: false }
    }
  };
}

export default function ThisMonth({ user, adventure, completion }) {
  const dogName = user?.dog?.name || 'Buddy';
  const steps = adventure?.missionSteps || [];

  const toggleStep = async (idx) => {
    await fetch('/api/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepIndex: idx })
    });
    window.location.reload();
  };

  return (
    <div className="bg-parchment min-h-screen">
      <NavbarMember dogName={dogName} />
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="card">
          <h1 className="text-3xl font-script mb-2">{dogName}\'s {new Date().toLocaleString('default', { month: 'long' })} Adventure</h1>
          <p className="text-slate-700">A cozy little mission for you and your best friend.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card space-y-3">
            <h2 className="text-xl font-semibold">Message to {dogName}</h2>
            <p className="text-slate-700">{adventure?.messageToDogTemplate?.replace('{{dogName}}', dogName)}</p>
            <p className="text-sm text-slate-500">Theme: {adventure?.themeDescription}</p>
          </div>

          <div className="card space-y-3">
            <h2 className="text-xl font-semibold">Mission Checklist</h2>
            <MissionChecklist steps={steps} completion={completion?.stepsCompleted || []} onToggle={toggleStep} />
            {completion?.isComplete && <p className="text-green-700 font-semibold">🎉 Mission complete!</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card space-y-3">
            <h2 className="text-xl font-semibold">Fun Feature</h2>
            <p className="text-slate-700">{adventure?.funFeatureContent?.blurb || `${dogName}\'s Horoscope: A month full of joy!`}</p>
          </div>
          <div className="card space-y-3 text-center">
            <h2 className="text-xl font-semibold">Reward / Completion</h2>
            {completion?.isComplete ? (
              <div className="space-y-2">
                <p>🎉 {dogName} has completed this month\'s mission!</p>
                <div className="inline-flex items-center gap-3 bg-sage text-white px-4 py-2 rounded-full shadow">
                  <span className="text-2xl">🏅</span> Founding Member Badge
                </div>
              </div>
            ) : (
              <p className="text-slate-600">Check off all steps to reveal your badge.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
