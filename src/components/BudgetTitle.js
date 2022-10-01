import {React, useState } from "react";
import { Card, ProgressBar } from "react-bootstrap";
import { currencyFormatter } from "./Utils";

export default function BudgetTitle ({ categoryid, name, amount, max, budget, index}) {

    const classNames = []
    if (parseFloat(amount) > parseFloat(max)) {
        // console.log("Amount is: ", amount);
        // console.log("Max is: ", max)
        // console.log("Amount > Max?: ", (parseFloat(amount) > parseFloat(max)))
        classNames.push("bg-danger")
    }
    

    return(
        <>
        <Card className={classNames.join(" ")} >
            <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-3">
                    <div className="fs-6">{name}</div>
                    <div className="fs-6">{currencyFormatter.format(max - amount)}</div>
                    <div className="d-flex align-items-baseline fs-6 text-muted">
                        {currencyFormatter.format(amount)}/{currencyFormatter.format(max)}
                    </div>
                </Card.Title>
                <ProgressBar variant={getProgressBarVariant(amount, max)} min={0} max={max} now={amount} />
            </Card.Body>
        </Card>
        </>
    )
}

function getProgressBarVariant(amount, max) {
    const ratio = amount / max
    if (ratio < 0.5) return "primary"
    if (ratio < 0.75) return "warning"
    return "danger"
}