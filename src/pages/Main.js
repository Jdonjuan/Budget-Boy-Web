import React from "react";
import { Button, Container, Stack } from "react-bootstrap";
import logo from "../assets/BudgetBoyLogo.png"
import './Main.css'

function Main() {
    return(
        <Container className="my-4" >
            <header>
                <Stack direction="horizontal" gap="2" className="mb-4">
                    <img src={logo} width="100" />
                    <h1 className="me-auto">Budget Boy</h1>
                    <Button variant="primary" href="https://budgetboy.auth.us-east-1.amazoncognito.com/login?client_id=1k6ld9m89ikfp4nptvshj5aqd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=https://budgetboy.net/Defaultbudget">Sign in</Button>
                </Stack>
            </header>
            <body className="my-4">
                <Stack >
                    <h1>What is Budget Boy?</h1>
                    <p>Budget Boy is an online web app that helps you track your spending and stick to your budget!</p>
                    <Container>
                        <Button href="https://budgetboy.auth.us-east-1.amazoncognito.com/login?client_id=1k6ld9m89ikfp4nptvshj5aqd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=https://budgetboy.net/Defaultbudget">Sign in</Button>
                    </Container>
                    
                </Stack>
            </body>
            <footer>
                <Stack direction="horizontal">
                    <Container>
                        <p>Privacy</p>
                    </Container>
                    <Container>
                        <p>Terms</p>
                    </Container>
                    
                </Stack>
                
            </footer>
            
        </Container>
    )
}

export default Main;