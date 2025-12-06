import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavbarPublic from '../components/NavbarPublic';

const planCopy = {
  GOOD_DOG_9_99: { price: '$9.99', name: 'Good Dog Mail Club' },
  BEST_DOG_14_99: { price: '$14.99', name: 'Best Dog Mail Club' }
};

export default function Checkout() {
  const router = useRouter();
  const { plan = 'GOOD_DOG_9_99' } = router.query;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.plan) {
      router.replace('/signup');
    }
  }, [router]);

  const submit = async () => {
    setLoading(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      window.location.href = '/app';
    } else {
      alert(data.error || 'Payment failed');
    }
  };

  const copy = planCopy[plan] || planCopy.GOOD_DOG_9_99;

  return (
    <div className="bg-parchment min-h-screen">
      <NavbarPublic />
      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="card space-y-4">
          <h1 className="text-3xl font-script text-center">Checkout</h1>
          <p className="text-center text-slate-700">Plan: {copy.name} ({copy.price} / month)</p>
          <p className="text-center text-slate-600 text-sm">Stripe test mode is wired for future activation. This button will finalize your mock subscription now.</p>
          <button onClick={submit} disabled={loading} className="btn-primary w-full">{loading ? 'Processing...' : 'Send My Dog Their First Letter'}</button>
        </div>
      </div>
    </div>
  );
}
