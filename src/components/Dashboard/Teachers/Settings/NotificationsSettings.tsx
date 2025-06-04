import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Switch } from "../../../ui/switch";
import { Separator } from "../../../ui/separator";
import { Save } from "lucide-react";
import type { Settings, RoleColors } from "./type";

interface NotificationsSettingsProps {
  settings: Settings;
  handleToggleSetting: (category: keyof Settings, setting: string) => void;
  handleSaveSettings: () => void;
  roleColors: RoleColors;
}

const NotificationsSettings: React.FC<NotificationsSettingsProps> = ({
  settings,
  handleToggleSetting,
  handleSaveSettings,
  roleColors,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Preferencias de notificaciones</CardTitle>
      <CardDescription>
        Configura cómo y cuándo quieres recibir notificaciones
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-medium">Notificaciones por email</h4>
            <p className="text-sm text-muted-foreground">Recibe actualizaciones importantes por correo</p>
          </div>
          <Switch
            checked={settings.notifications.email}
            onCheckedChange={() => handleToggleSetting("notifications", "email")}
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
            onCheckedChange={() => handleToggleSetting("notifications", "push")}
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
            onCheckedChange={() => handleToggleSetting("notifications", "updates")}
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
            onCheckedChange={() => handleToggleSetting("notifications", "newsletter")}
          />
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button
        className={`bg-gradient-to-r ${roleColors.primary} text-white ml-auto`}
        onClick={handleSaveSettings}
      >
        <Save className="mr-2 h-4 w-4" /> Guardar preferencias
      </Button>
    </CardFooter>
  </Card>
);

export default NotificationsSettings;