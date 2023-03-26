import React, { useEffect, useState } from "react";
import { Button, Container, Stack, Form, Card } from "react-bootstrap";
import BudgetCard from "../components/BudgetCard";
import BB_Nav from "../components/Navbar";
import CategoryForm from "../components/CategoryForm";
import { v4 as uuidV4 } from 'uuid';
import { CreateBudgetURL, SignInURL } from "../components/Vars";
import { DefaultBudgetURL } from "../components/Vars";

// try api call to get budgets (or check if stored token exists/is valid), if get budgets works, get categories for default budget and display them to the screen
// if get budgets doesn't work, redirect to cognito sign in page. 

function EditBudget() {
    const loginURL = SignInURL
    const defaultBudgetURL = DefaultBudgetURL
    const CreateBudgetPage = CreateBudgetURL
    const [disabled, setDisabled] = useState(false);
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
                else if (id === "position") {
                    budget.Categories[index].CategoryPositionID = occuranceValue;
                    window.localStorage.setItem('DefaultBudget', JSON.stringify(budget));
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
                    CategoryPositionID: `${budget.Categories.length}`,
                    IsRecurring: false,
                    PK: PK,
                    SK: SK,
                    Type: "Category",
                    ExpensesList: []

                }
                // append category to budget
                budget.Categories.push(newEmptyCat)
                // save new budget to local storage
                window.localStorage.setItem('DefaultBudget', JSON.stringify(budget));
                window.location.reload()
            }

            function deleteCategory(index) {
                budget.BudgetAmountTotal = (parseFloat(budget.BudgetAmountTotal) - parseFloat(budget.Categories[index].CategoryAmountTotal)).toString()
                budget.BudgetAmountUsed = (parseFloat(budget.BudgetAmountUsed) - parseFloat(budget.Categories[index].CategoryAmountUsed)).toString()
                budget.Categories.splice(index, 1)
                // console.log("new budget: ", budget)
                window.localStorage.setItem('DefaultBudget', JSON.stringify(budget));
                window.location.reload()
            }

            function submitChanges(){
                setDisabled(true)
                // initiate edited budget variable
                var editedBudget = window.localStorage.getItem('DefaultBudget')
                // console.log(editedBudget)
                // parse the value
                var parsedBudget = JSON.parse(editedBudget)
                // console.log(parsedBudget)
                // calculate total and used for budget
                var BudgetTotal = 0
                var BudgetUsed = 0
                budget.Categories.map(cat => {
                    BudgetTotal += parseFloat(cat.CategoryAmountTotal)
                    BudgetUsed += parseFloat(cat.CategoryAmountUsed)
                })
                // create body object (For API Call) from updated budget
                var body = {}
                body.BudgetItem = {}
                body.BudgetItem.PK = {}
                body.BudgetItem.PK.S = parsedBudget.PK
                body.BudgetItem.SK = {}
                body.BudgetItem.SK.S = parsedBudget.SK
                body.BudgetItem.BudgetAmountTotal = {}
                body.BudgetItem.BudgetAmountTotal.S = BudgetTotal.toString()
                body.BudgetItem.BudgetAmountUsed = {}
                body.BudgetItem.BudgetAmountUsed.S = BudgetUsed.toString()
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
                    catobj.ExpensesList = cat.ExpensesList
                    
                    // add updated category to list
                    body.Categories.push(catobj)
                })
                // make api call to update budget
                console.log("body", body)
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
                        setDisabled(false);
                        window.location.replace(loginURL);
                    }
                    else {
                        console.log("Success: ", result);
                        console.log("Body sent: ", JSON.stringify(body));
                        if (result == "Update-Budget-Lambda completed successfully"){
                            setDisabled(false);
                            window.location.replace(defaultBudgetURL);
                        }
                        else {
                            window.location.replace(defaultBudgetURL);
                        }
                    }
                }).catch(error => { 
                    console.log('error', error);
                    setDisabled(false);
                    window.location.replace(defaultBudgetURL);
                });
            }

            budget.Categories.sort((a, b) => {
                return Number(a.CategoryPositionID) - Number(b.CategoryPositionID)
            });
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
                                    <Card key={index} className="border-primary fw-normal mb-3 p-3" >
                                        <Form.Group className="" controlId="cname" onChange={occurance => handleChangeInput(index, occurance.target.value, occurance.target.id)}>
                                            {/* <hr style={{color: 'black'}} /> */}
                                            <Form.Label className="d-flex">Category Name</Form.Label> 
                                            <Form.Control type="text" placeholder={Category.CategoryName}  defaultValue={Category.CategoryName}/>
                                        </Form.Group>
                                        <Form.Text className="text-muted d-flex mb-3">e.g. Groceries
                                        </Form.Text>
                                        <Form.Group className="" controlId="max" onChange={occurance => handleChangeInput(index, occurance.target.value, occurance.target.id)}>
                                            <Form.Label className="d-flex">Max</Form.Label>
                                            <Form.Control type="text" placeholder={Category.CategoryAmountTotal}  defaultValue={Category.CategoryAmountTotal}/>
                                        </Form.Group>
                                        <Form.Text className="text-muted d-flex mb-3" >
                                            e.g. {budget.CurrencySymbol || "$"}500
                                        </Form.Text>
                                        <Form.Group className="" controlId="recurring" onChange={occurance => handleChangeInput(index, occurance.target.checked, occurance.target.id)}>
                                            <Form.Check className="d-flex gap-2" type="checkbox" label="Recurring" defaultChecked={Category.IsRecurring}/>
                                        </Form.Group>
                                        <Form.Text className="text-muted d-flex mb-3">If checked, the amount used will be the same as the max and will not clear out at the end of the month.
                                        </Form.Text>
                                        <Form.Group className="" controlId="position" onChange={occurance => handleChangeInput(index, occurance.target.value, occurance.target.id)}>
                                            <Form.Label className="d-flex">Position</Form.Label>
                                            <Form.Control type="text" placeholder={Category.CategoryPositionID}  defaultValue={Category.CategoryPositionID}/>
                                        </Form.Group>
                                        <Form.Text className="text-muted d-flex mb-6">
                                            The category with the lowest postion number appears first. e.g. 0
                                        </Form.Text>
                                        <Button className="mt-4" variant="danger" onClick={ifclicked => deleteCategory(index)}>Delete Category</Button>
                                        {/* <hr style={{color: 'black'}} /> */}
                                    </Card>
                                    
                                )
                            })}
                        <Button className="mt-2 mb-2" onClick={clicked => addCategory()}>Add Category</Button>
                        <hr style={{color: 'black'}} />
                        <Stack className="mt-3" direction="horizontal" gap="5">
                            <Button className="px-3 ms-auto" variant="secondary" type="cancel" href={defaultBudgetURL}>
                                Cancel
                            </Button>
                            <Button className="px-4" variant="success" disabled={disabled}  onClick={clicked => submitChanges()}>
                                {disabled? "Loading..." : "Save"}
                            </Button>
                        </Stack>
                        
                    </Form>

                    <h3 className="mt-5" >Preview</h3>
                    
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
                    color: 'black'
                }} />
        </Container>
    )
}

export default EditBudget;