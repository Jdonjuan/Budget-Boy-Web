import React, { useEffect, useState } from "react";
import { Button, Card, Container, Stack } from "react-bootstrap";
import BudgetTitle from "../components/BudgetTitle";
import CategoryCard from "../components/CategoryCard";
import BB_Nav from "../components/Navbar";
import { SignInURL } from "../components/Vars";
import { CreateBudgetURL } from "../components/Vars";
import { EditBudgetURL } from "../components/Vars";
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { currencyFormatter } from "../components/Utils";
Chart.register(ChartDataLabels);

// try api call to get budgets (or check if stored token exists/is valid), if get budgets works, get categories for default budget and display them to the screen
// if get budgets doesn't work, redirect to cognito sign in page. 

function DefaultBudget() {
    const loginURL = SignInURL
    const [defaultBudget, setDefaultBudget] = useState(null)
    // const [reportData, setReportData] = useState(null);
    const CreateBudgetPage = CreateBudgetURL
    const EditBudgetLink = EditBudgetURL

    window.localStorage.setItem('DefaultBudget', null);
    window.localStorage.setItem('EMAIL', null);
    window.localStorage.setItem('History', null);

    // window.localStorage.setItem("BB_USER_TOKEN", "");

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
        console.log('Getting Budgets (API Call)');
        fetch("https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets", requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log("Get Budgets res: ", result)
            const expired = '{"message":"The incoming token has expired"}'
            const Unauthorized = '{"message":"Unauthorized"}'
            if (JSON.stringify(result) === expired || JSON.stringify(result) === Unauthorized) {
                // console.log("redirect to sign-in")
                window.location.replace(loginURL);
                setDefaultBudget(message => {
                    return JSON.stringify(result)
                })
            }
            else if (JSON.stringify(result) === '{"Budgets":[]}') {
                
                // console.log("User has no budgets", result)
                // console.log("redirect to Create Budget page")
                window.location.replace(CreateBudgetPage);
                setDefaultBudget(message => {
                    return JSON.stringify(result)
                })
            }
            else if (JSON.stringify(result) == `{"message":"Internal server error"}`) {
                
                console.log("an error occured", result)
                setDefaultBudget(message => {
                    return JSON.stringify({error: "error"})
                })
            }
            else {
                console.log("Budgets: ", result);
                console.log("string", JSON.stringify(result));
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
                console.log('Getting Categories (API Call)');
                fetch(`https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/categories?BudgetID=${DefaultBudgetID}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    // console.log(result)
                    if (result === '{"message":"The incoming token has expired"}' || result === '{"message":"Unauthorized"}') {
                        // console.log("redirect to sign-in")
                        window.location.replace(loginURL);
                        setDefaultBudget(message => {
                            return JSON.stringify(result)
                        })
                    }
                    else if (JSON.stringify(result) === '{}') {
                        // console.log("Default Budget has no categories", JSON.stringify(result))
                        setDefaultBudget(MyBudget => {
                            return JSON.stringify({...DBudget, ...result})
                        })

                    }
                    else {
                        // console.log("here's your categories!", result);
                        // add categories to state {...MyBudget, ...result}
                        let defaultBudget = {...DBudget, ...result};
                        /////////////////////
                        // Get Report Data
                        /////////////////////
                        // make API Call
                        var myHeaders = new Headers();
                        myHeaders.append("Authorization", `Bearer ${Token}`);
                        myHeaders.append("BudgetID", `${DefaultBudgetID}`);
                        // myHeaders.append("Access-Control-Allow-Origin", '*')

                        var requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow',
                        mode: 'cors'
                        };
                        console.log('Getting Report Data (API Call)');
                        fetch(`https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/reportdata?BudgetID=${DefaultBudgetID}`, requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            // console.log('ReportCallResponse', result);
                            window.localStorage.setItem('History', JSON.stringify(result));
                            // setReportData(() => JSON.stringify(result));
                            console.log('updating State for setDefaultBudget');
                            setDefaultBudget(MyBudget => {
                                    return JSON.stringify({...defaultBudget, ...result})
                                });
                        });

                        // setDefaultBudget(MyBudget => {
                        //     return JSON.stringify({...DBudget, ...result})
                        // })
                    }

                })
                .catch(error => console.log('error', error));
                
                
                // /////////////////////
                // // Get Report Data - *** MOVE THIS INSIDE GET CATEGORIES REQUEST ***
                // /////////////////////
                // // make API Call
                // var myHeaders = new Headers();
                // myHeaders.append("Authorization", `Bearer ${Token}`);
                // myHeaders.append("BudgetID", `${DefaultBudgetID}`)
                // // myHeaders.append("Access-Control-Allow-Origin", '*')

                // var requestOptions = {
                // method: 'GET',
                // headers: myHeaders,
                // redirect: 'follow',
                // mode: 'cors'
                // };

                // fetch(`https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/reportdata?BudgetID=${DefaultBudgetID}`, requestOptions)
                // .then(response => response.json())
                // .then(result => {
                //     console.log('ReportCallResponse', result);
                //     window.localStorage.setItem('History', JSON.stringify(result));
                //     // setReportData(() => JSON.stringify(result));
                    
                // });
                
            }

        }).catch(error => console.log('error', error));
        
        
    }
        
    // Get token from URL if exists
    var currentURL = window.location;
    var token = currentURL.hash;
    var accessToken = new URLSearchParams(token).get('access_token');
    // console.log(accessToken);
    // window.localStorage.setItem('BB_USER_TOKEN', accessToken);    
    // if no token in URL
    if (accessToken === null) {
        // console.log('Token Not in url')
        // get stored token
        var accessToken = window.localStorage.getItem('BB_USER_TOKEN')
        // console.log('stored Token:', accessToken)
        
        getDefaultBudget(accessToken)
    }
    // if there is a token in the url
    else {
        // console.log('Token in URL')
        window.localStorage.setItem('BB_USER_TOKEN', accessToken);
        getDefaultBudget(accessToken)

    }
    
    

    function renderbudget(BudgetResponse) {
        if (BudgetResponse === null) {
            return "Loading..."
        }
        else if (defaultBudget === '{"Categories":{}}') {
            console.log("Empty Budget: ", defaultBudget)
            // window.location.replace(CreateBudgetPage);
        }
        else if (BudgetResponse == `{"error":"error"}` || defaultBudget == `{"error":"error"}`) {
            return (
                <>
                    <h5>Something went wrong</h5>
                </>
            )
        }
        else {
            // console.log(BudgetResponse)
            let Budget = JSON.parse(defaultBudget);
            window.localStorage.setItem('DefaultBudget', defaultBudget);
            Budget.Categories.sort((a, b) => {
                return Number(a.CategoryPositionID) - Number(b.CategoryPositionID)
            });
            return(
                <Container>
                        {/* <p>{BudgetResponse}</p> */}
                        <Stack>
                            <BudgetTitle name={Budget.BudgetName} amount={Number(Budget.BudgetAmountUsed)} max={Number(Budget.BudgetAmountTotal)}/>
                        </Stack>
                        <hr style={{color: 'black', width: '100%', border: '1px solid black'}} />
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: "1rem",
                            alignItems: "flex-start"
                        }}>
                            {Budget.Categories.map((Category, index) => {
                                // console.log(Category)
                                return(
                                    <CategoryCard key={index} index={index} setDefaultBudget={setDefaultBudget} cat={Category} categoryid={Category.CategoryID} budget={Budget} name={Category.CategoryName} amount={Number(Category.CategoryAmountUsed)} max={Number(Category.CategoryAmountTotal)}/>
                                )
                            })}
                        </div>
                        <Stack>
                            <Container className="mt-3">
                                <Button variant="secondary" href={EditBudgetLink}>Edit Budget</Button>
                            </Container>
                        </Stack>
                </Container>

            )
        }
    }

    function RenderReportData(BudgetResponse) {
        if (BudgetResponse === null) {
            return "Loading Reports..."
        }
        else if (BudgetResponse == `{"error":"error"}` || defaultBudget == `{"error":"error"}`) {
            return (
                <>
                    <h5>Something went wrong</h5>
                </>
            )
        }
        else {
            // Move Get Report Data API Call to the Get Categories Call! THis should reduce rerenders. 
            // 1 bar chart for each category. Each chart will display amount on Y and Month on X. with Name of the Category on Top of the chart
            // one overall budget chart that adds up all the category expenses.
            let budget = JSON.parse(defaultBudget);
            
            budget.CurrentCategories.sort((a, b) => {
                return Number(a.CategoryPositionID) - Number(b.CategoryPositionID)
            });
            
            // add overall budget Category
            let overallCat = {
                CategoryID: 'budget',
                CategoryName: budget.BudgetName,
                CategoryAmountTotal: budget.BudgetAmountTotal,
                CategoryAmountUsed: budget.BudgetAmountUsed
            }

            budget.CurrentCategories.unshift(overallCat);

            // add related history items for the overall budget category
            // for each hist item in the same month, add up their amount used and create a new history item with the amount and the CategoryID of 'budget'
            
            // get list of available months
            let availableMonths = [];
            budget.CategoryHistory.forEach(hist => {
                let month = new Date(hist.Timestamp.slice(0, 10)).toDateString().slice(4, 7);
                if ( !(availableMonths.includes(month)) ) {
                    availableMonths.push(month);
                }
            });
            
            // foreach available month, walk through the hist items and add up their amount used. Create new item with acquired info. 
            let overallHistItems = []
            availableMonths.forEach( month => {
                let monthTotal = 0;
                let TS;
                budget.CategoryHistory.forEach(histItem => {
                    let histMonth = new Date(histItem.Timestamp.slice(0, 10)).toDateString().slice(4, 7);
                    if ( histMonth == month ) {
                        monthTotal += parseFloat(histItem.CategoryAmountUsed);
                        TS = histItem.Timestamp;
                    }
                });
                let newHistItem = {
                    CategoryID: "budget",
                    CategoryAmountUsed: monthTotal,
                    Timestamp: TS
                }
                overallHistItems.push(newHistItem);
            });
            
            // add overall hist items to the Category History array
            budget.CategoryHistory = budget.CategoryHistory.concat(overallHistItems);

            let states = budget.CurrentCategories.map(cat => {
                let relatedHistItems = budget.CategoryHistory.filter(histItem => histItem.CategoryID == cat.CategoryID);
                // relatedHistItems = relatedHistItems.sort(() => )
                let newCat = {...cat, Timestamp: new Date().toISOString() }
                relatedHistItems.push(newCat);

                
                //transform data to 
                let newState = {
                    labels: relatedHistItems.map(item => new Date(item.Timestamp.slice(0, 10)).toDateString().slice(4, 7) ),
                    datasets: [
                        {
                            label: `${cat.CategoryName} | Max: ${currencyFormatter.format(cat.CategoryAmountTotal)}`,
                            data: relatedHistItems.map(item => Math.round(parseFloat(item.CategoryAmountUsed))),
                            backgroundColor: "green",
                            borderColor: "rgba(0, 0, 0, 1)",
                            borderWidth: 2
                        }
                    ]
                    
                }

                return newState
            })
            console.log('states', states);

            // const state = {
            //     labels: [],
            //     datasets: [
            //         {
            //             label: "CategoryName",
            //             backgroundColor: "rgba(75, 192, 192, 1)",
            //             borderColor: "rgba(0, 0, 0, 1)",
            //             borderWidth: 2,
            //             data: ["array of numbers corresponding to "]
            //         }
            //     ]
            // }

            return (
                <Container style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 3fr))",
                    gap: "1rem",
                    alignItems: "flex-start"
                }}>
                    {states.map((state, i) => {
                        let options = {
                            maintainAspectRation: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false
                                },
                                title: {
                                    text: state.datasets[0].label,
                                    display: true,
                                    font: {
                                        size: 16
                                    }
                                },
                                datalabels: {
                                    color: 'white',
                                    font: {
                                        size: 14
                                    }
                                },
                                id: 'horizontalArbitraryLine',
                                // beforeDraw(chart, args, options) {
                                //     const { ctx, chartArea: { top, right, bottom, left, width, height }, scales: {x, y} } = chart;
                                //     ctx.save();
                                //     ctx.strokeStyle = 'blue';
                                //     ctx.strokeRect(x0, y0, x1, y1);
                                // }
                            }
                        }
                        return (
                            <div style={{  backgroundColor: 'white', paddingRight: '10px', paddingLeft: '5px',  paddingBottom: '10px' }} key={i}>
                                {/* <Card.Body> */}
                                    <Bar data={state} options={options} />
                                {/* </Card.Body> */}
                                    
                            </div>
                        )
                    })}
                </Container>
            )
        }
        
    }

    return(
        <Container>
            <Container>
                <BB_Nav/>
            </Container>
            {renderbudget(defaultBudget)}
            <hr style={{
                    color: 'black'
                }} />
            <h2 className="mb-0">Reports</h2>
            <p>Last 12 months</p>
            {RenderReportData(defaultBudget)}
        </Container>
    )
}

export default DefaultBudget;