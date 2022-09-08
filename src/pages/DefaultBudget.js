import React from "react";
import { Container, Stack } from "react-bootstrap";

// try api call to get budgets (or check if stored token exists/is valid), if get budgets works, get categories for default budget and display them to the screen
// if get budgets doesn't work, redirect to cognito sign in page. 

function DefaultBudget() {
    return(
        <Container>
            <h1>Default Budget page</h1>
        </Container>
    )
}

export default DefaultBudget;