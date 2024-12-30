import React, { useEffect, useState } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import BudgetCard from "../components/BudgetCard";
import BB_Nav from "../components/Navbar";
import { CreateBudgetURL, SignInURL } from "../components/Vars";

// try api call to get budgets (or check if stored token exists/is valid), if get budgets works, get categories for default budget and display them to the screen
// if get budgets doesn't work, redirect to cognito sign in page. 

function MyBudgets() {
    const loginURL = SignInURL
    const [Budgets, setBudgets] = useState(null)
    const CreateBudgetPage = CreateBudgetURL

    function getBudgets(Token) {
                // make API Call
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${Token}`);
                // myHeaders.append("Access-Control-Allow-Origin", '*')
        
                var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
                mode: 'cors'
                };
        
                fetch("https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets", requestOptions)
                .then(response => response.json())
                .then(result => {
                    // console.log(result)
                    const expired = '{"message":"The incoming token has expired"}'
                    const Unauthorized = '{"message":"Unauthorized"}'
                    if (JSON.stringify(result) === expired || JSON.stringify(result) === Unauthorized) {
                        console.log("redirect to sign-in")
                        window.location.replace(loginURL);
                        setBudgets(message => {
                            return JSON.stringify(result)
                        })
                    }
                    else if (JSON.stringify(result) === '{}') {
                        
                        console.log("User has no budgets", result)
                        console.log("redirect to Create Budget page")
                        window.location.replace(CreateBudgetPage);
                        setBudgets(message => {
                            return JSON.stringify(result)
                        })
                    }
                    else {
                        console.log("Budgets: ", result);
                        // set budgets variable (State)
                        setBudgets(message => {
                            return JSON.stringify(result)
                        })
                    }
        
                })
                .catch(error => console.log('error', error));
    }

    var accessToken = JSON.parse(window.localStorage.getItem('BB_USER_TOKEN'));
    getBudgets(accessToken)
    

    function renderbudgets(BudgetResponse) {
        if (BudgetResponse === null) {
            return "Loading..."
        }
        else if (BudgetResponse === '{}' ) {
            return "No Budgets. Redirect to New Budget page"
        }
        else {
            var budgets = JSON.parse(Budgets)
            return(
                <Container>
                    <Stack>
                        {/* <p>{BudgetResponse}</p> */}
                    </Stack>
                        <hr style={{color: 'white'}} />
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: "1rem",
                            alignItems: "flex-start"
                        }}>
                            {budgets.Budgets.map((Budget, index) => {
                                console.log(Budget)
                                return(
                                    <BudgetCard index={index} budgetid={Budget.BudgetID} budget={Budget} name={Budget.BudgetName} amount={Number(Budget.BudgetAmountUsed)} max={Number(Budget.BudgetAmountTotal)}/>
                                )
                            })}
                        </div>
                        
                </Container>

            )
        }
    }

    return(
        <Container>
            <Container>
                <BB_Nav/>
            </Container>
            {renderbudgets(Budgets)}
            <hr style={{
                    color: 'white'
                }} />
        </Container>
    )
}

export default MyBudgets;