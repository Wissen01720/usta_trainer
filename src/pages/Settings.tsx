import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../components/Layout/MainLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { Bell, Shield, User, Lock, Moon, Sun, Palette, Code, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [userRole] = useState<'student' | 'teacher' | 'admin'>(
    localStorage.getItem('userRole') as 'student' | 'teacher' | 'admin' || 'student'
  );
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: {
      email: true,
      push: true, 
      updates: true,
      newsletter: false
    },
    privacy: {
      publicProfile: true,
      showProgress: true,
      shareActivity: false
    },
    appearance: {
      denseMode: false,
      animations: true,
      codeTheme: 'dark'
    }
  });
  
  const handleToggleSetting = (category: keyof typeof settings, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as Record<string, boolean>),
        [setting]: !((prev[category] as Record<string, boolean>)[setting])
      }
    }));
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast({
      title: "Configuración guardada",
      description: "Tus ajustes se han actualizado con éxito.",
      variant: "default",
    });
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  // Different colors for different roles
  const roleColors = {
    student: {
      primary: 'from-blue-500 to-indigo-500',
      secondary: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      accent: 'text-blue-500'
    },
    teacher: {
      primary: 'from-green-500 to-emerald-600',
      secondary: 'bg-green-500/10 text-green-400 border-green-500/20',
      accent: 'text-green-500'
    },
    admin: {
      primary: 'from-purple-500 to-pink-500',
      secondary: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      accent: 'text-purple-500'
    }
  };
  
  return (
    <MainLayout role={userRole}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 pb-10"
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Configuración</h1>
            <p className="text-muted-foreground">Personaliza tu experiencia en CodeVerse</p>
          </div>
          <Badge 
            className={`${roleColors[userRole].secondary} px-3 py-1 text-sm capitalize`}
          >
            {userRole} account
          </Badge>
        </motion.div>
        
        <Tabs defaultValue="account" className="w-full">
          <motion.div variants={itemVariants}>
            <TabsList className="grid grid-cols-4 md:w-fit">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Cuenta</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden md:inline">Notificaciones</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden md:inline">Privacidad</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden md:inline">Apariencia</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>
          
          {/* Account Tab */}
          <TabsContent value="account">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Información de perfil</CardTitle>
                  <CardDescription>
                    Actualiza tu información personal y detalles de cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nombre</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2 rounded-md border bg-background"
                        defaultValue={userRole === 'student' ? 'Ana Martínez' : userRole === 'teacher' ? 'Prof. Carlos López' : 'Admin Sistema'}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input 
                        type="email"
                        className="w-full px-3 py-2 rounded-md border bg-background"
                        defaultValue={`${userRole}..example.com`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nombre de usuario</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2 rounded-md border bg-background"
                        defaultValue={`${userRole}123`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rol</label>
                      <input 
                        type="text"
                        className="w-full px-3 py-2 rounded-md border bg-background/50"
                        value={userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
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
                    className={`bg-gradient-to-r ${roleColors[userRole].primary} text-white`}
                    onClick={() => {
                      toast({
                        title: "Perfil actualizado",
                        description: "Los cambios han sido guardados correctamente."
                      });
                    }}
                  >
                    <Save className="mr-2 h-4 w-4" /> Guardar cambios
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div variants={itemVariants}>
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
                        onCheckedChange={() => handleToggleSetting('notifications', 'email')}
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
                        onCheckedChange={() => handleToggleSetting('notifications', 'push')}
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
                        onCheckedChange={() => handleToggleSetting('notifications', 'updates')}
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
                        onCheckedChange={() => handleToggleSetting('notifications', 'newsletter')}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`bg-gradient-to-r ${roleColors[userRole].primary} text-white ml-auto`} 
                    onClick={handleSaveSettings}
                  >
                    <Save className="mr-2 h-4 w-4" /> Guardar preferencias
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <motion.div variants={itemVariants}>
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
                        onCheckedChange={() => handleToggleSetting('privacy', 'publicProfile')}
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
                        onCheckedChange={() => handleToggleSetting('privacy', 'showProgress')}
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
                        onCheckedChange={() => handleToggleSetting('privacy', 'shareActivity')}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`bg-gradient-to-r ${roleColors[userRole].primary} text-white ml-auto`} 
                    onClick={handleSaveSettings}
                  >
                    <Save className="mr-2 h-4 w-4" /> Guardar preferencias
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <motion.div variants={itemVariants}>
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
                          setSettings(prev => ({...prev, darkMode: !prev.darkMode}));
                          document.documentElement.classList.toggle('dark');
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
                          variant={settings.appearance.codeTheme === 'light' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSettings(prev => ({
                            ...prev, 
                            appearance: {...prev.appearance, codeTheme: 'light'}
                          }))}
                          className={settings.appearance.codeTheme === 'light' 
                            ? `bg-gradient-to-r ${roleColors[userRole].primary} text-white` 
                            : ''}
                        >
                          Claro
                        </Button>
                        <Button
                          variant={settings.appearance.codeTheme === 'dark' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSettings(prev => ({
                            ...prev, 
                            appearance: {...prev.appearance, codeTheme: 'dark'}
                          }))}
                          className={settings.appearance.codeTheme === 'dark' 
                            ? `bg-gradient-to-r ${roleColors[userRole].primary} text-white` 
                            : ''}
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
                        onCheckedChange={() => handleToggleSetting('appearance', 'denseMode')}
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
                        onCheckedChange={() => handleToggleSetting('appearance', 'animations')}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`bg-gradient-to-r ${roleColors[userRole].primary} text-white ml-auto`} 
                    onClick={handleSaveSettings}
                  >
                    <Save className="mr-2 h-4 w-4" /> Guardar preferencias
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  );
};

export default Settings;