import { Inbox } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({ title = 'No data found', message = 'Try adjusting your filters or add some data.' }) {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state__icon">
        <Inbox size={40} strokeWidth={1.2} />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
    </div>
  );
}
