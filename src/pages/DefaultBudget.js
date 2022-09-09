import React from "react";
import { Container, Stack } from "react-bootstrap";

// try api call to get budgets (or check if stored token exists/is valid), if get budgets works, get categories for default budget and display them to the screen
// if get budgets doesn't work, redirect to cognito sign in page. 

function DefaultBudget() {
    var currentToken = window.localStorage.getItem('BB_USER_TOKEN')
    window.localStorage.setItem('BB_USER_TOKEN', "eyJraWQiOiJSODZ6ZUpINEl1U1RHeUpNUTI2XC82azBTSFYwakRmVFlqTWJkczdycmFrbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzNGM4ZjNlMS1iNjQ5LTRjMGEtYTI3Yy1mMzFiODg2YWVmMzIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9QSkdGOHgxaDUiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIxazZsZDltODlpa2ZwNG5wdHZzaGo1YXFkIiwiZXZlbnRfaWQiOiI4NzUyOGQwZi01Zjk4LTQzNjgtYTY1Ny0zYzdkMzBjYTg1MTMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjYyNjkyMjg5LCJleHAiOjE2NjI2OTU4ODksImlhdCI6MTY2MjY5MjI4OSwianRpIjoiZjdkNDk0ZTMtMWEwMy00YTM3LTk0ZjgtM2ZhOWNmNTBmOGE3IiwidXNlcm5hbWUiOiIzNGM4ZjNlMS1iNjQ5LTRjMGEtYTI3Yy1mMzFiODg2YWVmMzIifQ.esAHk8thd7jZmdkWX6iTDn1i9Bf0MG9dNzLMJIHSInxo6SbIeqY3ME21JhtaEhyCkE6VuWR9U1rucWEadMbKLaYt0qdkJGPDe8aqjRnDtDshs4CVpr-STGWcgAxJikLy8Wf5kQyXGrT39TzC3HYWDF6Ft6wCFVyQaXbZx53YygyU_5rsSUy1Vg761TTYaYCSWNrDOGRKDROW7BWA_8F2g__Bs8O4TH2xDTw9BrXvxW41J1_ReUByYDHKGkDp1jd1cx54bA_02Xsjcj8Zu_nBwqCq6I7080SqtXjsOYvDyE8jGOdSpSUfl7a_rpOO0VO67QqT5f2ZFccqqJhVJ9WCsg");
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

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

        // Using xmlHttpRequest
        // // WARNING: For GET requests, body is set to null by browsers.

        // var xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;

        // xhr.addEventListener("readystatechange", function() {
        // if(this.readyState === 4) {
        //     console.log(this.responseText);
        // }
        // });

        // xhr.open("GET", "https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets");
        // xhr.setRequestHeader("Authorization", "Bearer eyJraWQiOiJSODZ6ZUpINEl1U1RHeUpNUTI2XC82azBTSFYwakRmVFlqTWJkczdycmFrbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzNGM4ZjNlMS1iNjQ5LTRjMGEtYTI3Yy1mMzFiODg2YWVmMzIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9QSkdGOHgxaDUiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIxazZsZDltODlpa2ZwNG5wdHZzaGo1YXFkIiwiZXZlbnRfaWQiOiI4NzUyOGQwZi01Zjk4LTQzNjgtYTY1Ny0zYzdkMzBjYTg1MTMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjYyNjkyMjg5LCJleHAiOjE2NjI2OTU4ODksImlhdCI6MTY2MjY5MjI4OSwianRpIjoiZjdkNDk0ZTMtMWEwMy00YTM3LTk0ZjgtM2ZhOWNmNTBmOGE3IiwidXNlcm5hbWUiOiIzNGM4ZjNlMS1iNjQ5LTRjMGEtYTI3Yy1mMzFiODg2YWVmMzIifQ.esAHk8thd7jZmdkWX6iTDn1i9Bf0MG9dNzLMJIHSInxo6SbIeqY3ME21JhtaEhyCkE6VuWR9U1rucWEadMbKLaYt0qdkJGPDe8aqjRnDtDshs4CVpr-STGWcgAxJikLy8Wf5kQyXGrT39TzC3HYWDF6Ft6wCFVyQaXbZx53YygyU_5rsSUy1Vg761TTYaYCSWNrDOGRKDROW7BWA_8F2g__Bs8O4TH2xDTw9BrXvxW41J1_ReUByYDHKGkDp1jd1cx54bA_02Xsjcj8Zu_nBwqCq6I7080SqtXjsOYvDyE8jGOdSpSUfl7a_rpOO0VO67QqT5f2ZFccqqJhVJ9WCsg");

        // xhr.send();

    }


    return(
        <Container>
            <h1>Default Budget page</h1>
            <p>Here is your Access Token: {currentToken}</p>
        </Container>
    )
}

export default DefaultBudget;