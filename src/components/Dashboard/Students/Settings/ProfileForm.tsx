import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Separator } from '../../../ui/separator';
import { Lock, Save } from 'lucide-react';
import type { RoleColors } from './types';

export interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  bio: string;
  location: string;
  website_url: string;
  date_of_birth: string;
  preferred_language: string;
  role: string;
}

interface ProfileFormProps {
  profile: ProfileData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel?: () => void;
  userRole: string;
  roleColors: RoleColors;
}

const ProfileForm = ({
  profile,
  onChange,
  onSave,
  onCancel,
  userRole,
  roleColors
}: ProfileFormProps) => (
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-sm font-medium">Rol</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md border bg-background/50"
              value="Estudiante"
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Idioma preferido</label>
            <input
              type="text"
              name="preferred_language"
              className="w-full px-3 py-2 rounded-md border bg-background"
              value={profile.preferred_language}
              onChange={onChange}
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
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline" onClick={onCancel}>Cancelar</Button>
      <Button
        className={`bg-gradient-to-r ${roleColors[userRole].primary} text-white`}
        onClick={onSave}
      >
        <Save className="mr-2 h-4 w-4" /> Guardar cambios
      </Button>
    </CardFooter>
  </Card>
);

export default ProfileForm;