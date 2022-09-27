import React, { useEffect, useState } from "react";
import { Button, Container, Stack, Form } from "react-bootstrap";
import BudgetCard from "../components/BudgetCard";
import BB_Nav from "../components/Navbar";
import CategoryForm from "../components/CategoryForm";
import { v4 as uuidV4 } from 'uuid';

// try api call to get budgets (or check if stored token exists/is valid), if get budgets works, get categories for default budget and display them to the screen
// if get budgets doesn't work, redirect to cognito sign in page. 

function EditBudget() {
    const loginURL = "https://budgetboy.auth.us-east-1.amazoncognito.com/login?client_id=1k6ld9m89ikfp4nptvshj5aqd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=https://budgetboy.net/DefaultBudget"
    const defaultBudgetURL = "https://budgetboy.net/DefaultBudget"
    const CreateBudgetPage = "https://budgetboy.net/CreateBudget"
    // const [Budgets, setBudgets] = useState(null)
    

    function updateDefualtBudget(Token) {
                return "Budget Updated."
    }

    var accessToken = window.localStorage.getItem('BB_USER_TOKEN')  
    var DefaultBudget = window.localStorage.getItem('DefaultBudget')
    // console.log(DefaultBudget)
    // const [addCategory, setAddCategory] = useState(0)
    

    function renderForm(BudgetResponse) {
        if (BudgetResponse === null) {
            return "Loading..."
        }
        else if (BudgetResponse === '{}' ) {
            return "Render Empty Form"
        }
        else if (BudgetResponse === '{"message":"The incoming token has expired"}' ) {
            window.location.replace(loginURL);
        }
        else {
            
            var budget = JSON.parse(DefaultBudget)
            
            function handleBNameChange(value) {
                budget.BudgetName = value
                // console.log("new budget: ", budget)
                window.localStorage.setItem('DefaultBudget', JSON.stringify(budget) );
            }

            function handleChangeInput(index, occuranceValue, id){
                // console.log(index, occuranceValue, id)
                // go to category index, swap out the element with the updated element
                // console.log(budget.Categories[index])
                if (id === "cname"){
                    budget.Categories[index].CategoryName = occuranceValue
                    // console.log("new budget: ", budget)
                    window.localStorage.setItem('DefaultBudget', JSON.stringify(budget));
                }
                else if (id === "max") {
                    budget.Categories[index].CategoryAmountTotal = occuranceValue
                    var newBudgetMax = 0
                    budget.Categories.map((Category, index) => {
                        // console.log(parseFloat(Category.CategoryAmountTotal))
                        newBudgetMax += parseFloat(Category.CategoryAmountTotal)
                    })
                    // console.log(newBudgetMax)
                    budget.BudgetAmountTotal = newBudgetMax.toString()
                    // console.log("new budget: ", budget)
                    window.localStorage.setItem('DefaultBudget', JSON.stringify(budget));
                }
                else if (id === "recurring") {
                    budget.Categories[index].IsRecurring = occuranceValue
                    if (occuranceValue === true){
                        // console.log("Recurring is TRUE: ", occuranceValue)
                        budget.Categories[index].CategoryAmountUsed = budget.Categories[index].CategoryAmountTotal
                        var newBudgetMax = 0
                        var RecurringAmounts = 0
                        budget.Categories.map((Category, index) => {
                            // console.log(parseFloat(Category.CategoryAmountTotal))
                            newBudgetMax += parseFloat(Category.CategoryAmountTotal)
                            if (Category.IsRecurring === true){
                                RecurringAmounts += parseFloat(Category.CategoryAmountTotal)
                            }
                        })
                        // console.log(newBudgetMax)
                        budget.BudgetAmountTotal = newBudgetMax.toString()
                        budget.BudgetAmountUsed = (parseFloat(budget.BudgetAmountUsed) + parseFloat(budget.Categories[index].CategoryAmountTotal)).toString()
                        // console.log("new budget: ", budget)
                        window.localStorage.setItem('DefaultBudget', JSON.stringify(budget));

                    } else {
                        budget.BudgetAmountUsed = (parseFloat(budget.BudgetAmountUsed) - parseFloat(budget.Categories[index].CategoryAmountTotal)).toString()
                        budget.Categories[index].CategoryAmountUsed = "0"
                        // console.log("Recurring is FALSE: ", occuranceValue)
                        // console.log("new budget: ", budget)
                        window.localStorage.setItem('DefaultBudget', JSON.stringify(budget));
                    }
                    
                }
                


            }

            
            function addCategory() {
                // create category object
                var newGuid = uuidV4()
                var PK = `CATBID#${budget.BudgetID}`
                var SK = `CATID#${newGuid}`
                var newEmptyCat = {
                    BudgetID: budget.BudgetID,
                    CategoryAmountTotal: "0",
                    CategoryAmountUsed: "0",
                    CategoryID: newGuid,
                    CategoryName: "",
                    CategoryPositionID: "",
                    IsRecurring: false,
                    PK: PK,
                    SK: SK,
                    Type: "Category"

                }
                // append category to budget
                budget.Categories.push(newEmptyCat)
                // save new budget to local storage
                window.localStorage.setItem('DefaultBudget', JSON.stringify(budget));
                window.location.reload()
            }

            function deleteCategory(index) {
                budget.Categories.splice(index, 1)
                // console.log("new budget: ", budget)
                window.localStorage.setItem('DefaultBudget', JSON.stringify(budget));
                window.location.reload()
            }

            function submitChanges(){
                // initiate edited budget variable
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
                budget.Categories.map(cat => {
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
                    
                    // add updated category to list
                    body.Categories.push(catobj)
                })
                // make api call to update budget
                // console.log("body", body)
                // post new budget (update budget api)
                var Token = window.localStorage.getItem('BB_USER_TOKEN');
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${Token}`);
                myHeaders.append("BudgetID", `${parsedBudget.BudgetID}`);
                myHeaders.append("Content-Type", `application/json`);
                // myHeaders.append("Access-Control-Allow-Origin", '*')

                var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                redirect: 'follow',
                mode: 'cors',
                body: JSON.stringify(body)
                };

                fetch(`https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets?BudgetID=${parsedBudget.BudgetID}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    // console.log(result)
                    const expired = '{"message":"The incoming token has expired"}'
                    const Unauthorized = '{"message":"Unauthorized"}'
                    if (JSON.stringify(result) === expired || JSON.stringify(result) === Unauthorized) {
                        // console.log("redirect to sign-in")
                        window.location.replace(loginURL);
                    }
                    else {
                        // console.log("Success: ", result);
                        window.location.replace(defaultBudgetURL)
                    }
                }).catch(error => console.log('error', error));
            }
            return(
                <Container>
                    <Form>
                        <Form.Group className="mb-3" controlId="bname" onChange={occurance => handleBNameChange(occurance.target.value)}>
                            <Form.Label className="d-flex">Budget Name</Form.Label>
                            <Form.Control type="text" placeholder={budget.BudgetName}  defaultValue={budget.BudgetName}/>
                        </Form.Group>
                        {budget.Categories.map((Category, index) => {
                                // console.log(Category)
                                
                                return(
                                    <Container key={index} >
                                        <Form.Group className="mb-3" controlId="cname" onChange={occurance => handleChangeInput(index, occurance.target.value, occurance.target.id)}>
                                            <hr style={{color: 'white'}} />
                                            <Form.Label className="d-flex">Category Name</Form.Label> 
                                            <Form.Control type="text" placeholder={Category.CategoryName}  defaultValue={Category.CategoryName}/>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="max" onChange={occurance => handleChangeInput(index, occurance.target.value, occurance.target.id)}>
                                            <Form.Label className="d-flex">Max</Form.Label>
                                            <Form.Control type="text" placeholder={Category.CategoryAmountTotal}  defaultValue={Category.CategoryAmountTotal}/>
                                        </Form.Group>
                                        <Form.Group className="mb-6" controlId="recurring" onChange={occurance => handleChangeInput(index, occurance.target.checked, occurance.target.id)}>
                                            <Form.Check className="d-flex gap-2" type="checkbox" label="Recurring" defaultChecked={Category.IsRecurring}/>
                                        </Form.Group>
                                        <Button className="d-flex mt-4" variant="danger" onClick={ifclicked => deleteCategory(index)}>Delete Category</Button>
                                        <hr style={{color: 'white'}} />
                                    </Container>
                                    
                                )
                            })}
                        <Button className="mt-3" onClick={clicked => addCategory()}>Add Category</Button>
                        <hr style={{color: 'white'}} />
                        <Stack className="mt-3" direction="horizontal" gap="4">
                            <Button className="mr-3 ms-auto" variant="secondary" type="cancel" href={defaultBudgetURL}>
                                Cancel
                            </Button>
                            <Button variant="primary"  onClick={clicked => submitChanges()}>
                                Submit
                            </Button>
                        </Stack>
                        
                    </Form>
                    <hr style={{color: 'white'}} />
                    
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "1rem",
                        alignItems: "flex-start"
                    }}>
                        {budget.Categories.map((Category, index) => {
                            // console.log(Category)
                            return(
                                <CategoryForm key={index} index={index} budgetid={Category.BudgetID} budget={budget} name={Category.CategoryName} amount={Number(Category.CategoryAmountUsed)} max={Number(Category.CategoryAmountTotal)}/>
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
            {renderForm(DefaultBudget)}
            <hr style={{
                    color: 'white'
                }} />
        </Container>
    )
}

export default EditBudget;