import React from 'react';
import './UI.css';

function UI({ worldStats, onNavigateToDashboard, onNavigateToAgent }) {
  return (
    <div className="world-ui">
      <div className="ui-top-bar">
        <h1>🌍 Meta The World</h1>
        <div className="ui-stats">
          {worldStats && (
            <>
              <span>👥 {worldStats.total_users}</span>
              <span>🏠 {worldStats.total_properties}</span>
              <span>💰 {worldStats.total_volume?.toFixed(2) || 0} MTC</span>
            </>
          )}
        </div>
      </div>

      <div className="ui-sidebar">
        <button onClick={onNavigateToDashboard} className="ui-button">
          📊 Dashboard
        </button>
        <button onClick={onNavigateToAgent} className="ui-button">
          🏢 Become Agent
        </button>
      </div>
    </div>
  );
}

export default UI;
