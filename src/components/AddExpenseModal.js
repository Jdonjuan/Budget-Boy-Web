import { Button, Form, Modal, Card } from "react-bootstrap";
import { useRef, useState } from "react";
import { currencyFormatter } from "./Utils";

export default function AddExpenseModal({ show, handleClose, budget, passedCat, categoryid, setDefaultBudget, amountused, categoryName, index}) {
    // console.log("Show: ",show)
    // console.log("handle close: ", handleClose)
    const formRef = useRef();
    const amountRef = useRef();
    const expenseNameRef = useRef();
    const [disabled, setDisabled] = useState(false);

    function handleSubmit(e) {
        e.preventDefault()
        setDisabled(true)
        // initialize new amount
        const newAmountUsed =  (parseFloat(amountused) + parseFloat(amountRef.current.value)).toString()
        // console.log("new amount:", newAmountUsed)
        // console.log("budget: ", budget)
        //Calculate BUDGET amount used
        const newBudgetAmountUsed = (parseFloat(budget.BudgetAmountUsed) + parseFloat(amountRef.current.value)).toString()
        
        // Create new expense for ExpensesList
        const expenseObj = {
            expenseName: expenseNameRef.current.value,
            expenseAmount: amountRef.current.value,
            expenseDate: new Date().toLocaleDateString()
        }
        console.log('expenseObj', expenseObj);

        // add expensesObj to Expenses list
        if (passedCat.ExpensesList) {
            passedCat.ExpensesList.unshift(expenseObj);
        }
        else {
            passedCat.ExpensesList = [expenseObj]
        }
        

        // create body object ready for api post
        var body = {}
        body.BudgetItem = {}
        body.BudgetItem.PK = {}
        body.BudgetItem.PK.S = budget.PK
        body.BudgetItem.SK = {}
        body.BudgetItem.SK.S = budget.SK
        body.BudgetItem.BudgetAmountTotal = {}
        body.BudgetItem.BudgetAmountTotal.S = budget.BudgetAmountTotal
        body.BudgetItem.BudgetAmountUsed = {}
        body.BudgetItem.BudgetAmountUsed.S = newBudgetAmountUsed
        body.BudgetItem.BudgetID = {}
        body.BudgetItem.BudgetID.S = budget.BudgetID
        body.BudgetItem.BudgetName = {}
        body.BudgetItem.BudgetName.S = budget.BudgetName
        body.BudgetItem.CurrencySymbol = {}
        body.BudgetItem.CurrencySymbol.S = budget.CurrencySymbol
        body.BudgetItem.Cycle = {}
        body.BudgetItem.Cycle.S = budget.Cycle
        body.BudgetItem.Email = {}
        body.BudgetItem.Email.S = budget.Email
        body.BudgetItem.IsDefault = {}
        body.BudgetItem.IsDefault.BOOL = budget.IsDefault
        body.BudgetItem.NextCycleStartDate = {}
        body.BudgetItem.NextCycleStartDate.S = budget.NextCycleStartDate
        body.BudgetItem.TimeZone = {}
        body.BudgetItem.TimeZone.S = budget.TimeZone
        body.BudgetItem.Type = {}
        body.BudgetItem.Type.S = budget.Type
        body.BudgetItem.MonthlyCron = {}
        body.BudgetItem.MonthlyCron.S = budget.MonthlyCron
        body.Categories = []
        budget.Categories.map(cat => {
            // console.log(cat)
            if (cat.CategoryID === categoryid) {
                //compose new cat object
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
                catobj.CategoryAmountUsed.S = newAmountUsed
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
                catobj.ExpensesList = passedCat.ExpensesList
                
                // add updated category to list
                body.Categories.push(catobj)

                //update local properties
                cat.CategoryAmountUsed = newAmountUsed;

            }
            else{
                //compose new cat object
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
            }
        })
        
        // console.log("body", body)
        // post new budget (update budget api)
        var loginURL = "https://budgetboy.auth.us-east-1.amazoncognito.com/login?client_id=1k6ld9m89ikfp4nptvshj5aqd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=https://budgetboy.net/DefaultBudget"
        var Token = window.localStorage.getItem('BB_USER_TOKEN');
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${Token}`);
        myHeaders.append("BudgetID", `${budget.BudgetID}`);
        myHeaders.append("Content-Type", `application/json`);
        // myHeaders.append("Access-Control-Allow-Origin", '*')

        var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow',
        mode: 'cors',
        body: JSON.stringify(body)
        };

        fetch(`https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets?BudgetID=${budget.BudgetID}`, requestOptions)
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
                console.log("body sent", body)
                
                if (result === "Update-Budget-Lambda completed successfully") {
                    console.log("Success:", result);
                    console.log("you can now reload")
                    setDisabled(false);
                    let updatedDefaultBudget = {...budget, BudgetAmountUsed: newBudgetAmountUsed}
                    setDefaultBudget(JSON.stringify(updatedDefaultBudget))
                    window.localStorage.setItem('DefaultBudget', JSON.stringify(updatedDefaultBudget));
                    // window.location.reload()
                    handleClose()
                }
                else {
                    console.log("Failure:", result);
                    setDisabled(false);
                    let updatedDefaultBudget = {...budget, BudgetAmountUsed: newBudgetAmountUsed}
                    setDefaultBudget(JSON.stringify(updatedDefaultBudget))
                    window.localStorage.setItem('DefaultBudget', JSON.stringify(updatedDefaultBudget));
                    // window.location.reload()
                    handleClose()
                }
            }
        }).catch(error => {
            console.log('error', error);
            console.log("There was an Error:", error);
            setDisabled(false);
            let updatedDefaultBudget = {...budget, BudgetAmountUsed: newBudgetAmountUsed}
            setDefaultBudget(JSON.stringify(updatedDefaultBudget))
            window.localStorage.setItem('DefaultBudget', JSON.stringify(updatedDefaultBudget));
            // window.location.reload()
            handleClose()
        });
            
        
        // reload page
        // window.location.reload()
        
    }
    function displayExpenses() {
        return (
            <>
                {passedCat.ExpensesList?.map((expense, i) => {
                    return (
                    <Card key={i} >
                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-baseline ">
                                <div className="me-1 ">{expense.expenseName}</div>
                                <div className="me-1">{currencyFormatter.format(expense.expenseAmount)}</div>
                                <div >{expense.expenseDate}</div>
                            </div>
                            
                        </Card.Body>
                    </Card>
                    )
                })}
            </>
            
        )
    }



    return (
        <Modal show={show} onHide={handleClose} centered backdrop={disabled? 'static' : true}>
            <Form onSubmit={handleSubmit} ref={formRef} >
                <Modal.Header className="bg-primary bg-opacity-75 text-white" closeButton={!disabled}>
                    <Modal.Title>Add Expense for {passedCat.CategoryName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="amount" >
                        <Form.Label>Expense Name</Form.Label>
                        <Form.Control ref={expenseNameRef} type="text" required defaultValue={categoryName} disabled={disabled}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="amount" >
                        <Form.Label>Amount</Form.Label>
                        <Form.Control ref={amountRef} type="number" required  step={0.01} disabled={disabled}/>
                        <Form.Text className="text-muted">
                            e.g. {budget.CurrencySymbol || "$"}13.99
                        </Form.Text>
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit" disabled={disabled}>{disabled? "Loading..." : "Submit"}</Button>
                    </div>
                </Modal.Body>
            </Form>
            {displayExpenses()}
        </Modal>

    )
}