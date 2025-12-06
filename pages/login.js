import { useState } from 'react';
import NavbarPublic from '../components/NavbarPublic';

export default function Login() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      window.location.href = data.redirect || '/app';
    } else {
      alert(data.error || 'Invalid credentials');
    }
  };

  return (
    <div className="bg-parchment min-h-screen">
      <NavbarPublic />
      <div className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-3xl font-script text-center mb-6">Welcome back</h1>
        <form className="card space-y-4" onSubmit={submit}>
          <div>
            <label className="font-semibold">Email</label>
            <input name="email" type="email" onChange={handleChange} required className="input" />
          </div>
          <div>
            <label className="font-semibold">Password</label>
            <input name="password" type="password" onChange={handleChange} required className="input" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Signing in…' : 'Login'}</button>
        </form>
      </div>
    </div>
  );
}
