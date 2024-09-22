import React, { useState } from 'react';
import './SettingsComponent.css';

const SettingsComponent = () => {
  // Example states for each setting
  const [isWifiEnabled, setIsWifiEnabled] = useState(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  return (
    <div className="settings-container">
      <div className="settings-row">
        <span className="settings-label">Näytä hinnasto</span>
        <input
          type="checkbox"
          checked={isWifiEnabled}
          onChange={() => setIsWifiEnabled(!isWifiEnabled)}
          className="settings-checkbox"
        />
      </div>

      <div className="settings-row">
        <span className="settings-label">FAQ</span>
        <input
          type="checkbox"
          checked={isDarkModeEnabled}
          onChange={() => setIsDarkModeEnabled(!isDarkModeEnabled)}
          className="settings-checkbox"
        />
      </div>
    </div>
  );
};

export default SettingsComponent;
