"use client";
import React, { useEffect, useState } from "react";
import { fetchUserFiles, uploadFile, deleteFile } from "../utils/api";
import { Box, Typography, Grid, Button, IconButton, Menu, MenuItem } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import QuizModal from "./modal";

interface File {
  id: number;
  file_name: string;
  file_size: number;
  upload_date: string;
  high_score: number;
}

export default function Main() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal visibility
  const [selectedFileID, setSelectedFileID] = useState<number | null>(null); // State for the selected file ID
  const [score, setScore] = useState<number | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuFileID, setMenuFileID] = useState<number | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const data = await fetchUserFiles();
        setFiles(data);
      } catch (err) {
        setError("Failed to load files.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    try {
      const response = await uploadFile(file); // Call your upload API function
      setFiles((prevFiles) => [...prevFiles, response]); // Append the uploaded file to the list
    } catch (err) {
      console.error("File upload failed", err);
    }
  };

  const handleOpenModal = (fileID: number, score: number | null) => {
    setSelectedFileID(fileID); // Set the selected file ID
    setScore(score ?? 0); // Handle null/undefined scores
    setModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };

  const handleSelectMode = (mode: string) => {
    console.log("Selected Quiz Mode:", mode);
    console.log("Selected File ID:", selectedFileID); // Access the selected file's ID
    setModalOpen(false); // Close the modal after selecting mode
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, fileID: number) => {
    setMenuAnchor(event.currentTarget);
    setMenuFileID(fileID);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuFileID(null);
  };

  const handleDeleteFile = async () => {
    if (menuFileID === null) return;

    try {
      await deleteFile(menuFileID); // Call the delete API
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== menuFileID)); // Remove the file from state
      handleMenuClose();
    } catch (error) {
      console.error("Failed to delete file", error);
    }
  };

  return (
    <Box padding={2}>
      <Typography variant="h6" gutterBottom className="font-itim text-xl">
        Your Uploaded Files
      </Typography>

      {error && (
        <Typography className="text-red-500 text-sm font-itim">
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography className="font-itim text-center">Loading files...</Typography>
      ) : (
        <Grid container spacing={1} className="mt-10">
          {files.map((file) => (
            <Grid item xs={4} sm={3} md={2} key={file.id}>
              <div className="flex flex-col justify-center items-center p-4 border border-gray-300 rounded-xl shadow-md relative">
                {/* Three dots menu */}
                <IconButton
                  size="small"
                  className="absolute top-1 right-1"
                  onClick={(e) => handleMenuOpen(e, file.id)}
                >
                  <MoreVertIcon />
                </IconButton>

                <Typography className="font-itim text-sm text-center h-10 max-h-10">{file.file_name}</Typography>
                <Typography className="font-itim text-xs text-gray-500">
                  High Score: {file.high_score ?? 0}
                </Typography>
                <Typography className="font-itim text-xs text-gray-500">
                  Uploaded: {new Date(file.upload_date).toLocaleDateString()}
                </Typography>
                <Button
                  variant="contained"
                  className="mt-2 w-full bg-orange text-white font-itim"
                  onClick={() => handleOpenModal(file.id, file.high_score)} // Pass the file ID and score to the modal
                >
                  Generate Quiz
                </Button>
              </div>
            </Grid>
          ))}

          {/* Upload File Card */}
          <Grid item xs={4} sm={3} md={2}>
            <div
              className="flex flex-col justify-center items-center p-4 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:border-blue-500"
            >
              <label htmlFor="file-upload-input">
                <input
                  id="file-upload-input"
                  type="file"
                  accept="application/pdf" // Restrict file explorer to show only PDF files
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                <IconButton component="span" className="text-blue-500 text-4xl flex justify-center align-center items-center">
                  <AddCircleOutlineIcon />
                </IconButton>
                <Typography className="font-itim text-xs text-center text-gray-500 mt-2">
                  Upload File
                </Typography>
              </label>
            </div>
          </Grid>
        </Grid>
      )}

      {/* Menu for File Options */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteFile} className="text-red-500">
          Delete
        </MenuItem>
      </Menu>

      {/* Quiz Modal */}
      <QuizModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSelectMode={handleSelectMode}
        fileID={selectedFileID ?? -1}
        oldScore={score}
      />
    </Box>
  );
}
