import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import HomePage from './pages/Home';
import HomogeneousDiffusionDemoPage from './pages/homodiff-demo-page';
import React from 'react';
import Blog from './blog-template/Blog';
import Layout from './layout/Layout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="template" element={<Blog />} />
        </Route>
        {/* <Route path="/demo/homo" element={<HomogeneousDiffusionDemoPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
