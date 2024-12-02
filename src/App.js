
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Home from './pages/home';
import AStar from './pages/aStar';
import Navbar from './components/navbar';

function App() {
  return (
    <Router>
            <Navbar />
            <Routes>
                <Route exact path = "/" element={<Home/>}/>
                <Route exact path="/astar" element={<AStar/>}/>
            </Routes>
        </Router>
  )
}

export default App;
