'use client'

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    setFile(uploadedFile || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload file');

      const data = await res.json();
      setResponse(data.result);
    } catch (error) {
      console.error(error);
      setResponse('An error occurred while processing your file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      <div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Upload and Process Your File
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="file"
            accept=".pdf,.docx,.pptx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-300"
            disabled={!file || isLoading}
          >
            {isLoading ? 'Processing...' : 'Upload and Process'}
          </button>
        </form>

        {response && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">Result:</h2>
            <p className="mt-2 text-gray-800 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
