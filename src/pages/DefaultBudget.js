import React, { useState } from "react";
import { Container, Stack } from "react-bootstrap";

// try api call to get budgets (or check if stored token exists/is valid), if get budgets works, get categories for default budget and display them to the screen
// if get budgets doesn't work, redirect to cognito sign in page. 

function DefaultBudget() {
    
    const [budgets, setBudgets] = useState(null)
    const [categories, setCategories] = useState(null)
    const [defaultBudget, setDefaultBudget] = useState(null)
    
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
                    console.log(result)
                    const expired = '{"message":"The incoming token has expired"}'
                    const Unauthorized = '{"message":"Unauthorized"}'
                    if (JSON.stringify(result) === expired || JSON.stringify(result) === Unauthorized) {
                        console.log("redirect to sign-in")
                        setDefaultBudget(message => {
                            return JSON.stringify(result)
                        })
                    }
                    else if (JSON.stringify(result) === '{}') {
                        console.log("User has no budgets", result)
                        setDefaultBudget(message => {
                            return JSON.stringify(result)
                        })
                    }
                    else {
                        // IMPORTANT Account for user not having a budget yet!
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
                        setDefaultBudget(MyBudget => {
                            return DBudget
                        });
                        
                        // ------------------
                        // get categories
                        // ------------------
                        // make API Call
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
        
                        fetch(`https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/categories?BudgetID=${DefaultBudgetID}` + new URLSearchParams({
                            BudgetID: `${DefaultBudgetID}`
                        }).toString(), requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            console.log(result)
                            if (result === '{"message":"The incoming token has expired"}' || result === '{"message":"Unauthorized"}') {
                                console.log("redirect to sign-in")
                                setDefaultBudget(message => {
                                    return JSON.stringify(result)
                                })
                            }
                            else {
                                console.log("here's your categories!", result)
                                // add categories to state {...MyBudget, ...result}
                                setDefaultBudget(MyBudget => {
                                    return JSON.stringify({...MyBudget, ...result})
                                })
                            }
        
                        })
                        .catch(error => console.log('error', error));
        
                        
                    }
        
                })
                .catch(error => console.log('error', error));
    }
    // window.localStorage.setItem('BB_USER_TOKEN', "eyJraWQiOiJSODZ6ZUpINEl1U1RHeUpNUTI2XC82azBTSFYwakRmVFlqTWJkczdycmFrbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzNGM4ZjNlMS1iNjQ5LTRjMGEtYTI3Yy1mMzFiODg2YWVmMzIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9QSkdGOHgxaDUiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIxazZsZDltODlpa2ZwNG5wdHZzaGo1YXFkIiwiZXZlbnRfaWQiOiI2Y2ZlZTk0Yi05NDU5LTRhZmMtODAwZS1lMjQ0MDM0MTMxNmMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjYyODM3OTQ4LCJleHAiOjE2NjI4NDE1NDgsImlhdCI6MTY2MjgzNzk0OCwianRpIjoiNDM3Nzg0ZTctMGY5OC00MjlhLTliZTItNTJiZjljNGNjMjYzIiwidXNlcm5hbWUiOiIzNGM4ZjNlMS1iNjQ5LTRjMGEtYTI3Yy1mMzFiODg2YWVmMzIifQ.J6iFBjXD2zWs1_RnvEbbx5x-RmWyhTACD5-jR_ILyF_VVjvlQwyXnJtNTz4I9OIEy9UE09cHWeaQU6in0G0hJK8x5oiVjpyti_oHI_rKjLfvT0sc57fQMOtZ2-cGsBvOTWocXaW-ErgOrKsvsRDSwpjK1Lcpir11C7O6EyEnkHllDqiJF64pkQaWvtiCQQghIeijEx4KI567Kq3ue44aVvxgKvvfLdfXmihAcI384OREGz0VTfi6_tZqoiK3NIokKBspJodKyTWJzzK92-oC2GJE5vluo97WDJ7yEhxNZuVQB9SN_YQ-UrhtHabZiJmmR69oDd8JbrbzWctvntQ_Tg");
        
    // check if url has a token
    var currentURL = window.location;
    var token = currentURL.hash;
    var accessToken = new URLSearchParams(token).get('access_token');
    console.log(accessToken);
    // window.localStorage.setItem('BB_USER_TOKEN', accessToken);    
    // if so, make api call to get budgets - if token expired, redirect to login, else, store token
    if (accessToken === null) {
        console.log('Token Not in url')
        // get stored token
        var storedToken = window.localStorage.getItem('BB_USER_TOKEN')
        console.log('stored Token:', storedToken)
        
        getDefaultBudget(storedToken)
        // // Make API Call
        // var myHeaders = new Headers();
        // myHeaders.append("Authorization", `Bearer ${storedToken}`);
        // // myHeaders.append("Access-Control-Allow-Origin", '*')

        // var requestOptions = {
        // method: 'GET',
        // headers: myHeaders,
        // redirect: 'follow',
        // mode: 'cors'
        // };

        // fetch("https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets", requestOptions)
        // .then(response => response.json())
        // .then(result => {
        //     console.log("result:", result)
        //     if (result === '{"message":"The incoming token has expired"}' || result === '{"message":"Unauthorized"}') {
        //         console.log("redirect to sign-in")
        //         setDefaultBudget(message => {
        //             return JSON.stringify(result)
        //         })
        //     }
        //     else if (JSON.stringify(result) === '{}') {
        //         console.log("User has no budgets", result)
        //         setDefaultBudget(message => {
        //             return JSON.stringify(result)
        //         })
        //     }
        //     else {
        //         console.log("Budgets: ", result);
        //         // get default budget ID
        //         var DefaultBudgetID = null;
        //         var DBudget = null;
        //         result.Budgets.forEach(Budget => {
        //             if (Budget.IsDefault === true ) {
        //                 DefaultBudgetID = Budget.BudgetID;
        //                 DBudget = Budget
        //             }
        //         });
        //         setDefaultBudget(MyBudget => {
        //             return DBudget
        //         });
                
        //         // ------------------
        //         // get categories
        //         // ------------------
        //         // make API Call
        //         var myHeaders = new Headers();
        //         myHeaders.append("Authorization", `Bearer ${accessToken}`);
        //         myHeaders.append("BudgetID", `${DefaultBudgetID}`)
        //         // myHeaders.append("Access-Control-Allow-Origin", '*')

        //         var requestOptions = {
        //         method: 'GET',
        //         headers: myHeaders,
        //         redirect: 'follow',
        //         mode: 'cors'
        //         };

        //         fetch(`https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/categories?BudgetID=${DefaultBudgetID}`, requestOptions)
        //         .then(response => response.json())
        //         .then(result => {
        //             console.log(result)
        //             if (result === '{"message":"The incoming token has expired"}' || result === '{"message":"Unauthorized"}') {
        //                 console.log("redirect to sign-in")
        //                 setDefaultBudget(message => {
        //                     return JSON.stringify(result)
        //                 })
        //             }
        //             else {
        //                 console.log("here's your categories!", result)
        //                 // add categories to state {...MyBudget, ...result}
        //                 setDefaultBudget(MyBudget => {
        //                     return JSON.stringify({...MyBudget, ...result})
        //                 })
        //             }

        //         })
        //         .catch(error => console.log('error', error));

        //     }

        // })
        // .catch(error => console.log('error', error));
    }
    // if there is a token in the url
    else {
        console.log('Token in URL')
        
        getDefaultBudget(accessToken)
        // // make API Call
        // var myHeaders = new Headers();
        // myHeaders.append("Authorization", `Bearer ${accessToken}`);
        // // myHeaders.append("Access-Control-Allow-Origin", '*')

        // var requestOptions = {
        // method: 'GET',
        // headers: myHeaders,
        // redirect: 'follow',
        // mode: 'cors'
        // };

        // fetch("https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets", requestOptions)
        // .then(response => response.json())
        // .then(result => {
        //     console.log(result)
        //     const expired = '{"message":"The incoming token has expired"}'
        //     const Unauthorized = '{"message":"Unauthorized"}'
        //     // const expired = JSON.parse('{"message":"The incoming token has expired"}')
        //     // const Unauthorized = JSON.parse('{"message":"Unauthorized"}')
        //     // console.log(expired)
        //     // console.log(result == expired)
        //     // const expired = {message:'The incoming token has expired'}
        //     // const Unauthorized = {message:'Unauthorized'}
        //     if (JSON.stringify(result) === expired || JSON.stringify(result) === Unauthorized) {
        //         console.log("redirect to sign-in")
        //         setDefaultBudget(message => {
        //             return JSON.stringify(result)
        //         })
        //     }
        //     else if (JSON.stringify(result) === '{}') {
        //         console.log("User has no budgets", result)
        //         setDefaultBudget(message => {
        //             return JSON.stringify(result)
        //         })
        //     }
        //     else {
        //         // IMPORTANT Account for user not having a budget yet!
        //         console.log("Budgets: ", result);
        //         // get default budget ID
        //         var DefaultBudgetID = null;
        //         var DBudget = null;
        //         result.Budgets.forEach(Budget => {
        //             if (Budget.IsDefault === true ) {
        //                 DefaultBudgetID = Budget.BudgetID;
        //                 DBudget = Budget
        //             }
        //         });
        //         setDefaultBudget(MyBudget => {
        //             return DBudget
        //         });
                
        //         // ------------------
        //         // get categories
        //         // ------------------
        //         // make API Call
        //         var myHeaders = new Headers();
        //         myHeaders.append("Authorization", `Bearer ${accessToken}`);
        //         myHeaders.append("BudgetID", `${DefaultBudgetID}`)
        //         // myHeaders.append("Access-Control-Allow-Origin", '*')

        //         var requestOptions = {
        //         method: 'GET',
        //         headers: myHeaders,
        //         redirect: 'follow',
        //         mode: 'cors'
        //         };

        //         fetch(`https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/categories?BudgetID=${DefaultBudgetID}` + new URLSearchParams({
        //             BudgetID: `${DefaultBudgetID}`
        //         }).toString(), requestOptions)
        //         .then(response => response.json())
        //         .then(result => {
        //             console.log(result)
        //             if (result === '{"message":"The incoming token has expired"}' || result === '{"message":"Unauthorized"}') {
        //                 console.log("redirect to sign-in")
        //                 setDefaultBudget(message => {
        //                     return JSON.stringify(result)
        //                 })
        //             }
        //             else {
        //                 console.log("here's your categories!", result)
        //                 // add categories to state {...MyBudget, ...result}
        //                 setDefaultBudget(MyBudget => {
        //                     return JSON.stringify({...MyBudget, ...result})
        //                 })
        //             }

        //         })
        //         .catch(error => console.log('error', error));

                
        //     }

        // })
        // .catch(error => console.log('error', error));

    }


    // var currentToken = window.localStorage.getItem('BB_USER_TOKEN')
    // window.localStorage.setItem('BB_USER_TOKEN', "eyJraWQiOiJSODZ6ZUpINEl1U1RHeUpNUTI2XC82azBTSFYwakRmVFlqTWJkczdycmFrbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzNGM4ZjNlMS1iNjQ5LTRjMGEtYTI3Yy1mMzFiODg2YWVmMzIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9QSkdGOHgxaDUiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIxazZsZDltODlpa2ZwNG5wdHZzaGo1YXFkIiwiZXZlbnRfaWQiOiI2Y2ZlZTk0Yi05NDU5LTRhZmMtODAwZS1lMjQ0MDM0MTMxNmMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjYyODM3OTQ4LCJleHAiOjE2NjI4NDE1NDgsImlhdCI6MTY2MjgzNzk0OCwianRpIjoiNDM3Nzg0ZTctMGY5OC00MjlhLTliZTItNTJiZjljNGNjMjYzIiwidXNlcm5hbWUiOiIzNGM4ZjNlMS1iNjQ5LTRjMGEtYTI3Yy1mMzFiODg2YWVmMzIifQ.J6iFBjXD2zWs1_RnvEbbx5x-RmWyhTACD5-jR_ILyF_VVjvlQwyXnJtNTz4I9OIEy9UE09cHWeaQU6in0G0hJK8x5oiVjpyti_oHI_rKjLfvT0sc57fQMOtZ2-cGsBvOTWocXaW-ErgOrKsvsRDSwpjK1Lcpir11C7O6EyEnkHllDqiJF64pkQaWvtiCQQghIeijEx4KI567Kq3ue44aVvxgKvvfLdfXmihAcI384OREGz0VTfi6_tZqoiK3NIokKBspJodKyTWJzzK92-oC2GJE5vluo97WDJ7yEhxNZuVQB9SN_YQ-UrhtHabZiJmmR69oDd8JbrbzWctvntQ_Tg");
    // var currentToken = "hello"
    // if (currentToken == "null"){
    //     var currentURL = window.location;
    //     var token = currentURL.hash;
    //     var accessToken = new URLSearchParams(token).get('access_token');
    //     // console.log(accessToken);
    //     window.localStorage.setItem('BB_USER_TOKEN', accessToken);
    // }
    // else {
    //     //--------------- Using Fetch()----------------------------
    //     console.log("We have a token");


    // }


    return(
        <Container>
            <h1>Default Budget page</h1>
            <p>Here is your Access Token: {accessToken}</p>
            <p>Default Budget is: {JSON.stringify(defaultBudget)}</p>
        </Container>
    )
}

export default DefaultBudget;