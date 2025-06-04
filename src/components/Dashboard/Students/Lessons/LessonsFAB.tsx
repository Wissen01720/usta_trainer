import React from "react";
import { Button } from "../../../ui/button";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

const LessonsFAB: React.FC = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1, duration: 0.5 }}
    className="fixed bottom-8 right-8 z-50"
  >
    <Button
      size="lg"
      className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Zap className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </motion.div>
    </Button>
  </motion.div>
);

export default LessonsFAB;