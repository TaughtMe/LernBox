import React from 'react';
import { Card } from '../../components/Card/Card';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  return (
    <div className="login-page-container">
      <Card>
        <h2>Login</h2>
        <Input placeholder="E-Mail" type="email" />
        <Input placeholder="Passwort" type="password" />
        {/* KORREKTUR: Der Text muss als "label"-Prop übergeben werden */}
        <Button label="Anmelden" />
      </Card>
    </div>
  );
};