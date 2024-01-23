import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import HomePage from './components/Homepage.tsx';
import ImageEditorPage from './components/ImageEditorPage.tsx';
import NavigationBar from './components/NavigationBar.tsx';

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<ImageEditorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
