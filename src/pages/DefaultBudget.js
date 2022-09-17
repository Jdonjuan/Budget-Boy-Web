import React, { useEffect, useState } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import AddExpenseModal from "../components/AddExpenseModal";
import BudgetCard from "../components/BudgetCard";
import BudgetTitle from "../components/BudgetTitle";
import CategoryCard from "../components/CategoryCard";
import BB_Nav from "../components/Navbar";

// try api call to get budgets (or check if stored token exists/is valid), if get budgets works, get categories for default budget and display them to the screen
// if get budgets doesn't work, redirect to cognito sign in page. 

function DefaultBudget() {
    const loginURL = "https://budgetboy.auth.us-east-1.amazoncognito.com/login?client_id=1k6ld9m89ikfp4nptvshj5aqd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=http://localhost:3000/DefaultBudget"
    const [defaultBudget, setDefaultBudget] = useState(null)
    const CreateBudgetPage = "http://localhost:3000/CreateBudget"

    function getDefaultBudget(Token) {
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
                        setDefaultBudget(message => {
                            return JSON.stringify(result)
                        })
                    }
                    else if (JSON.stringify(result) === '{}') {
                        
                        console.log("User has no budgets", result)
                        console.log("redirect to Create Budget page")
                        window.location.replace(CreateBudgetPage);
                        setDefaultBudget(message => {
                            return JSON.stringify(result)
                        })
                    }
                    else {
                        console.log("Budgets: ", result);
                        // get default budget ID
                        var DefaultBudgetID = null;
                        var DBudget = null;
                        result.Budgets.forEach(Budget => {
                            if (Budget.IsDefault === true ) {
                                DefaultBudgetID = Budget.BudgetID;
                                DBudget = Budget
                            }
                        });
                        // setDefaultBudget(MyBudget => {
                        //     return DBudget
                        // });
                        
                        // ------------------
                        // get categories
                        // ------------------
                        // make API Call
                        // console.log(DefaultBudgetID)
                        var myHeaders = new Headers();
                        myHeaders.append("Authorization", `Bearer ${Token}`);
                        myHeaders.append("BudgetID", `${DefaultBudgetID}`)
                        // myHeaders.append("Access-Control-Allow-Origin", '*')
        
                        var requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow',
                        mode: 'cors'
                        };
        
                        fetch(`https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/categories?BudgetID=${DefaultBudgetID}`, requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            // console.log(result)
                            if (result === '{"message":"The incoming token has expired"}' || result === '{"message":"Unauthorized"}') {
                                console.log("redirect to sign-in")
                                window.location.replace(loginURL);
                                setDefaultBudget(message => {
                                    return JSON.stringify(result)
                                })
                            }
                            else if (JSON.stringify(result) === '{}') {
                                console.log("Default Budget has no categories", JSON.stringify(result))
                                setDefaultBudget(MyBudget => {
                                    return JSON.stringify({...DBudget, ...result})
                                })

                            }
                            else {
                                console.log("here's your categories!", result)
                                // add categories to state {...MyBudget, ...result}
                                setDefaultBudget(MyBudget => {
                                    return JSON.stringify({...DBudget, ...result})
                                })
                            }
        
                        })
                        .catch(error => console.log('error', error));
        
                        
                    }
        
                })
                .catch(error => console.log('error', error));
    }
    // window.localStorage.setItem('BB_USER_TOKEN', "eyJraWQiOiJSODZ6ZUpINEl1U1RHeUpNUTI2XC82azBTSFYwakRmVFlqTWJkczdycmFrbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzNGM4ZjNlMS1iNjQ5LTRjMGEtYTI3Yy1mMzFiODg2YWVmMzIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9QSkdGOHgxaDUiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIxazZsZDltODlpa2ZwNG5wdHZzaGo1YXFkIiwiZXZlbnRfaWQiOiI2Y2ZlZTk0Yi05NDU5LTRhZmMtODAwZS1lMjQ0MDM0MTMxNmMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjYyODM3OTQ4LCJleHAiOjE2NjI4NDE1NDgsImlhdCI6MTY2MjgzNzk0OCwianRpIjoiNDM3Nzg0ZTctMGY5OC00MjlhLTliZTItNTJiZjljNGNjMjYzIiwidXNlcm5hbWUiOiIzNGM4ZjNlMS1iNjQ5LTRjMGEtYTI3Yy1mMzFiODg2YWVmMzIifQ.J6iFBjXD2zWs1_RnvEbbx5x-RmWyhTACD5-jR_ILyF_VVjvlQwyXnJtNTz4I9OIEy9UE09cHWeaQU6in0G0hJK8x5oiVjpyti_oHI_rKjLfvT0sc57fQMOtZ2-cGsBvOTWocXaW-ErgOrKsvsRDSwpjK1Lcpir11C7O6EyEnkHllDqiJF64pkQaWvtiCQQghIeijEx4KI567Kq3ue44aVvxgKvvfLdfXmihAcI384OREGz0VTfi6_tZqoiK3NIokKBspJodKyTWJzzK92-oC2GJE5vluo97WDJ7yEhxNZuVQB9SN_YQ-UrhtHabZiJmmR69oDd8JbrbzWctvntQ_Tg");
        
    // Get token from URL if exists
    var currentURL = window.location;
    var token = currentURL.hash;
    var accessToken = new URLSearchParams(token).get('access_token');
    // console.log(accessToken);
    // window.localStorage.setItem('BB_USER_TOKEN', accessToken);    
    // if no token in URL
    if (accessToken === null) {
        console.log('Token Not in url')
        // get stored token
        var accessToken = window.localStorage.getItem('BB_USER_TOKEN')
        // console.log('stored Token:', accessToken)
        
        getDefaultBudget(accessToken)
    }
    // if there is a token in the url
    else {
        console.log('Token in URL')
        window.localStorage.setItem('BB_USER_TOKEN', accessToken);
        getDefaultBudget(accessToken)

    }
    
    

    function renderbudget(BudgetResponse) {
        if (BudgetResponse === null) {
            return "Loading..."
        }
        else {
            var Budget = JSON.parse(defaultBudget)
            return(
                <Container>
                        <p>{BudgetResponse}</p>
                        <Stack>
                            <BudgetCard name={Budget.BudgetName} amount={Budget.BudgetAmountUsed} max={Budget.BudgetAmountTotal}/>
                        </Stack>
                        <hr style={{color: 'white'}} />
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: "1rem",
                            alignItems: "flex-start"
                        }}>
                            {Budget.Categories.map((Category, index) => {
                                console.log(Category)
                                return(
                                    <CategoryCard index={index} categoryid={Category.CategoryID} budget={Budget} name={Category.CategoryName} amount={Number(Category.CategoryAmountUsed)} max={Number(Category.CategoryAmountTotal)}/>
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
                <hr style={{color: 'white'}} />
            </Container>
            {renderbudget(defaultBudget)}
            <hr style={{
                    color: 'white'
                }} />
        </Container>
    )
}

export default DefaultBudget;