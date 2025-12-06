import Link from 'next/link';
import NavbarPublic from '../components/NavbarPublic';
import Layout from '../components/Layout';

const steps = [
  { title: 'Join the Club', body: 'Tell us your dog\'s name and birthday.' },
  { title: 'The Mail Arrives', body: 'A small envelope shows up, addressed to your dog.' },
  { title: 'The Adventure Begins', body: 'You scan the code and start that month\'s cozy experience.' }
];

const bullets = [
  'A personalized message to your dog',
  'A simple family-friendly mission',
  'A fun surprise moment (horoscope, badge, or story)',
  'A real piece of mail to keep',
  "A birthday surprise in their birth month"
];

const faqs = [
  { q: 'Is this a treat box?', a: 'No, this is a monthly emotional experience that includes a tiny piece of real mail.' },
  { q: 'Is my dog really the one getting the letter?', a: 'Yes. Every letter is addressed by name to your dog.' },
  { q: 'Can I cancel anytime?', a: 'Of course. No sad puppy contracts here.' },
  { q: "What about my dog\'s birthday?", a: 'We send something extra special during their birthday month.' }
];

export default function Home() {
  return (
    <Layout className="bg-parchment">
      <NavbarPublic />
      <header className="max-w-5xl mx-auto px-6 md:px-0 py-16 text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-script text-slate-900">Your dog gets real mail. Every single month.</h1>
        <p className="text-lg text-slate-700 max-w-3xl mx-auto">A tiny envelope. A big moment. The most meaningful $10 you\'ll ever spend on your best friend.</p>
        <Link href="/signup" className="btn-primary inline-block">Start My Dog\'s First Letter</Link>
        <p className="text-sm text-slate-600">Cancel anytime. No treats required. Just love.</p>
      </header>

      <main className="space-y-16 pb-20">
        <section className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-script text-slate-900 mb-4">This isn\'t a box. It\'s a ritual.</h2>
          <p className="text-slate-700">Each month brings a small, heartfelt moment for your family and your pup. A handwritten-style letter arrives for your dog, paired with a cozy digital adventure you can enjoy together.</p>
        </section>

        <section className="bg-white/70 border border-kraft/50 py-12">
          <div className="max-w-6xl mx-auto px-6 space-y-8">
            <h3 className="text-center text-2xl font-script">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map(step => (
                <div key={step.title} className="card text-left">
                  <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                  <p className="text-slate-600">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 space-y-4">
          <h3 className="text-2xl font-script">What\'s Inside Each Month</h3>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            {bullets.map(item => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-script text-center mb-6">Pricing</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[{
              title: 'Good Dog Mail Club', price: '$9.99/month', features: [
                'Monthly personalized dog mail',
                'Monthly digital adventure',
                'Dog of the Month access',
                'Birthday surprise locked in'
              ]
            }, {
              title: 'Best Dog Mail Club', price: '$14.99/month', features: [
                'Everything above',
                'Bigger birthday surprise',
                'Occasional bonus mail drops',
                'Priority dog features'
              ]
            }].map(plan => (
              <div key={plan.title} className="card space-y-4">
                <div>
                  <h4 className="text-xl font-semibold">{plan.title}</h4>
                  <p className="text-lg text-slate-700">{plan.price}</p>
                </div>
                <ul className="space-y-2 text-slate-700 list-disc pl-5">
                  {plan.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <Link href="/signup" className="btn-primary inline-block">Send My Dog Their First Letter</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 space-y-4">
          <h3 className="text-2xl font-script">FAQ</h3>
          <div className="space-y-4">
            {faqs.map(item => (
              <div key={item.q} className="card">
                <h4 className="font-semibold">{item.q}</h4>
                <p className="text-slate-700">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center bg-sage text-white py-12 px-6">
          <p className="text-xl max-w-3xl mx-auto mb-6">“Your dog doesn\'t know what a subscription is. They just know when the mail shows up… and their name is on it.”</p>
          <Link href="/signup" className="btn-primary bg-white text-sage">Begin My Dog\'s Story</Link>
        </section>
      </main>
    </Layout>
  );
}
