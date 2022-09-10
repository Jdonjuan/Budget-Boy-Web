import React from "react";
import { Container, Stack } from "react-bootstrap";

// try api call to get budgets (or check if stored token exists/is valid), if get budgets works, get categories for default budget and display them to the screen
// if get budgets doesn't work, redirect to cognito sign in page. 

function DefaultBudget() {
    var currentToken = window.localStorage.getItem('BB_USER_TOKEN')
    if (currentToken == "null"){
        var currentURL = window.location;
        var token = currentURL.hash;
        var accessToken = new URLSearchParams(token).get('access_token');
        // console.log(accessToken);
        window.localStorage.setItem('BB_USER_TOKEN', accessToken);
    }
    else {
        //--------------- Using Fetch()----------------------------
        console.log("We have a token");
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${currentToken}`);
        // myHeaders.append("Access-Control-Allow-Origin", '*')

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
        mode: 'cors'
        };

        fetch("https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

    }


    return(
        <Container>
            <h1>Default Budget page</h1>
            <p>Here is your Access Token: {currentToken}</p>
        </Container>
    )
}

export default DefaultBudget;