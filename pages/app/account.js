import NavbarMember from '../../components/NavbarMember';
import prisma from '../../lib/prisma';
import { requireUser } from '../../lib/auth';

export async function getServerSideProps({ req }) {
  const user = await requireUser(req);
  if (!user) return { redirect: { destination: '/login', permanent: false } };
  const dog = user.dogs[0];
  return {
    props: {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        addressLine1: user.addressLine1 || '',
        city: user.city || '',
        state: user.state || '',
        postalCode: user.postalCode || ''
      },
      dog: dog || null,
      subscription: user.subscription || null
    }
  };
}

export default function Account({ user, dog, subscription }) {
  const dogName = dog?.name || 'Buddy';
  return (
    <div className="bg-parchment min-h-screen">
      <NavbarMember dogName={dogName} />
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-3xl font-script">Account</h1>
        <div className="card space-y-2">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Address:</strong> {user.addressLine1}, {user.city}, {user.state} {user.postalCode}</p>
        </div>

        <div className="card space-y-2">
          <h2 className="text-xl font-semibold">Dog Profile</h2>
          {dog ? (
            <>
              <p><strong>Name:</strong> {dog.name}</p>
              <p><strong>Birthday Month:</strong> {dog.birthMonth}</p>
            </>
          ) : <p>No dog on file.</p>}
        </div>

        <div className="card space-y-2">
          <h2 className="text-xl font-semibold">Subscription</h2>
          {subscription ? (
            <>
              <p><strong>Plan:</strong> {subscription.plan}</p>
              <p><strong>Status:</strong> {subscription.status}</p>
              <button className="btn-secondary">Manage Billing</button>
            </>
          ) : <p>No active subscription.</p>}
        </div>
      </main>
    </div>
  );
}
