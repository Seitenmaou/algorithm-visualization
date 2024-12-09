import { Container, Row, Col, Button, Card, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Home ({ contents, homePath }) {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(`./${path}`);
  };
  useEffect(() => {
    document.title = "Algorithm Visualization";
  }, []);

  return (
    <Container>
        <Col>
        <h1>About</h1>
        <p>This page is a collection of algorithm visualizations. Many coming soon!</p>
      {contents.map((row, rowIndex) => (
          <Accordion defaultActiveKey={rowIndex}>
            <Accordion.Item eventKey={rowIndex}>
              <Accordion.Header><h3>{row.categoryName}</h3></Accordion.Header>
              <Accordion.Body>
                <Row key={rowIndex}>
                        {row.algos.map((col, colIndex) => (
                        <Col key={`${rowIndex}-${colIndex}`}>
                            <Card style={{ width: '18rem' }}>
                            {/* <Card.Img variant="top" src="" /> */}
                            <Card.Body>
                                <Card.Title>{col.name}</Card.Title>
                                <Card.Text>{col.description}</Card.Text>
                                <Button onClick={() => handleClick(col.path)} variant="primary">
                                Visualize
                                </Button>
                            </Card.Body>
                            </Card>
                        </Col>
                        ))}
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
      ))}
        </Col>
    </Container>
  );
}
