import React from "react";
import { Container, Stack } from "react-bootstrap";
import logo from "../assets/BudgetBoyLogo.png"


function Error404() {
    return(
        <Container>
            <Container>
                <BB_Nav/>
            </Container>
            <h1>Error 404</h1>
            <p>Hmm, that page doesn't exist...</p>
        </Container>           
    )
}

export default Error404;