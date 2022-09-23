import { Button, Form, Modal } from "react-bootstrap";
import { useRef } from "react";

export default function AddBudgetModal({ show, handleClose, budget, budgetid, amountused, index}) {
    console.log("Show: ",show)
    console.log("handle close: ", handleClose)
    const amountRef = useRef()
    const nameRef = useRef()
    function handleSubmit(e) {
        e.preventDefault()
        // initialize new amount
        const newAmountUsed =  (parseFloat(amountused) + parseFloat(amountRef.current.value)).toString()
        console.log("new amount:", newAmountUsed)
        console.log("budget: ", budget)
        //Calculate BUDGET amount used
        const newBudgetAmountUsed = (parseFloat(budget.BudgetAmountUsed) + parseFloat(amountRef.current.value)).toString()
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
            if (cat.CategoryID === budgetid) {
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
                
                // add updated category to list
                body.Categories.push(catobj)
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
                
                // add updated category to list
                body.Categories.push(catobj)
            }
        })

        console.log("body", body)
        // post new budget (update budget api)
        var loginURL = "https://budgetboy.auth.us-east-1.amazoncognito.com/login?client_id=1k6ld9m89ikfp4nptvshj5aqd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=http://localhost:3000/DefaultBudget"
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
            console.log(result)
            const expired = '{"message":"The incoming token has expired"}'
            const Unauthorized = '{"message":"Unauthorized"}'
            if (JSON.stringify(result) === expired || JSON.stringify(result) === Unauthorized) {
                console.log("redirect to sign-in")
                window.location.replace(loginURL);
            }
            else {
                console.log("Success: ", result);
                window.location.reload()
                handleClose()
            }
        }).catch(error => console.log('error', error));
            
        
        // reload page
        // window.location.reload()
        
    }
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>New Budget</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control ref={nameRef} type="text" required  step={0.01}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="amount">
                        <Form.Label>Category</Form.Label>
                        <Form.Control ref={amountRef} type="number" required  step={0.01}/>
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit">Submit</Button>
                    </div>
                </Modal.Body>
            </Form>
        </Modal>

    )
}