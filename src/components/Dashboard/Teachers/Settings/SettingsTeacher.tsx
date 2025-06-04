import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MainLayout from "../../../Layout/MainLayout";
import { Badge } from "../../../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { useToast } from "../../../../hooks/use-toast";
import { Bell, Shield, User, Palette } from "lucide-react";
import { useAuth } from "../../../../hooks/useAuth";
import { API_BASE_URL, API_ENDPOINTS } from "../../../../api/config";
import ProfileForm from "./ProfileForm";
import NotificationsSettings from "./NotificationsSettings";
import PrivacySettings from "./PrivacySettings";
import AppearanceSettings from "./AppearanceSettings";
import type { Profile, Settings, RoleColors } from "./type";

const SettingsTeacher: React.FC = () => {
  const { user } = useAuth();
  const userRole = "teacher";
  const { toast } = useToast();

  // Estado del perfil editable
  const [profile, setProfile] = useState<Profile>({
    first_name: "",
    last_name: "",
    email: "",
    avatar_url: "",
    bio: "",
    location: "",
    website_url: "",
    date_of_birth: "",
    preferred_language: "es",
    role: userRole,
  });

  useEffect(() => {
    if (!user?.id) return;
    const token = localStorage.getItem("authToken");
    fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.BY_ID(user.id)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          avatar_url: data.avatar_url || "",
          bio: data.bio || "",
          location: data.location || "",
          website_url: data.website_url || "",
          date_of_birth: data.date_of_birth || "",
          preferred_language: data.preferred_language || "es",
          role: data.role || userRole,
        });
      });
  }, [user?.id]);

  const [settings, setSettings] = useState<Settings>({
    darkMode: false,
    notifications: {
      email: true,
      push: true,
      updates: true,
      newsletter: false,
    },
    privacy: {
      publicProfile: true,
      showProgress: true,
      shareActivity: false,
    },
    appearance: {
      denseMode: false,
      animations: true,
      codeTheme: "dark",
    },
  });

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleToggleSetting = (
    category: keyof Settings,
    setting: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] as Record<string, boolean>),
        [setting]: !((prev[category] as Record<string, boolean>)[setting]),
      },
    }));
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });
      if (!response.ok) throw new Error("Error al actualizar el perfil");

      // Vuelve a obtener el perfil actualizado
      const updatedProfileRes = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const updatedProfile = await updatedProfileRes.json();
      setProfile({
        first_name: updatedProfile.first_name || "",
        last_name: updatedProfile.last_name || "",
        email: updatedProfile.email || "",
        avatar_url: updatedProfile.avatar_url || "",
        bio: updatedProfile.bio || "",
        location: updatedProfile.location || "",
        website_url: updatedProfile.website_url || "",
        date_of_birth: updatedProfile.date_of_birth || "",
        preferred_language: updatedProfile.preferred_language || "es",
        role: updatedProfile.role || userRole,
      });

      toast({
        title: "Perfil actualizado",
        description: "Los cambios han sido guardados correctamente.",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil.",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = () => {
    // Aquí deberías guardar los settings en el backend
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
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const roleColors: Record<string, RoleColors> = {
    teacher: {
      primary: "from-green-500 to-emerald-500",
      secondary: "bg-green-500/10 text-green-400 border-green-500/20",
      accent: "text-green-500",
    },
  };

  return (
    <MainLayout role={userRole}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 pb-10"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold">Configuración</h1>
            <p className="text-muted-foreground">
              Personaliza tu experiencia en CodeVerse
            </p>
          </div>
          <Badge
            className={`${roleColors[userRole].secondary} px-3 py-1 text-sm capitalize`}
          >
            Cuenta de profesor
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
              <ProfileForm
                profile={profile}
                handleProfileChange={handleProfileChange}
                handleSaveProfile={handleSaveProfile}
                roleColors={roleColors[userRole]}
              />
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div variants={itemVariants}>
              <NotificationsSettings
                settings={settings}
                handleToggleSetting={handleToggleSetting}
                handleSaveSettings={handleSaveSettings}
                roleColors={roleColors[userRole]}
              />
            </motion.div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <motion.div variants={itemVariants}>
              <PrivacySettings
                settings={settings}
                handleToggleSetting={handleToggleSetting}
                handleSaveSettings={handleSaveSettings}
                roleColors={roleColors[userRole]}
              />
            </motion.div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <motion.div variants={itemVariants}>
              <AppearanceSettings
                settings={settings}
                setSettings={setSettings}
                handleToggleSetting={handleToggleSetting}
                handleSaveSettings={handleSaveSettings}
                roleColors={roleColors[userRole]}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  );
};

export default SettingsTeacher;