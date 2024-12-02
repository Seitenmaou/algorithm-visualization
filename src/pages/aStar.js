import {useState, useEffect} from 'react'

import '../css/aStar.css'

export default function AStar () {
    const defaultGridWidth = 20
    const defaultGridHeight= 10
    const [grid, setGrid] = useState([])
    const [start, setStart] = useState({ x: 0, y: 0, weight: 1, g: 0, h: 0, f: 0 })
    const [target, setTarget] = useState({ x: defaultGridHeight-1, y: defaultGridWidth-1, weight: 1, g: 0, h: 0, f: 0 })
  
    function resetGrid() {
      let gridArray = [];
      for (let coordX = 0; coordX < defaultGridHeight; coordX++) {
        let row = [];
        for (let coordY = 0; coordY < defaultGridWidth; coordY++) {
          row.push({
            x: coordX,
            y: coordY,
            weight: 1,
            g: 0,
            h: 0,
            f: 0,
            status: 'default' // Reset status to 'default'
          });
        }
        gridArray.push(row);
      }
      setGrid(gridArray); // Set grid state to reset grid
    }
    
    useEffect(() => {
      resetGrid()
    }, []);


    function randomizeStartEnd(){
      function generateDistinctPairs(maxX, maxY) {
        function getRandomPair() {
            return [Math.floor(Math.random() * (maxX + 1)), Math.floor(Math.random() * (maxY + 1))];
        }
        let pair1 = getRandomPair();
        let pair2 = getRandomPair();
        while (pair1[0] === pair2[0] && pair1[1] === pair2[1]) {
            pair2 = getRandomPair();
        }
        return [pair1, pair2];
    }
    let coordiantes = generateDistinctPairs(defaultGridHeight-1, defaultGridWidth-1)
    // console.log(coordiantes)
      setStart({ x: coordiantes[0][0], y: coordiantes[0][1], weight: 1, g: 0, h: 0, f: 0 })
      setTarget({ x: coordiantes[1][0], y: coordiantes[1][1], weight: 1, g: 0, h: 0, f: 0 })
    }

    function manhattanDistance(a, b) {
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
  
    function aStarStep (openList,travelledPath, newGrid, closedList,neighborDirections) {
      //sort lowest f value
      openList.sort((a, b) => a.f - b.f);
      //set current with lowest f value
      let currentNode = openList.shift();
      
      // if current is goal, backtrack
      if (currentNode.x === target.x && currentNode.y === target.y) {
        let path = [];
        let temp = currentNode;
        while (travelledPath.has(temp)) {
          path.unshift(temp);
          if (path.length > 1) {
            newGrid[temp.x][temp.y].status = 'path';
          }
          temp = travelledPath.get(temp);
        }
        path.unshift(start);
        console.log(path)
        setGrid(newGrid);
        return path;
      }
  
      // currnet node to closed list (string for easier find)
      closedList.add(`${currentNode.x},${currentNode.y}`);
  
      // get neighbors
      for (let direction of neighborDirections) {
        let neighborX = currentNode.x + direction.x;
        let neighborY = currentNode.y + direction.y;
  
        // check neighbor boutds
        if (neighborX < 0 || neighborY < 0 || neighborX > grid.length - 1 || neighborY > grid[0].length - 1) {
          continue;
        }
  
        let neighbor = grid[neighborX][neighborY];
  
        // if neighbor is in close list, skip
        if (closedList.has(`${neighbor.x},${neighbor.y}`)) {
          continue;
        }
        neighbor.status = 'checking'
        // get G, or cost from start to this neighbor node
        let neighborG = currentNode.g + neighbor.weight;
  
        // if neighbor is not in open, or has smaller G value
        if (!openList.includes(neighbor) || neighborG < neighbor.g) {
          neighbor.g = neighborG;
          neighbor.h = manhattanDistance(neighbor, target);
          neighbor.f = neighbor.g + neighbor.h;
          
          //add to travelled path
          travelledPath.set(neighbor, currentNode);
  
          //add to open
          if (!openList.includes(neighbor)) {
            openList.push(neighbor);
          }
        }
      }
    }

    function aStarStepLoop(openList,travelledPath, newGrid, closedList,neighborDirections){
      while (openList.length > 0) {
        aStarStep(openList,travelledPath, newGrid, closedList,neighborDirections)
      }
    }

    function aStar (grid, start, target) {
      // resetGrid()
      let openList = [];
      let closedList = new Set();

      //for displaying
      let newGrid = grid.map(row => row.map(cell => ({ ...cell })));
      newGrid[start.x][start.y].status = 'start'
      newGrid[target.x][target.y].status = 'target'
    
      start.g = 0;
      start.h = manhattanDistance(start, target);
      start.f = start.g + start.h;
      openList.push(start);
    
      let travelledPath = new Map();
    
      const neighborDirections = [
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: -1, y: 0 }
      ];
    

      aStarStepLoop(openList,travelledPath, newGrid, closedList,neighborDirections)
      //if no path was found
      console.log("No Path")
      return null;
    }
  
    return (
      <div id='pageContainer'>
        <div id='gridContainer'>
          {grid.map((row, rowIndex) => (
            <div className='rows' key={rowIndex}>
              {row.map((cell) => (
                <span className={`cells ${cell.status}`} key={cell.y}>{cell.weight}</span>
              ))}
            </div>
          ))}
        </div>
        <div id='menu'>
          <h1>Controls</h1>
          <button onClick={() => aStar(grid, start, target)}>Simulate</button>
          <button onClick={() => {resetGrid(); randomizeStartEnd()}}>Random Start-Target</button>
          <button onClick={() => resetGrid()}>Reset</button>
        </div>
      </div>
    );
}