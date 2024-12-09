
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/home';
import AStar from './pages/aStar';
import NavigationBar from './components/navbar'

const homePath = '/algorithm-visualization'

//used to fill page links and navbar
const contents = [
  {categoryName:'2D Grid Pathfind', algos: [
    {name: 'A Star', description: 'A pathfinding algo', path: 'a-star'},
    {name: '[PH] Dijkstra', description: 'A pathfinding algo', path: ''},
    {name: '[PH] Breadth-First', description: 'A pathfinding algo', path: ''},
    {name: '[PH] Depth-First', description: 'A pathfinding algo', path: ''}
  ]},
  {categoryName:'[PH] Sort', algos: [
    {name: '[PH] Bubble', description: 'A sorting algo', path: ''},
    {name: '[PH] Selection', description: 'A sorting algo', path: ''},
    {name: '[PH] Insertion', description: 'A sorting algo', path: ''},
    {name: '[PH] Merge', description: 'A sorting algo', path: ''},
    {name: '[PH] Quick', description: 'A sorting algo', path: ''},
    {name: '[PH] Heap', description: 'A sorting algo', path: ''}
  ]},
  {categoryName:'[PH] Search', algos: [
    {name: '[PH] Linear', description: 'A search algo', path: ''},
    {name: '[PH] Binary', description: 'A search algo', path: ''},
    {name: '[PH] Jump', description: 'A search algo', path: ''},
    {name: '[PH] Doubling', description: 'A search algo', path: ''}
  ]},
]

function App() {
  return (
    <Router>
            <NavigationBar contents={contents} homePath={homePath}/>
            <Routes>
                <Route exact path = {homePath} element={<Home contents={contents} homePath={homePath}/>}/>
                <Route exact path={`${homePath}/a-star`} element={<AStar/>}/>
            </Routes>
        </Router>
  )
}

export default App;
