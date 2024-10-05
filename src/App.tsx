import {
    Route,
    BrowserRouter as Router,
    Routes,
} from 'react-router-dom';
import DiffusionDemoPage from './pages/home-page';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DiffusionDemoPage />} />
            </Routes>
        </Router>
    );
};

export default App;
