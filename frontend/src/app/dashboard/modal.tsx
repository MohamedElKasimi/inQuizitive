import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/context";

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
  onSelectMode: (mode: string) => void;
  fileID: number;
  oldScore: number | null;
}

const QuizModal: React.FC<QuizModalProps> = ({ open, onClose, onSelectMode, fileID, oldScore}) => {
    const router = useRouter()
    const { setFileID } = useAuth();
    const { setScore } = useAuth();
    const handleSelectMode = (mode: string) => {
    setFileID(fileID);
    setScore(oldScore)
    router.push('quiz');
};

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" className="font-itim" gutterBottom>
          Select Quiz Mode
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className="font-itim"
          fullWidth
          onClick={() => handleSelectMode("single")}
          sx={{ mb: 2 }}
        >
          Single Player
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          className="font-itim"
          onClick={() => handleSelectMode("multi")}
        >
          Multiplayer
        </Button>
      </Box>
    </Modal>
  );
};

export default QuizModal;