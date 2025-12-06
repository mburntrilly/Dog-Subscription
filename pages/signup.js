import { useState } from 'react';
import NavbarPublic from '../components/NavbarPublic';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Signup() {
  const [form, setForm] = useState({ plan: 'GOOD_DOG_9_99' });
  const [loading, setLoading] = useState(false);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      window.location.href = `/checkout?plan=${form.plan}`;
    } else {
      alert(data.error || 'Something went wrong');
    }
  };

  return (
    <div className="bg-parchment min-h-screen">
      <NavbarPublic />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-script mb-6 text-center">Start My Dog\'s First Letter</h1>
        <form className="card space-y-4" onSubmit={submit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Your Name</label>
              <input name="name" onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="font-semibold">Email</label>
              <input name="email" type="email" onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="font-semibold">Password</label>
              <input name="password" type="password" onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="font-semibold">Dog\'s Name</label>
              <input name="dogName" onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="font-semibold">Dog\'s Birthday Month</label>
              <select name="birthMonth" onChange={handleChange} required className="input">
                <option value="">Select Month</option>
                {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold">Choose Plan</label>
              <select name="plan" onChange={handleChange} className="input">
                <option value="GOOD_DOG_9_99">Good Dog Mail Club - $9.99</option>
                <option value="BEST_DOG_14_99">Best Dog Mail Club - $14.99</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Street</label>
              <input name="addressLine1" onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="font-semibold">City</label>
              <input name="city" onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="font-semibold">State</label>
              <input name="state" onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="font-semibold">ZIP</label>
              <input name="postalCode" onChange={handleChange} required className="input" />
            </div>
          </div>

          <button disabled={loading} className="btn-primary" type="submit">
            {loading ? 'Creating account...' : 'Continue to Checkout'}
          </button>
        </form>
      </div>
    </div>
  );
}
