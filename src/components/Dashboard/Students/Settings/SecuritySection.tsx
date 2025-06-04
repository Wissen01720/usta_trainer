import { Lock } from 'lucide-react';

interface SecuritySectionProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SecuritySection = ({ onChange }: SecuritySectionProps) => (
  <div className="space-y-4">
    <h3 className="font-medium flex items-center gap-2">
      <Lock className="h-4 w-4" /> Seguridad
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Contraseña actual</label>
        <input
          type="password"
          className="w-full px-3 py-2 rounded-md border bg-background"
          placeholder="••••••••••"
          name="current_password"
          onChange={onChange}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Nueva contraseña</label>
        <input
          type="password"
          className="w-full px-3 py-2 rounded-md border bg-background"
          placeholder="••••••••••"
          name="new_password"
          onChange={onChange}
        />
      </div>
    </div>
  </div>
);

export default SecuritySection;