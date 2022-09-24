import React, { useEffect, useState } from "react";
import { Button, Container, Stack, Form } from "react-bootstrap";
import BB_Nav from "../components/Navbar";
import CategoryForm from "../components/CategoryForm";
import { v4 as uuidV4 } from 'uuid';
import { CognitoIdentityProvider, CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { getDefaultNormalizer } from "@testing-library/react";

// try api call to get budgets (or check if stored token exists/is valid), if get budgets works, get categories for default budget and display them to the screen
// if get budgets doesn't work, redirect to cognito sign in page. 

function CreateBudget() {
    const loginURL = "https://budgetboy.auth.us-east-1.amazoncognito.com/login?client_id=1k6ld9m89ikfp4nptvshj5aqd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=http://localhost:3000/DefaultBudget"
    const defaultBudgetURL = "http://localhost:3000/DefaultBudget"
    // const [Budgets, setBudgets] = useState(null)
    // const CreateBudgetPage = "http://localhost:3000/CreateBudget"

    var accessToken = window.localStorage.getItem('BB_USER_TOKEN')
    const [email, setEmail] = useState()
    // get user's email
    async function getEmail() {
        const client = new CognitoIdentityProviderClient({
            region: "us-east-1",
            identityPoolId: "us-east-1_PJGF8x1h5"
        })
        const command = new GetUserCommand({AccessToken: `${accessToken}`})
        const response = await client.send(command);
        console.log("Response: ", response)
        const theEmail = response.UserAttributes[2].Value
        console.log("user's Email: ", theEmail)
        window.localStorage.setItem("EMAIL", theEmail)
        setEmail(theEmail)
    }

    getEmail()

    var UEMAIL = window.localStorage.getItem("EMAIL")

    if (UEMAIL === null || UEMAIL === 'null'){
        return(
            <Container>
                <Container>
                    <BB_Nav/>
                </Container>
                <p>Loading... No email yet</p>
                <hr style={{
                        color: 'white'
                    }} />
            </Container>
        )
    }
    else {
        // Create Budget's UUID
        const BID = uuidV4()
        // Create Empty Category UUID
        const CID = uuidV4()
        // create empty budget
        var EmptyBudget = 
        {
            PK: `UEMAIL#${UEMAIL}`,
            SK: `BID#${BID}`,
            BudgetAmountTotal: "",
            BudgetAmountUsed: "",
            BudgetID: BID,
            BudgetName: "My Budget",
            CurrencySymbol: "",
            Cycle: "",
            Email: UEMAIL,
            IsDefault: true,
            NextCycleStartDate: "",
            TimeZone: "MDT",
            Type: "Budget",
            MonthlyCron: "55 17 L * ? *",
            Categories: [
                {
                    PK: `CATBID#${BID}`,
                    SK: `CADID#${CID}`,
                    BudgetID: BID,
                    CategoryAmountTotal: "",
                    CategoryAmountUsed: "",
                    CategoryID: CID,
                    CategoryName: "",
                    CategoryPositionID: "",
                    IsRecurring: false,
                    Type: "Category"
                }
            ]

        }
        // set new empty budget to local storage
        window.localStorage.setItem('DefaultBudget', JSON.stringify(EmptyBudget))
        // create budget in backend (Create Budget API)
        // redirect to EditBudgetPage
    }
        
}

export default CreateBudget;