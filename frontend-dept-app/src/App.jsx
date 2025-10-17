import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ChatsPage from './pages/ChatsPage';
import ProjectsPage from './pages/ProjectsPage';
import ArtifactsPage from './pages/ArtifactsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/artifacts" element={<ArtifactsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
