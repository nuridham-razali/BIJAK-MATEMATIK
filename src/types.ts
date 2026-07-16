export type Student = {
  id: string;
  name: string;
  year: number; // 1 to 6
  avatar: string;
  pin: string; // 4 digit
  totalScore: number;
};

export type ParentProfile = {
  id: string;
  email: string;
  paymentStatus: "paid" | "unpaid";
  createdAt: number;
};

export type QuizResult = {
  id: string;
  topicId: string;
  score: number;
  total: number;
  completedAt: number;
};

export type Topic = {
  id: string;
  year: number;
  title: string;
  description: string;
  color: string;
};

export type Question = {
  id: string;
  difficulty: "mudah" | "sederhana" | "kbat";
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  imageUrl?: string;
};
