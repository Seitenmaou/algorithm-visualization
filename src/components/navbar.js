import React from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function NavigationBar ({contents, homePath}) {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Navbar.Brand href={`${homePath}`}>Algorithm Visualization</Navbar.Brand>
            <Nav className="me-auto">
            <Nav.Link href={`${homePath}`}>Home</Nav.Link>
            {contents.map((row, rowIndex) => (
                <NavDropdown title={row.categoryName} id={row.categoryName.toLowerCase().replaceAll(' ', '-')}>
                        {row.algos.map((col, colIndex) => (
                            <NavDropdown.Item href={`${homePath}/${col.path}`}>{col.name}</NavDropdown.Item>
                        ))}
                </NavDropdown>
            ))}
            </Nav>
        </Navbar>
    );
};