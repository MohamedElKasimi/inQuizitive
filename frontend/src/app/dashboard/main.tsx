"use client";

import React, { useEffect, useState } from "react";
import { fetchUserFiles, uploadFile } from "../utils/api";
import { Box, Typography, Grid, Button, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface File {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  upload_date: string;
}

export default function Main() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await fetchUserFiles();
        setFiles(data);
      } catch (err) {
        setError("Failed to load files.");
        console.error(err);
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

      <Grid container spacing={1} className="mt-10">
        {files.map((file) => (
          <Grid item xs={4} sm={3} md={2} key={file.id}>
            <div className="flex flex-col justify-center items-center p-4 border border-gray-300 rounded-xl shadow-md">
              <Typography className="font-itim text-sm text-center truncate">{file.file_name}</Typography>
              <Typography className="font-itim text-xs text-gray-500">
                Type: {file.file_type}
              </Typography>
              <Typography className="font-itim text-xs text-gray-500">
                Size: {(file.file_size / 1024).toFixed(2)} KB
              </Typography>
              <Typography className="font-itim text-xs text-gray-500">
                Uploaded: {new Date(file.upload_date).toLocaleDateString()}
              </Typography>
              <Button variant="contained" className="mt-2 w-full bg-blue-500 text-white font-itim">
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
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <IconButton component="span" className="text-blue-500 text-4xl">
                <AddCircleOutlineIcon />
              </IconButton>
              <Typography className="font-itim text-xs text-center text-gray-500 mt-2">
                Upload File
              </Typography>
            </label>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
