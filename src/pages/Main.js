import React from "react";
import { Button, Container, Stack } from "react-bootstrap";
import logo from "../assets/BudgetBoyLogo.png"


function Main() {
    return(
        <Container className="my-4" >
            <header>
                <Stack direction="horizontal" gap="2" className="mb-4">
                    <img src={logo} width="50" />
                    <h1 className="me-auto">Budget Boy</h1>
                    <Button variant="primary">Sign in</Button>
                </Stack>
            </header>
            <body>
                <h1>Main Page</h1>
            </body>
            <footer>
                <p>Privacy Policy</p>
            </footer>
            
        </Container>
    )
}

export default Main;