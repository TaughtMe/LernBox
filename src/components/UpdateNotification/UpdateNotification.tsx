import React from 'react';
import styles from './UpdateNotification.module.css';
import { Button } from '../Button/Button';

// Die Props-Schnittstelle wird um die neue Version erweitert
interface UpdateNotificationProps {
  onUpdate: () => void;
  onDismiss: () => void;
  currentVersion: string;
  newVersion: string; // NEU
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({ 
  onUpdate, 
  onDismiss, 
  currentVersion,
  newVersion // NEU
}) => {
  return (
    <div className={styles.notification}>
      {/* Der Text wird angepasst, um beide Versionen zu zeigen */}
      <p className={styles.text}>
        Update von v{currentVersion} auf v{newVersion} verfügbar!
      </p>
      <div className={styles.actions}>
        <Button 
          onClick={onDismiss} 
          variant="secondary" 
          aria-label="Update-Benachrichtigung schließen"
        >
          Später
        </Button>
        <Button 
          onClick={onUpdate} 
          variant="primary" 
          aria-label="Daten sichern und die Anwendung aktualisieren"
        >
          Sichern & Updaten
        </Button>
      </div>
    </div>
  );
};

export default UpdateNotification;