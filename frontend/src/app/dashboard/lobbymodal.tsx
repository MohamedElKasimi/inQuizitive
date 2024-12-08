import React from "react";
import { Modal, Box, Typography, Button, List, ListItem } from "@mui/material";

interface LobbyModalProps {
  open: boolean;
  onClose: () => void;
  lobbyCode: string;
  players: string[];
  onStartQuiz: () => void;
}

const LobbyModal: React.FC<LobbyModalProps> = ({ open, onClose, lobbyCode, players, onStartQuiz }) => {
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
        <Typography variant="h6" gutterBottom>
          Multiplayer Lobby
        </Typography>
        <Typography variant="body1" gutterBottom>
          Lobby Code: <strong>{lobbyCode}</strong>
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Players:
        </Typography>
        <List>
          {players.map((player, index) => (
            <ListItem key={index}>{player}</ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" onClick={onStartQuiz}>
          Start Quiz
        </Button>
      </Box>
    </Modal>
  );
};

export default LobbyModal;
