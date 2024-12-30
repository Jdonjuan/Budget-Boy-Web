import React, { useEffect, useState } from "react";
import { Button, Container, Stack, Form } from "react-bootstrap";
import BB_Nav from "../components/Navbar";
import CategoryForm from "../components/CategoryForm";
import { v4 as uuidV4 } from 'uuid';
import { CognitoIdentityProvider, CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { getDefaultNormalizer } from "@testing-library/react";
import { EditBudgetURL, CreateBudgetURL, SignInURL, DefaultBudgetURL} from "../components/Vars";

// try api call to get budgets (or check if stored token exists/is valid), if get budgets works, get categories for default budget and display them to the screen
// if get budgets doesn't work, redirect to cognito sign in page. 

function CreateBudget() {
    // const [Budgets, setBudgets] = useState(null)
    // const CreateBudgetPage = "http://localhost:3000/CreateBudget"

    var accessToken = JSON.parse(window.localStorage.getItem('BB_USER_TOKEN'));
    // const [email, setEmail] = useState()
    // get user's email
    async function getEmail() {
        const client = new CognitoIdentityProviderClient({
            region: "us-east-1",
            identityPoolId: "us-east-1_PJGF8x1h5"
        })
        const command = new GetUserCommand({AccessToken: `${accessToken}`})
        const response = await client.send(command);
        // console.log("Response: ", response)
        const theEmail = response.UserAttributes[2].Value
        // console.log("user's Email: ", theEmail)
        window.localStorage.setItem("EMAIL", theEmail)
        // setEmail(theEmail)
        
        var UEMAIL = window.localStorage.getItem("EMAIL")

        if (UEMAIL !== null || UEMAIL !== 'null'){
            console.log("Creating a budget...")
            // Get Browser's time and convert it to the right Cron
            const d = new Date();
            d.setHours(23, 55, 0);
            const cronHour = d.getUTCHours();
            const cronTime = `55 ${cronHour} 1 * ? *`;
            // Create Budget's UUID
            const BID = uuidV4();
            // Create Empty Category UUID
            const CID = uuidV4();

            // IDS for Categories
            const groceries = uuidV4();
            const eatingOut = uuidV4();
            const fun = uuidV4();
            const gas = uuidV4();
            const misc = uuidV4();
            const rentMortgage = uuidV4();
            const carLoan = uuidV4();
            const carInsurance = uuidV4();
            const phone = uuidV4();
            const internet = uuidV4();
            const electricity = uuidV4();
            const homeGas = uuidV4();
            const subscriptions = uuidV4();
            const emergencySavings = uuidV4();
            const generalSavings = uuidV4();
            const investments = uuidV4();

            // create empty budget
            var EmptyBudget = 
            {
                PK: `UEMAIL#${UEMAIL}`,
                SK: `BID#${BID}`,
                BudgetAmountTotal: "4280",
                BudgetAmountUsed: "3030",
                BudgetID: BID,
                BudgetName: "My Budget",
                CurrencySymbol: "",
                Cycle: "",
                Email: UEMAIL,
                IsDefault: true,
                NextCycleStartDate: "",
                TimeZone: "MDT",
                Type: "Budget",
                MonthlyCron: cronTime,
                Categories: [
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${groceries}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "500",
                        CategoryAmountUsed: "0",
                        CategoryID: groceries,
                        CategoryName: "Groceries",
                        CategoryPositionID: "1",
                        IsRecurring: false,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${eatingOut}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "200",
                        CategoryAmountUsed: "0",
                        CategoryID: eatingOut,
                        CategoryName: "Eating Out",
                        CategoryPositionID: "2",
                        IsRecurring: false,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${fun}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "200",
                        CategoryAmountUsed: "0",
                        CategoryID: fun,
                        CategoryName: "Fun",
                        CategoryPositionID: "3",
                        IsRecurring: false,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${gas}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "250",
                        CategoryAmountUsed: "0",
                        CategoryID: gas,
                        CategoryName: "Gas",
                        CategoryPositionID: "4",
                        IsRecurring: false,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${misc}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "100",
                        CategoryAmountUsed: "0",
                        CategoryID: misc,
                        CategoryName: "Misc.",
                        CategoryPositionID: "5",
                        IsRecurring: false,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${rentMortgage}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "1600",
                        CategoryAmountUsed: "1600",
                        CategoryID: rentMortgage,
                        CategoryName: "Rent/Mortgage",
                        CategoryPositionID: "6",
                        IsRecurring: true,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${carLoan}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "400",
                        CategoryAmountUsed: "400",
                        CategoryID: carLoan,
                        CategoryName: "Car Loan",
                        CategoryPositionID: "7",
                        IsRecurring: true,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${carInsurance}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "200",
                        CategoryAmountUsed: "200",
                        CategoryID: carInsurance,
                        CategoryName: "Car Insurance",
                        CategoryPositionID: "8",
                        IsRecurring: true,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${phone}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "100",
                        CategoryAmountUsed: "100",
                        CategoryID: phone,
                        CategoryName: "Phone",
                        CategoryPositionID: "9",
                        IsRecurring: true,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${internet}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "50",
                        CategoryAmountUsed: "50",
                        CategoryID: internet,
                        CategoryName: "Internet",
                        CategoryPositionID: "10",
                        IsRecurring: true,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${electricity}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "80",
                        CategoryAmountUsed: "80",
                        CategoryID: electricity,
                        CategoryName: "Electricity",
                        CategoryPositionID: "11",
                        IsRecurring: true,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${homeGas}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "50",
                        CategoryAmountUsed: "50",
                        CategoryID: homeGas,
                        CategoryName: "Home Gas",
                        CategoryPositionID: "12",
                        IsRecurring: true,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${subscriptions}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "50",
                        CategoryAmountUsed: "50",
                        CategoryID: subscriptions,
                        CategoryName: "Subscriptions",
                        CategoryPositionID: "13",
                        IsRecurring: true,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${emergencySavings}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "100",
                        CategoryAmountUsed: "100",
                        CategoryID: emergencySavings,
                        CategoryName: "Emergency Savings",
                        CategoryPositionID: "14",
                        IsRecurring: true,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${generalSavings}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "300",
                        CategoryAmountUsed: "300",
                        CategoryID: generalSavings,
                        CategoryName: "General Savings",
                        CategoryPositionID: "15",
                        IsRecurring: true,
                        Type: "Category",
                        ExpensesList: []
                    },
                    {
                        PK: `CATBID#${BID}`,
                        SK: `CADID#${investments}`,
                        BudgetID: BID,
                        CategoryAmountTotal: "100",
                        CategoryAmountUsed: "100",
                        CategoryID: investments,
                        CategoryName: "Investments",
                        CategoryPositionID: "16",
                        IsRecurring: true,
                        Type: "Category",
                        ExpensesList: []
                    }
                ]
    
            }
            // set new budget to local storage
            window.localStorage.setItem('DefaultBudget', JSON.stringify(EmptyBudget))
            // console.log('budget saved to local storage')
            // ---------------------------------------------
            // create budget in backend (Create Budget API)
            // ---------------------------------------------
            var editedBudget = window.localStorage.getItem('DefaultBudget')
            // console.log(editedBudget)
            // parse the value
            var parsedBudget = JSON.parse(editedBudget)
            // console.log(parsedBudget)
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
                catobj.ExpensesList = cat.ExpensesList
                
                // add category to list
                body.Categories.push(catobj)
            })
            // -----------------------------
            // make api call to create budget
            // ------------------------------
            // console.log("body for API Call", body)
            // post new budget (update budget api)
            var Token = JSON.parse(window.localStorage.getItem('BB_USER_TOKEN'));
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
    
            // console.log("making API Call")
            fetch(`https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets?BudgetID=${parsedBudget.BudgetID}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log('Call result', result)
                const expired = '{"message":"The incoming token has expired"}'
                const Unauthorized = '{"message":"Unauthorized"}'
                if (JSON.stringify(result) === expired || JSON.stringify(result) === Unauthorized) {
                    // console.log("redirect to sign-in")
                    window.location.replace(SignInURL);
                }
                else {
                    // console.log("Success: ", result);
                    window.location.replace(EditBudgetURL)
                }
            }).catch(error => console.log('error', error));
            // redirect to EditBudgetPage
        }

    }

    getEmail()

    return (
        <>
            <p>Creating Budget... Please Wait.</p>
        </>
    )
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