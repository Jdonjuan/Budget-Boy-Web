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
    const loginURL = "https://budgetboy.auth.us-east-1.amazoncognito.com/login?client_id=1k6ld9m89ikfp4nptvshj5aqd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=https://budgetboy.net/DefaultBudget"
    const defaultBudgetURL = "https://budgetboy.net/DefaultBudget"
    const editBudgetURL = "https://budgetboy.net/EditBudget"
    // const [Budgets, setBudgets] = useState(null)
    // const CreateBudgetPage = "http://localhost:3000/CreateBudget"

    var accessToken = window.localStorage.getItem('BB_USER_TOKEN')
    // const [email, setEmail] = useState()
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
        // setEmail(theEmail)
        
        var UEMAIL = window.localStorage.getItem("EMAIL")

        if (UEMAIL !== null || UEMAIL !== 'null'){
            console.log("Creating a budget...")
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
                BudgetAmountUsed: "0",
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
            console.log('budget saved to local storage')
            // ---------------------------------------------
            // create budget in backend (Create Budget API)
            // ---------------------------------------------
            var editedBudget = window.localStorage.getItem('DefaultBudget')
            console.log(editedBudget)
            // parse the value
            var parsedBudget = JSON.parse(editedBudget)
            console.log(parsedBudget)
            // create body object (For API Call) from updated budget
            var body = {}
            body.BudgetItem = {}
            body.BudgetItem.PK = {}
            body.BudgetItem.PK.S = parsedBudget.PK
            body.BudgetItem.SK = {}
            body.BudgetItem.SK.S = parsedBudget.SK
            body.BudgetItem.BudgetAmountTotal = {}
            body.BudgetItem.BudgetAmountTotal.S = parsedBudget.BudgetAmountTotal
            body.BudgetItem.BudgetAmountUsed = {}
            body.BudgetItem.BudgetAmountUsed.S = parsedBudget.BudgetAmountUsed
            body.BudgetItem.BudgetID = {}
            body.BudgetItem.BudgetID.S = parsedBudget.BudgetID
            body.BudgetItem.BudgetName = {}
            body.BudgetItem.BudgetName.S = parsedBudget.BudgetName
            body.BudgetItem.CurrencySymbol = {}
            body.BudgetItem.CurrencySymbol.S = parsedBudget.CurrencySymbol
            body.BudgetItem.Cycle = {}
            body.BudgetItem.Cycle.S = parsedBudget.Cycle
            body.BudgetItem.Email = {}
            body.BudgetItem.Email.S = parsedBudget.Email
            body.BudgetItem.IsDefault = {}
            body.BudgetItem.IsDefault.BOOL = parsedBudget.IsDefault
            body.BudgetItem.NextCycleStartDate = {}
            body.BudgetItem.NextCycleStartDate.S = parsedBudget.NextCycleStartDate
            body.BudgetItem.TimeZone = {}
            body.BudgetItem.TimeZone.S = parsedBudget.TimeZone
            body.BudgetItem.Type = {}
            body.BudgetItem.Type.S = parsedBudget.Type
            body.BudgetItem.MonthlyCron = {}
            body.BudgetItem.MonthlyCron.S = parsedBudget.MonthlyCron
            body.Categories = []
            parsedBudget.Categories.map(cat => {
                // console.log(cat)
                var catobj = {}
                catobj.PK = {}
                catobj.PK.S = cat.PK
                catobj.SK = {}
                catobj.SK.S = cat.SK
                catobj.BudgetID = {}
                catobj.BudgetID.S = cat.BudgetID
                catobj.CategoryAmountTotal = {}
                catobj.CategoryAmountTotal.S = cat.CategoryAmountTotal
                catobj.CategoryAmountUsed = {}
                catobj.CategoryAmountUsed.S = cat.CategoryAmountUsed
                catobj.CategoryID = {}
                catobj.CategoryID.S = cat.CategoryID
                catobj.CategoryName = {}
                catobj.CategoryName.S = cat.CategoryName
                catobj.CategoryPositionID = {}
                catobj.CategoryPositionID.S = cat.CategoryPositionID
                catobj.IsRecurring = {}
                catobj.IsRecurring.BOOL = cat.IsRecurring
                catobj.Type = {}
                catobj.Type.S = cat.Type
                
                // add category to list
                body.Categories.push(catobj)
            })
            // -----------------------------
            // make api call to create budget
            // ------------------------------
            console.log("body for API Call", body)
            // post new budget (update budget api)
            var Token = window.localStorage.getItem('BB_USER_TOKEN');
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${Token}`);
            myHeaders.append("BudgetID", `${parsedBudget.BudgetID}`);
            myHeaders.append("Content-Type", `application/json`);
            // myHeaders.append("Access-Control-Allow-Origin", '*')
    
            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            mode: 'cors',
            body: JSON.stringify(body)
            };
    
            console.log("making API Call")
            fetch(`https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets?BudgetID=${parsedBudget.BudgetID}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('Call result', result)
                const expired = '{"message":"The incoming token has expired"}'
                const Unauthorized = '{"message":"Unauthorized"}'
                if (JSON.stringify(result) === expired || JSON.stringify(result) === Unauthorized) {
                    console.log("redirect to sign-in")
                    window.location.replace(loginURL);
                }
                else {
                    console.log("Success: ", result);
                    window.location.replace(editBudgetURL)
                }
            }).catch(error => console.log('error', error));
            // redirect to EditBudgetPage
        }

    }

    getEmail()


    // function checkEmail() {
    //     if (UEMAIL === null || UEMAIL === 'null'){
    //         return(false)
    //     }
    //     else {
    //         return(true)
    //     }
    // }
    
    // console.log(checkEmail())

    // if (checkEmail()) {

    // }
        
}

export default CreateBudget;