import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Separator } from "../../../ui/separator";
import { Lock, Save } from "lucide-react";
import type { Profile, RoleColors } from "./type";

interface ProfileFormProps {
  profile: Profile;
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveProfile: () => void;
  roleColors: RoleColors;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  handleProfileChange,
  handleSaveProfile,
  roleColors,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Información de perfil</CardTitle>
      <CardDescription>
        Completa y actualiza tu información personal
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna 1 */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="first_name"
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={profile.first_name}
              onChange={handleProfileChange}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Apellido</label>
            <input
              type="text"
              name="last_name"
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={profile.last_name}
              onChange={handleProfileChange}
              placeholder="Tu apellido"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Avatar (URL)</label>
            <input
              type="text"
              name="avatar_url"
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={profile.avatar_url}
              onChange={handleProfileChange}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">Rol</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md border bg-background/50"
              value="Profesor"
              disabled
            />
          </div>
        </div>
        {/* Columna 2 */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Biografía</label>
            <textarea
              name="bio"
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={profile.bio}
              onChange={handleProfileChange}
              placeholder="Cuéntanos sobre ti"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Ubicación</label>
            <input
              type="text"
              name="location"
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={profile.location}
              onChange={handleProfileChange}
              placeholder="Ciudad, País"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Sitio web</label>
            <input
              type="text"
              name="website_url"
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={profile.website_url}
              onChange={handleProfileChange}
              placeholder="https://tusitio.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Fecha de nacimiento</label>
            <input
              type="date"
              name="date_of_birth"
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={profile.date_of_birth}
              onChange={handleProfileChange}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Idioma preferido</label>
            <input
              type="text"
              name="preferred_language"
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={profile.preferred_language}
              onChange={handleProfileChange}
              placeholder="es"
            />
          </div>
        </div>
      </div>
      <Separator className="my-6" />

      {/* Seguridad */}
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
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nueva contraseña</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-md border bg-background"
              placeholder="••••••••••"
            />
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline">Cancelar</Button>
      <Button
        className={`bg-gradient-to-r ${roleColors.primary} text-white`}
        onClick={handleSaveProfile}
      >
        <Save className="mr-2 h-4 w-4" /> Guardar cambios
      </Button>
    </CardFooter>
  </Card>
);

export default ProfileForm;