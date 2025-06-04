import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Switch } from "../../../ui/switch";
import { Separator } from "../../../ui/separator";
import { Moon, Sun, Code, Save } from "lucide-react";
import type { Settings, RoleColors } from "./type";

interface AppearanceSettingsProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  handleToggleSetting: (category: keyof Settings, setting: string) => void;
  handleSaveSettings: () => void;
  roleColors: RoleColors;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  settings,
  setSettings,
  handleToggleSetting,
  handleSaveSettings,
  roleColors,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Apariencia</CardTitle>
      <CardDescription>
        Personaliza la apariencia de la plataforma
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-medium flex items-center gap-2">
              {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Modo oscuro
            </h4>
            <p className="text-sm text-muted-foreground">Cambiar entre modo claro y oscuro</p>
          </div>
          <Switch
            checked={settings.darkMode}
            onCheckedChange={() => {
              setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
              document.documentElement.classList.toggle("dark");
            }}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-medium flex items-center gap-2">
              <Code className="h-4 w-4" />
              Tema del editor de código
            </h4>
            <p className="text-sm text-muted-foreground">Selecciona el tema para el editor de código</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={settings.appearance.codeTheme === "light" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  appearance: { ...prev.appearance, codeTheme: "light" },
                }))
              }
              className={
                settings.appearance.codeTheme === "light"
                  ? `bg-gradient-to-r ${roleColors.primary} text-white`
                  : ""
              }
            >
              Claro
            </Button>
            <Button
              variant={settings.appearance.codeTheme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  appearance: { ...prev.appearance, codeTheme: "dark" },
                }))
              }
              className={
                settings.appearance.codeTheme === "dark"
                  ? `bg-gradient-to-r ${roleColors.primary} text-white`
                  : ""
              }
            >
              Oscuro
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-medium">Modo compacto</h4>
            <p className="text-sm text-muted-foreground">Reducir el espacio entre elementos en la interfaz</p>
          </div>
          <Switch
            checked={settings.appearance.denseMode}
            onCheckedChange={() => handleToggleSetting("appearance", "denseMode")}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-medium">Animaciones</h4>
            <p className="text-sm text-muted-foreground">Habilitar animaciones en la interfaz</p>
          </div>
          <Switch
            checked={settings.appearance.animations}
            onCheckedChange={() => handleToggleSetting("appearance", "animations")}
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

export default AppearanceSettings;