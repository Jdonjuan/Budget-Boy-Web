import React from "react";
import { Container, Stack } from "react-bootstrap";

export default function Footer() {
    return (
        <Container className="my-3">
            <footer  >
                <hr />
                <Stack direction="horizontal" gap={3}>
                    <div>
                        <a href="https://www.freeprivacypolicy.com/live/0ad81b10-11ba-4062-9d27-dc84a83f866c">Privacy</a>
                    </div>
                    <div>
                        {/* <a>Terms</a> */}
                    </div>
                    
                </Stack>
                
            </footer>
        </Container>
    )
}