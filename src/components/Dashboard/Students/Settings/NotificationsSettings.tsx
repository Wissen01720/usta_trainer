import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Switch } from '../../../ui/switch';
import { Separator } from '../../../ui/separator';
import { Save } from 'lucide-react';
import type { Settings, RoleColors } from './types';

interface NotificationsTabProps {
  settings: Settings;
  onToggle: (category: keyof Settings, setting: string) => void;
  onSave: () => void;
  userRole: string;
  roleColors: RoleColors;
}

const NotificationsTab = ({
  settings,
  onToggle,
  onSave,
  userRole,
  roleColors
}: NotificationsTabProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Preferencias de notificaciones</CardTitle>
      <CardDescription>
        Configura cómo y cuándo quieres recibir notificaciones
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="font-medium">Notificaciones por email</h4>
          <p className="text-sm text-muted-foreground">Recibe actualizaciones importantes por correo</p>
        </div>
        <Switch
          checked={settings.notifications.email}
          onCheckedChange={() => onToggle('notifications', 'email')}
        />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="font-medium">Notificaciones push</h4>
          <p className="text-sm text-muted-foreground">Recibe alertas en tiempo real en el navegador</p>
        </div>
        <Switch
          checked={settings.notifications.push}
          onCheckedChange={() => onToggle('notifications', 'push')}
        />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="font-medium">Actualizaciones del sistema</h4>
          <p className="text-sm text-muted-foreground">Notificaciones sobre nuevas funcionalidades</p>
        </div>
        <Switch
          checked={settings.notifications.updates}
          onCheckedChange={() => onToggle('notifications', 'updates')}
        />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="font-medium">Newsletter</h4>
          <p className="text-sm text-muted-foreground">Recibe noticias y recursos de programación</p>
        </div>
        <Switch
          checked={settings.notifications.newsletter}
          onCheckedChange={() => onToggle('notifications', 'newsletter')}
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

export default NotificationsTab;