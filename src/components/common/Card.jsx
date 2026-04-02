import './Card.css';

export default function Card({ children, className = '', animate = true, ...props }) {
  return (
    <div
      className={`card ${animate ? 'animate-fade-in' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
