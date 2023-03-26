import {React, useState } from "react";
import { Card, ProgressBar } from "react-bootstrap";
import { currencyFormatter } from "./Utils";
import AddExpenseModal from "./AddExpenseModal";

export default function CategoryCard ({ categoryid, name, cat, amount, max, budget, index, setDefaultBudget}) {
    const [modalShow, setModalShow] = useState(false);

    const classNames = ["border-primary"];
    if (amount > max) {
        classNames.push("bg-danger bg-opacity-25");
    }
    

    return(
        <>
        <Card className={classNames.join(" ")} onClick={() => setModalShow(true)}>
            <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-0">
                    <div className="me-2">{name}</div>
                    <div className="d-flex align-items-baseline fs-6">
                        {amount >= 0 ? currencyFormatter.format(amount) : 0}  
                        <span className="fs-6 ms-1">
                        / {currencyFormatter.format(max)}
                        </span>
                    </div>
                    
                </Card.Title>
                <div className="text-muted fs-6">{currencyFormatter.format(max - amount)} {amount > max ? "over" : "left"}</div>
                <ProgressBar variant={getProgressBarVariant(amount, max)} min={0} max={max} now={amount} />
            </Card.Body>
        </Card>
        <AddExpenseModal index={index} amountused={amount} setDefaultBudget={setDefaultBudget} passedCat={cat} categoryid={categoryid} categoryName={name} budget={budget} show={modalShow} handleClose={() => setModalShow(false)}/>
        </>
    )
}

function getProgressBarVariant(amount, max) {
    const ratio = amount / max
    if (ratio < 0.5) return "success"
    if (ratio < 0.75) return "warning"
    return "danger"
}