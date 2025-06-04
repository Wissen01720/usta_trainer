import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Switch } from '../../../ui/switch';
import { Separator } from '../../../ui/separator';
import { Save } from 'lucide-react';
import type { Settings, RoleColors } from './types';

interface PrivacyTabProps {
  settings: Settings;
  onToggle: (category: keyof Settings, setting: string) => void;
  onSave: () => void;
  userRole: string;
  roleColors: RoleColors;
}

const PrivacyTab = ({
  settings,
  onToggle,
  onSave,
  userRole,
  roleColors
}: PrivacyTabProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Privacidad y visibilidad</CardTitle>
      <CardDescription>
        Controla qué información compartes con otros usuarios
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="font-medium">Perfil público</h4>
          <p className="text-sm text-muted-foreground">Permitir que otros usuarios vean tu perfil</p>
        </div>
        <Switch
          checked={settings.privacy.publicProfile}
          onCheckedChange={() => onToggle('privacy', 'publicProfile')}
        />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="font-medium">Mostrar progreso</h4>
          <p className="text-sm text-muted-foreground">Compartir tu progreso de aprendizaje con otros</p>
        </div>
        <Switch
          checked={settings.privacy.showProgress}
          onCheckedChange={() => onToggle('privacy', 'showProgress')}
        />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="font-medium">Compartir actividad</h4>
          <p className="text-sm text-muted-foreground">Mostrar cuando completas lecciones o desafíos</p>
        </div>
        <Switch
          checked={settings.privacy.shareActivity}
          onCheckedChange={() => onToggle('privacy', 'shareActivity')}
        />
      </div>
    </CardContent>
    <CardFooter>
      <Button
        className={`bg-gradient-to-r ${roleColors[userRole].primary} text-white ml-auto`}
        onClick={onSave}
      >
        <Save className="mr-2 h-4 w-4" /> Guardar preferencias
      </Button>
    </CardFooter>
  </Card>
);

export default PrivacyTab;