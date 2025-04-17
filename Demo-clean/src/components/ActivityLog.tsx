import React from 'react';
import './ActivityLog.css';

export const ActivityLog: React.FC<{ activity: string[] }> = ({ activity }) => (
  <aside className="activity-log">
    <h3>Activity Log</h3>
    {activity.length === 0 ? (
      <div className="empty-log">No recent activity.</div>
    ) : (
      <ul>
        {activity.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    )}
  </aside>
); 