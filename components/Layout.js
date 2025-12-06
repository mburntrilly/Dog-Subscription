export default function Layout({ children, className = '' }) {
  return (
    <div className={`min-h-screen ${className}`}>
      {children}
    </div>
  );
}
