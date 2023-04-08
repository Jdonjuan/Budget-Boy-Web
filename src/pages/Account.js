import React, { useEffect, useState } from "react";
import { Button, Container, Stack, Form, Card, Modal } from "react-bootstrap";
import BB_Nav from "../components/Navbar";
import CategoryForm from "../components/CategoryForm";
import { v4 as uuidV4 } from 'uuid';
import { CreateBudgetURL, SignInURL, DefaultBudgetURL} from "../components/Vars";
import { CognitoIdentityProvider, CognitoIdentityProviderClient, DeleteUserCommand, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

// get User's email
// Delete User's account

function Account() {
    const [modalShow, setModalShow] = useState(false);
    const [ disableDeleteAccount, setDisableDeleteAccount ] = useState(false);
    var Token = window.localStorage.getItem('BB_USER_TOKEN');
    var DefaultBudget = JSON.parse(window.localStorage.getItem('DefaultBudget'));

    if (!DefaultBudget?.Email) {
        // console.log('no email');
        window.location.replace(DefaultBudgetURL);
    }



    async function handleDeleteAccount() {
        setDisableDeleteAccount(true);
        // Get all Budgets
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
        console.log('Getting Budgets (API Call)');
        await fetch("https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets", requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log("Get Budgets res: ", result)
            const expired = '{"message":"The incoming token has expired"}'
            const Unauthorized = '{"message":"Unauthorized"}'
            if (JSON.stringify(result) === expired || JSON.stringify(result) === Unauthorized) {
                // console.log("redirect to sign-in")
                window.location.replace(DefaultBudgetURL);
            }
            else if (JSON.stringify(result) === '{"Budgets":[]}') {
                
                // console.log("User has no budgets", result)
                // console.log("redirect to Create Budget page")
                window.location.replace(DefaultBudgetURL);
            }
            else {
                // console.log("Budgets: ", result);
                // get default budget ID
                // put each budgetID in an array

                // iterate over the array and create promises for the api calls
                // Send delete api call for each budget in parallel.

                function deleteBudgetRequest(id) {
                    var myHeaders = new Headers();
                    myHeaders.append("Authorization", `Bearer ${Token}`);
                    myHeaders.append("BudgetID", `${id}`)
                    // myHeaders.append("Access-Control-Allow-Origin", '*')

                    var requestOptions = {
                    method: 'DELETE',
                    headers: myHeaders,
                    redirect: 'follow',
                    mode: 'cors'
                    };
                    console.log('Deleting Budgets (API Call)');
                    fetch(`https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets?BudgetID=${id}`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        // console.log(result)
                        if (result === '{"message":"The incoming token has expired"}' || result === '{"message":"Unauthorized"}') {
                            // console.log("redirect to sign-in")
                            window.location.replace(DefaultBudgetURL);
                        }
                        else {
                            console.log("Budget Deleted response:", result);
                        }
                    })
                    .catch(error => console.log('error', error));
                }

                async function process(promises) {
                    console.time(`process`);
                    let responses = await Promise.all(promises);
                    for(let r of responses) {}
                    console.timeEnd(`process`);
                    return;
                }

                async function handler(promises) {
                                        
                    await process(promises);
                    console.log(`processing is complete`);
                }
                

                let promises = [];
                result.Budgets.forEach(Budget => {
                    promises.push(deleteBudgetRequest(Budget.BudgetID));
                });
                console.log('promises', promises);
                handler(promises);


            }
        }).catch(error => console.log('error', error));
        
        // Delete User Account in Cognito
        const client = new CognitoIdentityProviderClient({
            region: "us-east-1",
            identityPoolId: "us-east-1_PJGF8x1h5"
        })
        const command = new DeleteUserCommand({AccessToken: `${Token}`})
        const response = await client.send(command);
        console.log("Response: ", response)

        setDisableDeleteAccount(false);
        setModalShow(false);
        window.location.replace('/');
    }
    

    return(
        <Container>
            <Container>
                <BB_Nav/>
            </Container>
            <h1>Account</h1>
            <hr style={{
                    color: 'black'
                }} />
            <p>At this time, Budget Boy on web only allows you to delete your account.</p>
            <Stack className="mb-5">
                <h5>Email: {DefaultBudget.Email || 'No Email Found... Redirecting to /DefaultBudget page'}</h5>
            </Stack>
            <Button variant="danger" onClick={() => setModalShow(true)}>Delete Account</Button>
           
            <Modal centered show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Delete Account?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        This will permanently delete your account. {''}
                        <strong>
                            This cannot be undone!
                        </strong>
                    </p>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                        <Button variant="secondary" onClick={() => setModalShow(false)}>Cancel</Button>
                        <Button variant="danger" disabled={disableDeleteAccount} onClick={handleDeleteAccount} >Delete Account</Button>
                </Modal.Footer>
                
            </Modal>

        </Container>
    )
}

export default Account;