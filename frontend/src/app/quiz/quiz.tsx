"use client";

import React, { useState, useEffect } from "react";
import { Slide, Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/context";
import { updateScore } from "../utils/api";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizModalsProps {
  quizData: QuizQuestion[];
}

const MAX_POINTS = 1000; // Maximum points possible for each question

const QuizModals: React.FC<QuizModalsProps> = ({ quizData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inProp, setInProp] = useState(true);
  const [score, setScore] = useState(0); // Track the total score
  const [startTime, setStartTime] = useState(Date.now()); // Track the start time for the question
  const [quizFinished, setQuizFinished] = useState(false); // Track whether the quiz is finished
  const [selectedOption, setSelectedOption] = useState<number | null>(null); // Track selected option
  const [showFeedback, setShowFeedback] = useState(false); // Track whether feedback is displayed
  const router = useRouter();
  const { fileID } = useAuth();
  const { high_score } = useAuth();

  const calculatePoints = (responseTime: number, questionTimer: number) => {
    if (responseTime <= 0.5) return MAX_POINTS; // Max points for responses under 0.5 seconds
    const points = Math.floor(
      (1 - (responseTime / questionTimer) / 2) * MAX_POINTS
    );
    if(points > 0){
      return points;
    }
    else{
      return 0;
    }
  };

  const handleNextQuestion = () => {
    setInProp(false); // Trigger slide-out animation
    setTimeout(() => {
      setSelectedOption(null); // Reset selected option
      setShowFeedback(false); // Reset feedback
      if (currentIndex + 1 >= quizData.length) {
        setQuizFinished(true); // Mark the quiz as finished after the last question
      } else {
        setCurrentIndex((prev) => prev + 1); // Go to the next question
        setStartTime(Date.now()); // Reset the question start time
      }
      setInProp(true); // Trigger slide-in animation
    }, 300); // Match animation duration
  };

  const handleAnswer = (optionIndex: number) => {
    if (!quizData[currentIndex]) return; // Safety check

    setSelectedOption(optionIndex); // Record selected option
    setShowFeedback(true); // Show feedback

    const correctAnswer = quizData[currentIndex].correctAnswer;
    const responseTime = (Date.now() - startTime) / 1000; // Calculate response time in seconds
    const questionTimer = 10; // Assume a fixed 10-second timer for each question

    if (optionIndex === correctAnswer) {
      const points = calculatePoints(responseTime, questionTimer);
      setScore((prevScore) => prevScore + points); // Update the score
    }

    setTimeout(handleNextQuestion, 2000); // Delay before moving to the next question
  };

  useEffect(() => {
    setStartTime(Date.now()); // Set start time for the first question
  }, []);

  if (quizFinished) {
    if ((high_score ?? 0) < score) {
      updateScore(fileID, score);
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 3,
          height: "100%",
        }}
      >
        <Typography className="font-itim" variant="h4" gutterBottom>
          Quiz Finished!
        </Typography>
        <Typography className="font-itim" variant="h6" gutterBottom>
          Your Total Score: {score}
        </Typography>
        <Button
          className="font-itim"
          variant="contained"
          color="primary"
          onClick={() => router.push("dashboard")}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  if (!quizData || quizData.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography className="font-itim" variant="h6" color="error">
          No questions available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: "600px",
        margin: "auto",
        width: "100%",
      }}
    >
      <Slide direction="left" in={inProp} mountOnEnter unmountOnExit>
        <Box
          sx={{
            width: "100%",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            background: "#fff",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography className="font-itim" variant="h5" gutterBottom>
            {quizData[currentIndex]?.question}
          </Typography>
{quizData[currentIndex]?.options.map((option, index) => {
  const isCorrect =
    showFeedback && index === quizData[currentIndex].correctAnswer;
  const isWrong = showFeedback && index !== quizData[currentIndex].correctAnswer;
  const isSelected = index === selectedOption;

  return (
    <button
      key={index}
      className={`font-itim w-full px-4 py-2 mb-2 rounded 
        ${
          showFeedback
            ? isCorrect
              ? "bg-green text-white" // Custom green for correct answer
              : isSelected && isWrong
              ? "bg-red text-white" // Custom red for wrong selected answer
              : "bg-gray-200 text-black" // Neutral for other options
            : "bg-dark-blue text-white" // Default state
        }`}
      onClick={() => handleAnswer(index)}
      disabled={showFeedback} // Disable buttons after selection
    >
      {option}
    </button>
  );
})}
        </Box>
      </Slide>
    </Box>
  );
};

export default QuizModals;
