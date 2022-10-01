import React from "react";
import { Button, Carousel, Container, Stack } from "react-bootstrap";
import logo from "../assets/BudgetBoyLogo.png"
import DesktopBudgetView from "../assets/DesktopBudgetView.png"
import DesktopEditBudgetView from "../assets/DesktopEditBudgetView.png"
import PhoneBudgetView from "../assets/PhoneBudgetView.jpg"
import PhoneEditBudget from "../assets/PhoneEditBudget.jpg"
import './Main.css'

function Main() {
    return(
        <Container className="my-4" >
            <header>
                <Stack direction="horizontal" gap="2" className="mb-4">
                    <img src={logo} width="100" />
                    <h1 className="me-auto">Budget Boy</h1>
                    <Button variant="primary" href="https://budgetboy.auth.us-east-1.amazoncognito.com/login?client_id=1k6ld9m89ikfp4nptvshj5aqd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=https://budgetboy.net/DefaultBudget">Sign in</Button>
                </Stack>
                <hr style={{
                    color: 'white'
                }} />
            </header>
            <body className="my-4">
                <Stack >
                    <h1>What is Budget Boy?</h1>
                    <p>Budget Boy is an online web app that helps you track your spending and stick to your budget!</p>
                    {/* <Container>
                        <img
                                className="w-50 border mb-5 mt-5"
                                // style={{height: 500, marginLeft: 100}}
                                src={DesktopBudgetView}
                                alt="Second slide"
                                />
                    </Container>
                    <Container>
                        <img
                                className="w-50 border mb-3"
                                // style={{height: 500, marginLeft: 100}}
                                src={DesktopEditBudgetView}
                                alt="Second slide"
                                />
                    </Container>
                    <Container>
                        <img
                                className="w-50 border mb-3"
                                // style={{height: 500, marginLeft: 100}}
                                src={PhoneBudgetView}
                                alt="Second slide"
                                />
                    </Container>
                    
                    <Container className="w-75 mb-4">
                    <Carousel >
                        <Carousel.Item interval={null}>
                            <img
                            className="d-block w-100"
                            style={{height: 500}}
                            src={DesktopBudgetView}
                            alt="First slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item interval={null}>
                            <img
                            className="d-block w-75"
                            style={{height: 500, marginLeft: 100}}
                            src={DesktopEditBudgetView}
                            alt="Second slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item interval={null}>
                            <img
                            className="d-block"
                            style={{height: 500, width: 300, marginLeft: 325}}
                            src={PhoneBudgetView}
                            alt="Third slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item interval={null}>
                            <img
                            className="d-block"
                            style={{height: 500, width: 300, marginLeft: 325}}
                            src={PhoneEditBudget}
                            alt="Third slide"
                            />
                        </Carousel.Item>
                    </Carousel>
                    </Container> */}
                    <Container>
                        <Button href="https://budgetboy.auth.us-east-1.amazoncognito.com/login?client_id=1k6ld9m89ikfp4nptvshj5aqd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=https://budgetboy.net/DefaultBudget">Sign in</Button>
                    </Container>
                    
                </Stack>
            </body>
            <footer>
                {/* <Stack direction="horizontal">
                    <Container>
                        <p>Privacy</p>
                    </Container>
                    <Container>
                        <p>Terms</p>
                    </Container>
                    
                </Stack> */}
                
            </footer>
            
        </Container>
    )
}

export default Main;