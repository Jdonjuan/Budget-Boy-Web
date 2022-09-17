import { Card, Container, Stack } from "react-bootstrap";
import { currencyFormatter } from "./Utils";

export default function BudgetTitle ({ name, amount, max}) {
    return(
        <Container>
            <Stack direction="horizontal" gap="2">
                <h5>{name} -</h5> <h5>{currencyFormatter.format(max - amount)} Left -</h5> <h6>{currencyFormatter.format(amount)} / {currencyFormatter.format(max)}</h6>
            </Stack>
            
            <hr style={{
                    color: 'white'
                }} />
        </Container>
    )
}