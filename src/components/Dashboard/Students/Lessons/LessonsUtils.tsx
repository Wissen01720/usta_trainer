// Transforma URLs de YouTube/Vimeo a formato embed con autoplay
export function getEmbedUrl(url: string) {
  if (!url) return "";
  if (url.includes("youtube.com/watch")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  }
  return url;
}

// Mensajes motivacionales según el progreso
export function getMotivationalMessage(progress: number) {
  if (progress === 0) return "¡Es hora de comenzar esta aventura! 🚀";
  if (progress < 25) return "¡Gran comienzo! Sigue así 💪";
  if (progress < 50) return "¡Vas por buen camino! 🌟";
  if (progress < 75) return "¡Increíble progreso! Ya casi llegas 🔥";
  if (progress < 100) return "¡Casi lo logras! El final está cerca 🏆";
  return "¡Misión cumplida! Eres increíble ✨";
}

// Colores dinámicos según el nivel
export function getLevelStyles(level: string) {
  switch (level) {
    case "Principiante":
      return {
        badge: "bg-gradient-to-r from-green-400/20 to-emerald-400/20 text-green-400 border-green-400/30",
        glow: "shadow-green-400/20"
      };
    case "Intermedio":
      return {
        badge: "bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-400 border-blue-400/30",
        glow: "shadow-blue-400/20"
      };
    case "Avanzado":
      return {
        badge: "bg-gradient-to-r from-purple-400/20 to-pink-400/20 text-purple-400 border-purple-400/30",
        glow: "shadow-purple-400/20"
      };
    default:
      return {
        badge: "bg-gray-400/20 text-gray-400 border-gray-400/30",
        glow: "shadow-gray-400/20"
      };
  }
}