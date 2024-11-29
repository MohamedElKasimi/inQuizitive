"use client";

import React, { useState, useEffect } from "react";
import { Slide, Box, Button, Typography } from "@mui/material";
import {useRouter} from "next/navigation";
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
  const router = useRouter();
  const { fileID } = useAuth();
  const { high_score } = useAuth();

  // Calculate score for the current question
  const calculatePoints = (responseTime: number, questionTimer: number) => {
    if (responseTime <= 0.5) return MAX_POINTS; // Max points for responses under 0.5 seconds
    const points = Math.floor(
      (1 - (responseTime / questionTimer) / 2) * MAX_POINTS
    );
    return points;
  };

  const handleNextQuestion = () => {
    setInProp(false); // Trigger slide-out animation
    setTimeout(() => {
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

    const correctAnswer = quizData[currentIndex].correctAnswer;
    const responseTime = (Date.now() - startTime) / 1000; // Calculate response time in seconds
    const questionTimer = 10; // Assume a fixed 10-second timer for each question

    if (optionIndex === correctAnswer) {
      const points = calculatePoints(responseTime, questionTimer);
      setScore((prevScore) => prevScore + points); // Update the score
      alert(`Correct! You scored ${points} points.`);
    } else {
      alert("Kill yourself faggot!");

    }

    handleNextQuestion();
  };

  useEffect(() => {
    setStartTime(Date.now()); // Set start time for the first question
  }, []);

  if (quizFinished) {
    if((high_score ?? 0) < score){
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
          onClick={() => router.push('dashboard')} // Restart the quiz (for demo purposes)
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
          {quizData[currentIndex]?.options.map((option, index) => (
            <Button
              className="font-itim"
              key={index}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginBottom: 2 }}
              onClick={() => handleAnswer(index)}
            >
              {option}
            </Button>
          ))}
        </Box>
      </Slide>
    </Box>
  );
};

export default QuizModals;
