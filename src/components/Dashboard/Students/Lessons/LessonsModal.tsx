import React from "react";
import LessonModal from "../../../Lessons/LessonModal";
import type { LessonType } from "../../../../types/lesson";

interface LessonsModalProps {
  lesson: LessonType | null;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  handleStartLesson: () => void;
}

const LessonsModal: React.FC<LessonsModalProps> = ({
  lesson,
  isModalOpen,
  setIsModalOpen,
  handleStartLesson
}) => (
  <LessonModal
    lesson={lesson}
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onStartLesson={handleStartLesson}
  />
);

export default LessonsModal;