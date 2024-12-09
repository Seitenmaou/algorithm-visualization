import { useState, useEffect } from 'react';
import '../css/aStar.css';
import { PersonWalking, EyeFill, Circle, Star  } from 'react-bootstrap-icons';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'

export default function AStar() {
    const [gridWidth, setGridWidth] = useState(15);
    const [gridHeight, setGridHeight] = useState(15);
    const [gridReset, setGridReset] = useState(false)
    const [simulating, setSimulating] = useState(false)
    const [simulated, setSimulated] = useState(false)
    const [cellChanger, setCellChanger] = useState(null);
    const [minSpeed, setMinSpeed] = useState(50)
    const numberOptions = [1,9,999]
    const [squareSize, setSquareSize] = useState(10);
    
    const [start, setStart] = useState({ x: 0, y: 0, weight: 1, g: 0, h: 0, f: 0 });
    const [target, setTarget] = useState({ x: gridHeight - 1, y: gridWidth - 1, weight: 1, g: 0, h: 0, f: 0 });
    const [grid, setGrid] = useState([]);
    const [diagonalsAllowed, setDiagonalsAllowed] = useState(false)
    const [openListDisplay, setOpenListDisplay] = useState([])
    const [closedListDisplay, setClosedListDisplay] = useState([])
    const [pathCost, setPathCost] = useState(0)
  

    useEffect(() => {
      //calculate size of square to fit in visual section
        const gridContainer = document.getElementById('gridContainer');
        const containerWidth = gridContainer.offsetWidth;
        const containerHeight = gridContainer.offsetHeight;

        const newSquareSize = Math.min(
          (containerWidth )/ (gridWidth *1.2),
          (containerHeight) / (gridHeight *1.2)
        );
        setSquareSize(newSquareSize);
    }, [grid]);

    //TODO: fix low numbers
    // handle changes in width
    const handleWidthInputChange = (event) => {
      const inputValue = Number(event.target.value);
      
      // value should be between 1 and 100
      if (!isNaN(inputValue) && inputValue > 0 && inputValue <= 100) {
        setGridWidth(inputValue);
        // setGridReset(true)
      }
    }
  
    // handle changes in height
    const handleHeightInputChange = (event) => {
      const inputValue = Number(event.target.value);
      
      //  value should be between 1 and 100
      if (!isNaN(inputValue) && inputValue > 0 && inputValue <= 100) {
        setGridHeight(inputValue);
      }
    }

    const handleDiagonalToggle = () => {
      setDiagonalsAllowed(prevState => !prevState);
    };

    const handleCellChangerButton = (number) => {
      setCellChanger(number);
    };
//TODO: fix double click for start and target selection (needing to double click to remove the old marker)
    const handleCellClick = (rowIndex, colIndex) => {
      if (cellChanger !== null) {
        if (!isNaN(cellChanger)){
          const newGrid = [...grid];
          newGrid[rowIndex][colIndex].weight = cellChanger;
          setGrid(newGrid);
        } else if (cellChanger === 'start'){
          setStart({ x: rowIndex, y: colIndex, weight: 1, g: 0, h: 0, f: 0 })
          let newGrid = grid.map(row => 
            row.map(cell => ({
                ...cell,
                status: 'default'
            }))
        );
        setGridReset(true)
          newGrid[start.x][start.y].status = 'start';
          setGrid(newGrid);
          
        } else if (cellChanger === 'target'){
          setTarget({ x: rowIndex, y: colIndex, weight: 1, g: 0, h: 0, f: 0 })
          let newGrid = grid.map(row => 
            row.map(cell => ({
                ...cell,
                status: 'default'
            }))
        );
        setGridReset(true)
          newGrid[target.x][target.y].status = 'target';
          setGrid(newGrid);
        }
      }
    };

    const handleSpeedChange = (event) => {
      setMinSpeed(event.target.value);
    };
    //TODO: X AND Y IS INVERTED

    // reset grid
    function resetGrid() {
        let gridArray = [];
        for (let coordX = 0; coordX < gridHeight; coordX++) {
            let row = [];
            for (let coordY = 0; coordY < gridWidth; coordY++) {
                row.push({
                    x: coordX,
                    y: coordY,
                    weight: 1,
                    g: 0,
                    h: 0,
                    f: 0,
                    status: 'default',
                });
            }
            gridArray.push(row);
        }
        setGrid(gridArray);
        setPathCost(0)
        setGridReset(true);
    }

    function randomizeWeightGrid() {
      let gridArray = [];
      for (let coordX = 0; coordX < gridHeight; coordX++) {
          let row = [];
          for (let coordY = 0; coordY < gridWidth; coordY++) {
              row.push({
                  x: coordX,
                  y: coordY,
                  weight: Math.floor(Math.pow(Math.random(), 3) * 9) + 1,
                  g: 0,
                  h: 0,
                  f: 0,
                  status: 'default',
              });
          }
          gridArray.push(row);
      }
      setGrid(gridArray);
      setPathCost(0)
      setGridReset(true);
  }

    useEffect(() => {
        resetGrid();
    }, []);

    useEffect(() => {
      if (gridReset) {
          // randomizeStartEnd();
          let newGrid = grid.map(row => row.map(cell => ({ ...cell })));
          newGrid[start.x][start.y].status = 'start';
          newGrid[target.x][target.y].status = 'target';
      
          setGrid(newGrid);
          setSimulated(false)
          setOpenListDisplay([])
          setClosedListDisplay([])
          setGridReset(false);
      }
  }, [gridReset]);

    // randomize start and target
    function randomizeStartEnd() {
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
      let coordinates = generateDistinctPairs(gridHeight - 1, gridWidth - 1);
      const newStart = { x: coordinates[0][0], y: coordinates[0][1], weight: 1, g: 0, h: 0, f: 0 };
      const newTarget = { x: coordinates[1][0], y: coordinates[1][1], weight: 1, g: 0, h: 0, f: 0 };
  
      setStart(newStart);
      setTarget(newTarget);

      let newGrid = grid.map(row => 
        row.map(cell => ({
            ...cell,
            status: 'default'
        }))
    );
      newGrid[newStart.x][newStart.y].status = 'start';
      newGrid[newTarget.x][newTarget.y].status = 'target';
  
      setGrid(newGrid);
      setSimulated(false)
  }
  
    function manhattanDistance(a,b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    function euclideanDistance(a,b) {
      return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2)
    }

    // one step of A Star
    async function aStarStep(travelledPath, openList, closedList, newGrid, neighborDirections) {
      openList.sort((a, b) => a.f - b.f);
  
        // take lowest f value
        let currentNode = openList.shift();

        // if current node is target, backtrack travelled
        if (currentNode.x === target.x && currentNode.y === target.y) {
          newGrid[currentNode.x][currentNode.y].status = 'target'
            let path = [];
            let temp = currentNode;
            let totalPathCost = 0;
            while (travelledPath.has(temp)) {
              console.log(temp)
              totalPathCost += temp.weight
                path.unshift(temp);
                if (path.length > 1) {
                    newGrid[temp.x][temp.y].status = 'path';
                }
                temp = travelledPath.get(temp);
            }
            path.unshift(start);
            totalPathCost += start.weight
            setGrid([...newGrid]);  
            setSimulating(false)
            setPathCost(totalPathCost)
            return path; // path found
        } else if (!(currentNode.x === start.x && currentNode.y === start.y)){
          newGrid[currentNode.x][currentNode.y].status = 'checking';
          setGrid([...newGrid]); 
        }

        // if current node was not target, add to closed list
        closedList.add(`${currentNode.x},${currentNode.y}`);

        // check neighbors in up down left right
        for (let direction of neighborDirections) {
            let neighborX = currentNode.x + direction.x;
            let neighborY = currentNode.y + direction.y;

            // skip neighbors off grid
            if (neighborX < 0 || neighborY < 0 || neighborX >= grid.length || neighborY >= grid[0].length) {
                continue;
            }

            let neighbor = grid[neighborX][neighborY];
            if (closedList.has(`${neighbor.x},${neighbor.y}`)) continue;

            await new Promise(resolve => setTimeout(resolve, 50)); // Delay for step visibility

            // calculate g (the weight from start)
            let neighborG = currentNode.g + neighbor.weight;

            // if neighbor is not in open list or has better g value
            if (!openList.includes(neighbor) || neighborG < neighbor.g) {
                neighbor.g = neighborG;
                if (diagonalsAllowed) {
                  neighbor.h = euclideanDistance(neighbor, target);
                } else {
                  neighbor.h = manhattanDistance(neighbor, target);
                }
                neighbor.f = neighbor.g + neighbor.h;

                // add to traveled path
                travelledPath.set(neighbor, currentNode);

                // add neighbor to open
                if (!openList.includes(neighbor)) {
                    openList.push(neighbor);
                }
            }
        }

        return null;
    }

    // a star
    async function aStar(grid, start, target) {
      setCellChanger(null)
      setSimulated(true)
      setSimulating(true)

        let openList = []
        setOpenListDisplay(openList)
        let closedList = new Set()
        setClosedListDisplay([])

        let newGrid = grid.map(row => row.map(cell => ({ ...cell })));
        newGrid[start.x][start.y].status = 'start';
        newGrid[target.x][target.y].status = 'target';

        start.g = 0;
        if (diagonalsAllowed) {
          start.h = euclideanDistance(start, target);
        } else {
          start.h = manhattanDistance(start, target);
        }
        start.f = start.g + start.h;
        start.weight = grid[start.x][start.y].weight
        openList.push(start);
        
        

        let travelledPath = new Map();
        let neighborDirections;

        // used later in a for loop to get neighbors
        if (diagonalsAllowed) {
          neighborDirections = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 1, y: 1 },
            { x: -1, y: -1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 }
          ];
        } else {
          neighborDirections = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 }
          ];
        }


        while (openList.length > 0) {
            // one a star step
            let path = await aStarStep(travelledPath, openList, closedList, newGrid, neighborDirections);
            if (path) {
                return path;
            }
            setOpenListDisplay([...openList])
            setClosedListDisplay(Array.from(closedList)); 
            // rendering delay
            await new Promise(resolve => setTimeout(resolve, minSpeed));
        }
        setSimulating(false)
        console.log("No Path... HOW?"); //SHOULD NEVER GET HERE BECAUSE THERES NO WALLS //TODO: probably should add walls
        return null;
    }

    //set size of cells to fit more of smaller or less of larger ones
    const cellStyle = {
      width: `${squareSize}px`,
      height: `${squareSize}px`,
    };

    return (
        <Container>
            <div id='gridContainer'>
              <div className='indexLabel'>
              <span className="cells cellLabel" key={`cellLabel-\\`} style={cellStyle}>
                    \
                  </span>
              {typeof grid.length === 'number' && grid.length > 0 ? (
                Array.from({ length: grid[0].length }).map((_, number) => (
                  <span className="cells cellLabel" key={`cellLabel-${number}`} style={cellStyle}>
                    {number}
                  </span>
                ))
              ) : (
                <p>Invalid grid width</p>
              )}

              </div>
                {grid.map((row, rowIndex) => (
                    <div className="rows" key={rowIndex}>
                      <span className="cells cellLabel" key={`cellLabelY-${rowIndex}`} style={cellStyle}>{rowIndex}</span>
                        {row.map((cell, colIndex) => (
                          <span className={`cells ${cell.status} weight-${cell.weight}`} key={cell.y} style={cellStyle} onClick={() => handleCellClick(rowIndex, colIndex)}>
                              {cell.weight}
                              <div className="iconBackground">
                                {cell.status === 'path' && <PersonWalking />}
                                {cell.status === 'checking' && <EyeFill />}
                                {cell.status === 'start' && <Circle />}
                                {cell.status === 'target' && <Star />}
                              </div>
                          </span>
                        ))}
                    </div>
                ))}
          </div>

          <div id="menu">
            <h1>Controls</h1>
            <Row className="my-2 d-flex justify-content-center">
            <Col md={4}>
                <Form.Group>
                  <Row>
                  <Form.Label>Width: </Form.Label>
                      <Form.Control
                        type="number"
                        value={gridWidth}
                        onChange={handleWidthInputChange}
                        max="100"
                        min="1"
                      />
                  </Row>
                </Form.Group>
            </Col>
            <Col md={4}>
                <Form.Group>
                  <Row>
                  <Form.Label>Height: </Form.Label>
                      <Form.Control
                        type="number"
                        value={gridHeight}
                        onChange={handleHeightInputChange}
                        max="100"
                        min="1"
                      />
                  </Row>
                </Form.Group>
            </Col>
            </Row>
            <Row className="my-2 d-flex justify-content-center">
            <Button className='w-50' variant='primary' onClick={() => aStar(grid, start, target, true)} disabled={simulated}>Simulate</Button>
            
            </Row>
            <Form>
              <Form.Check 
                type="checkbox" 
                label="Allow Diagonal Movement" 
                checked={diagonalsAllowed}
                onChange={handleDiagonalToggle}
                id="checkbox-toggle" 
              />
            </Form>
            <Form>
              <Form.Label>Min Speed: </Form.Label>
              <Form.Range value={minSpeed} onChange={handleSpeedChange} min={1} max={2001} step={100}/>
            </Form>
            <br/>
            <Row className="d-flex justify-content-center">
            <Col md={2}>
            <Button variant='secondary' onClick={() => resetGrid()} disabled={simulating}>Reset</Button>
            </Col>
            <Col md={5}>
            <Button variant='secondary' onClick={() => randomizeStartEnd()} disabled={simulating}>Rdm Start End</Button>
            </Col>
            <Col md={5}>
            <Button variant='secondary' onClick={() => randomizeWeightGrid()} disabled={simulating}>Rdm Weight</Button>
            </Col>
            </Row>
            <Row className="my-2 d-flex justify-content-center">
              <Col>
              <h3>Customization</h3>
              {numberOptions.map((number) => {
                return (
                  <Button variant='secondary' className="m-1"   key={number} disabled={simulating} onClick={() => handleCellChangerButton(number)}>
                    {number}
                  </Button>
                );
              })}
              <Button variant='secondary' className="m-1" disabled={simulating} onClick={() => handleCellChangerButton('start')}>
                    <Circle/>
                  </Button>
                <Button variant='secondary' className="m-1" disabled={simulating} onClick={() => handleCellChangerButton('target')}>
                  <Star/>
                </Button>
              </Col>
            </Row>
          </div>
          <div id='gridData'>
            <h1>Data</h1>
            <p>Total Cost of Path: {pathCost}</p>
            <div className='gridDataContainer'>
              <h2>Open List</h2>
              <p>Potential Search ({openListDisplay.length})</p>
              <div className='gridData' id='openList'>
              {openListDisplay.map((item) => {
                return (
                  <p key={`open-${item.y},${item.x}` } > 
                    {`(${item.y}, ${item.x}) f: ${item.f.toFixed(2)}`}
                  </p>
                );
              })}
              </div>
            </div>
            <div className='gridDataContainer'>
              <h2>Closed List</h2>
              <p>Searched ({closedListDisplay.length})</p>
              <div className='gridData' id='closedList'>
                {closedListDisplay.map((item) => (
                      <p key={`closed-${item}`}>
                          {`(${item.split(',').reverse().join(',')})`}
                      </p>
                  ))}
              </div>
            </div>
          </div>
        </Container>
    );
}
