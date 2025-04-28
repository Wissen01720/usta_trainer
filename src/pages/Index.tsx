import React from 'react';
import RoleSelector from '../components/Auth/LoginForm';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-slate-900">
      <RoleSelector />
    </div>
  );
};

export default Index;