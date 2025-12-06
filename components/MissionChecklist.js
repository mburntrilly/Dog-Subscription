export default function MissionChecklist({ steps = [], completion = [], onToggle = () => {} }) {
  return (
    <ul className="space-y-3">
      {steps.map((step, idx) => {
        const checked = completion.includes(idx);
        return (
          <li key={idx} className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(idx)}
              className="mt-1 h-5 w-5 text-sage focus:ring-sage border-kraft"
            />
            <span className={checked ? 'line-through text-slate-500' : ''}>{step}</span>
          </li>
        );
      })}
    </ul>
  );
}
