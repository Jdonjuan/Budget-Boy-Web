import { Card, ProgressBar } from "react-bootstrap";
import { currencyFormatter } from "./Utils";

export default function BudgetCard ({ name, amount, max}) {
    const classNames = []
    if (amount > max) {
        classNames.push("bg-danger")
    }
    

    return(
        <Card className={classNames.join(" ")}>
            <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-3">
                    <div className="me-2">{name}</div>
                    <div>{currencyFormatter.format(max - amount)}</div>
                    <div className="d-flex align-items-baseline">
                        {currencyFormatter.format(amount)}  
                        <span className="text-muted fs-6 ms-1">
                        / {currencyFormatter.format(max)}
                        </span>
                    </div>
                </Card.Title>
                <ProgressBar variant={getProgressBarVariant(amount, max)} min={0} max={max} now={amount} />
            </Card.Body>
        </Card>
    )
}

function getProgressBarVariant(amount, max) {
    const ratio = amount / max
    if (ratio < 0.5) return "primary"
    if (ratio < 0.75) return "warning"
    return "danger"
}