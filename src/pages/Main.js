import React from "react";
import { Button, Carousel, Container, Stack } from "react-bootstrap";
import logo from "../assets/BudgetBoyLogo.png"
import DesktopBudgetView from "../assets/DesktopBudgetView.png"
import DesktopEditBudgetView from "../assets/DesktopEditBudgetView.png"
import PhoneBudgetView from "../assets/PhoneBudgetView.jpg"
import PhoneEditBudget from "../assets/PhoneEditBudget.jpg"
import './Main.css'
import { SignInURL } from "../components/Vars.js"

function Main() {
    return(
        <Container className="my-4" >
            <header>
                <Stack direction="horizontal" gap="2" className="mb-4">
                    <img src={logo} width="100" />
                    <h1 className="me-auto">Budget Boy</h1>
                    <Button variant="primary" href={SignInURL}>Sign in</Button>
                </Stack>
                <hr style={{
                    color: 'black',
                    border: '1px solid'
                }} />
            </header>
            <div className="my-4">
                <Stack style={{
                    backgroundColor: '#c3ecf8'
                }}>
                    <div className="body-text">
                        <div className="body-section">
                            <h2>What is Budget Boy?</h2>
                            <p>Budget Boy is an online web app that helps you track your spending and stick to your budget!</p>
                            <p>Ever ask yourself:</p>
                            <ul>
                                <li>Can I afford this?</li>
                                <li>What's left in my food budget?</li>
                                <li>How much will I save this month on <span style={{textDecoration: "underline", whiteSpace: "pre"}}>                  </span>?</li>
                            </ul>
                            <p>Budget boy helps you answer these questions confidently!</p>
                        </div>
                        <div className="body-section">
                            <h2 className="mb-3">What makes Budget Boy special?</h2>
                            <ul>
                                <li>Simple, yet effective User Interface</li>
                                <li>Digital and Modernized "Envelope" method for budgeting</li>
                                <li>Quick access to reports to visualize your spending</li>
                            </ul>
                        </div>
                        
                        <div className="body-section">
                            <h2>Getting Started</h2>
                            {/* insert video on getting started (screen recording) */}
                            <p>Summary</p>
                            <ol>
                                <li>Create account and log in.</li>
                                <li>Create budget categories and amounts.</li>
                                <li>Bookmark or add to homescreen <b>https://www.budgetboy.net/DefaultBudget</b> </li>
                                <li>Add expenses throughout the month.</li>
                                <li>Review reports and save money!</li>
                            </ol>
                            <p>
                                After creating your account and logging in (you only need an email and password), you'll be brought to the Edit Budget
                                screen where you can start adding your categories and their amounts.
                            </p>
                            {/* Insert picture of Category Card on Edit Budget page */}
                            <p><br/> Legend</p>
                            <p>
                                <b>Category Name:</b> Name of the category like "Groceries", "Gas", or "Eating out." <br/>
                                <b>Max:</b> budget limit for this category like $200. <br/>
                                <b>Recurring:</b> Check this box for recurring expenses such as Netflix, Rent, or Electricity. When checked, the category max amount will be subtracted from your 
                                overall budget total at the beginning of the month. <br/> 
                                <b>Position:</b> this number identifies the order this category will appear on the default budget screen and in reports. <br/>
                            </p>
                            <p><br/><b>Standard Budgeting Method</b></p>
                            <p>If you want to be good at tracking all of your expenses in one place, while sticking to your budget, along with viewing patterns throughout the year, 
                                simply: 
                            </p>
                            <ul>
                                <li>Take some time to add all your expense categories to your budget.</li>
                                <li>Mark any fixed expenses as "Recurring."</li>
                                <li>Mark any variable expenses you don't want to worry about or don't have a problem managing as "Recurring."</li>
                                <li>Add expenses as you pay for them.</li>


                            </ul>
                            <p><br/><b>Improver Budgeting Method</b></p>
                            <p>If you are good at keeping your recurring expenses within budget (Rent, Electricity, Netflix, etc. ), but find difficulty in (or just want to focus on)  
                                managing variable expenses (Groceries, Eating out, Shopping, etc.), an effective method for Budgeting with Budget Boy would be to:  
                            </p>
                            <ul>
                                <li>Create a budget with only the categories you want to manage better (often variable expenses). These can be haircuts, eating out, Gas, etc.</li>
                            </ul>

                            {/* <p><br/><b>Flow Budgeting Method</b></p>
                            <p>If your style is more "go with the flow" or in other words, subtract your expenses as they occur (even the recurring ones): 
                            </p>
                            <ul>
                                <li>Create a budget using the Standard method</li>
                                <li>Setup reminders for recurring expenes on the day you get charged.</li>
                                <li></li>
                            </ul> */}


                        </div>
                    </div>
                    
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
                    <Container className="pb-3">
                        <Button href={SignInURL}>Get Started</Button>
                    </Container>
                    
                </Stack>
            </div>
            <footer  >
                <Stack direction="horizontal" gap={3}>
                    <div>
                        <a>Privacy</a>
                    </div>
                    <div>
                        <a>Terms</a>
                    </div>
                    
                </Stack>
                
            </footer>
            
        </Container>
    )
}

export default Main;