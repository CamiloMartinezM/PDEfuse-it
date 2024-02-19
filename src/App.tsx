import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import HomePage from './pages/home-page';
import HomogeneousDiffusionDemoPage from './pages/homodiff-demo-page';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo/homo" element={<HomogeneousDiffusionDemoPage />} />
      </Routes>
    </Router>
  );
};

export default App;
