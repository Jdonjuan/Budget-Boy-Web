import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../assets/BudgetBoyLogo.png"

function BB_Nav() {
    const DefaultBudgetLink = "https://budgetboy.net/DefaultBudget"
    const signinLink =  "https://budgetboy.auth.us-east-1.amazoncognito.com/login?client_id=1k6ld9m89ikfp4nptvshj5aqd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=https://budgetboy.net/DefaultBudget"
    const SignOutLink = "https://budgetboy.auth.us-east-1.amazoncognito.com/logout?client_id=1k6ld9m89ikfp4nptvshj5aqd&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=http://budgetboy.net/"
    const MyBudgetsLink = "https://budgetboy.net/MyBudgets"
    const AccountLink = "https://budgetboy.net/Account"
  return (
    <Navbar bg="none" expand="lg" variant='dark'>
      <Container>
        <Navbar.Brand href={DefaultBudgetLink}>
        <img
              alt=""
              src={logo}
              width="55"
              height="55"
              className="d-inline-block align-top"
            />
        </Navbar.Brand>
        <Navbar.Brand href={DefaultBudgetLink}>
            <h2>Budget Boy</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href={DefaultBudgetLink}>My Budget</Nav.Link>
            {/* <Nav.Link href={AccountLink}>Account</Nav.Link> */}
          </Nav>
          <Button onClick={function logoutUser() {
                    console.log("user has been logged out")
                    window.localStorage.setItem('BB_USER_TOKEN', null);
                    window.localStorage.setItem('DefaultBudget', null);
                    window.localStorage.setItem('EMAIL', null)
                    }} href={SignOutLink}>Sign Out</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BB_Nav;