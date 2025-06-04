import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Switch } from "../../../ui/switch";
import { Separator } from "../../../ui/separator";
import { Save } from "lucide-react";
import type { Settings, RoleColors } from "./type";

interface PrivacySettingsProps {
  settings: Settings;
  handleToggleSetting: (category: keyof Settings, setting: string) => void;
  handleSaveSettings: () => void;
  roleColors: RoleColors;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  settings,
  handleToggleSetting,
  handleSaveSettings,
  roleColors,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Privacidad y visibilidad</CardTitle>
      <CardDescription>
        Controla qué información compartes con otros usuarios
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-medium">Perfil público</h4>
            <p className="text-sm text-muted-foreground">Permitir que otros usuarios vean tu perfil</p>
          </div>
          <Switch
            checked={settings.privacy.publicProfile}
            onCheckedChange={() => handleToggleSetting("privacy", "publicProfile")}
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
            onCheckedChange={() => handleToggleSetting("privacy", "showProgress")}
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
            onCheckedChange={() => handleToggleSetting("privacy", "shareActivity")}
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

export default PrivacySettings;