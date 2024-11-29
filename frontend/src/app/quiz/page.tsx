"use client";

import { useEffect, useState } from "react";
import Header from "../components/header";
import { generateQuiz } from "../utils/api";
import { useAuth } from "../contexts/context";
import { CircularProgress, Box, Typography } from "@mui/material";
import QuizModals from "./quiz";
import { useRouter } from "next/navigation";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function Quiz() {
  const { fileID } = useAuth();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!fileID) {
      console.error("File ID is not set. Redirecting...");
      router.push("dashboard");
      return;
    }

    const fetchQuiz = async () => {
  try {
    const data = await generateQuiz(fileID);
    console.log("Fetched quiz data:", data);

    // Extract the quiz array from the response
    const quizData = data.quiz;

    if (Array.isArray(quizData) && quizData.every(
      (item) =>
        typeof item.question === "string" &&
        Array.isArray(item.options) &&
        typeof item.correctAnswer === "number"
    )) {
      setQuiz(quizData); // Set the extracted quiz array
    } else {
      console.error("Invalid quiz data format:", quizData);
    }
  } catch (err) {
    console.error("Failed to generate quiz:", err);
  } finally {
    setLoading(false);
  }
};

    fetchQuiz();
  }, [fileID]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Header />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  if (!quiz || quiz.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Header />
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Failed to load quiz data. Please try again later.
          </Typography>
        </Box>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <QuizModals quizData={quiz} />
      </Box>
    </div>
  );
}
