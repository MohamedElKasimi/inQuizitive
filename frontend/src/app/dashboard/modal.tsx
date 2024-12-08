import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/context";
import LobbyModal from "./lobbymodal"; // Import the LobbyModal

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
  onSelectMode: (mode: string) => void;
  fileID: number;
  oldScore: number | null;
}

const QuizModal: React.FC<QuizModalProps> = ({ open, onClose, fileID, oldScore }) => {
  const [isMultiplayer, setIsMultiplayer] = useState(false); // State to handle multiplayer modal
  const [lobbyCode, setLobbyCode] = useState<string | null>(null); // Lobby code state
  const [players, setPlayers] = useState<string[]>([]); // List of players
  const router = useRouter();
  const { setFileID, setScore } = useAuth();

  // Function to handle multiplayer mode (open the lobby)
  const handleMultiplayerClick = () => {
    setIsMultiplayer(true);
    setLobbyCode("123ABC"); // For now, using a static code. In real-world, generate dynamically.
    setPlayers(["Player1", "Player2"]); // Add players dynamically (from API or socket)
  };

  // Function to handle starting the quiz
  const handleStartQuiz = () => {
    setFileID(fileID);
    setScore(oldScore);
    router.push("quiz");
  };

  // Function to handle selecting the single-player mode
  const handleSelectMode = (mode: string) => {
    setFileID(fileID);
    setScore(oldScore);
    router.push("quiz");
  };

  return (
    <div>
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
          <Typography variant="h6" gutterBottom>
            Select Quiz Mode
          </Typography>
          <Button
            variant="contained"
            color="primary"
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
            onClick={handleMultiplayerClick} // Trigger the multiplayer modal
          >
            Multiplayer
          </Button>
        </Box>
      </Modal>

      {/* Show the LobbyModal when multiplayer is selected */}
      <LobbyModal
        open={isMultiplayer}
        onClose={() => setIsMultiplayer(false)}
        lobbyCode={lobbyCode || ""}
        players={players}
        onStartQuiz={handleStartQuiz}
      />
    </div>
  );
};

export default QuizModal;
