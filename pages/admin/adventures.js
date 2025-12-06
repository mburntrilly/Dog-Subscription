import { useState } from 'react';
import NavbarMember from '../../components/NavbarMember';
import { requireUser } from '../../lib/auth';
import prisma from '../../lib/prisma';

export async function getServerSideProps({ req }) {
  const user = await requireUser(req);
  if (!user || user.role !== 'ADMIN') return { redirect: { destination: '/login', permanent: false } };
  const adventures = await prisma.monthlyAdventure.findMany({ orderBy: { monthKey: 'desc' } });
  return { props: { user: { name: user.name }, adventures: adventures.map(a => ({ ...a, missionSteps: a.missionSteps, funFeatureContent: a.funFeatureContent })) } };
}

export default function Adventures({ user, adventures }) {
  const [form, setForm] = useState({ missionSteps: '[]', funFeatureContent: '{}' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    const res = await fetch('/api/admin/adventures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        missionSteps: JSON.parse(form.missionSteps || '[]'),
        funFeatureContent: JSON.parse(form.funFeatureContent || '{}')
      })
    });
    if ((await res.json()).success) window.location.reload();
  };

  const setActive = async id => {
    await fetch('/api/admin/adventures', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    window.location.reload();
  };

  return (
    <div className="bg-parchment min-h-screen">
      <NavbarMember dogName={user.name} />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-3xl font-script">Monthly Adventures</h1>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Create New Adventure</h2>
          <form className="grid md:grid-cols-2 gap-4" onSubmit={submit}>
            <input className="input" name="monthKey" placeholder="YYYY-MM" onChange={handleChange} required />
            <input className="input" name="title" placeholder="Title" onChange={handleChange} required />
            <input className="input" name="themeDescription" placeholder="Theme" onChange={handleChange} required />
            <input className="input" name="messageToDogTemplate" placeholder="Message to dog template" onChange={handleChange} required />
            <input className="input" name="missionTitle" placeholder="Mission Title" onChange={handleChange} required />
            <textarea className="input" name="missionSteps" placeholder='["Step 1"]' onChange={handleChange} required />
            <select className="input" name="funFeatureType" onChange={handleChange} required>
              <option value="">Fun Feature Type</option>
              <option value="HOROSCOPE">Horoscope</option>
              <option value="BADGE">Badge</option>
              <option value="STORY">Story</option>
            </select>
            <textarea className="input" name="funFeatureContent" placeholder='{"blurb":"A fortune"}' onChange={handleChange} required />
            <button type="submit" className="btn-primary col-span-2">Save Adventure</button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {adventures.map(adventure => (
            <div key={adventure.id} className="card space-y-2">
              <p className="text-sm text-slate-500">{adventure.monthKey}</p>
              <h3 className="text-xl font-semibold">{adventure.title}</h3>
              <p>{adventure.themeDescription}</p>
              <p className="text-sm">Fun Feature: {adventure.funFeatureType}</p>
              <button className="btn-secondary" onClick={() => setActive(adventure.id)} disabled={adventure.isActive}>
                {adventure.isActive ? 'Active' : 'Set Active'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
