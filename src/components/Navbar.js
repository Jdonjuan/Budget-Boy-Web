import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../assets/BudgetBoyLogo.png"
import { AccountURL, DefaultBudgetURL, MyBudgetsURL, SignInURL, SignOutURL } from './Vars';

function BB_Nav() {
    const DefaultBudgetLink = DefaultBudgetURL
    const signinLink =  SignInURL
    const SignOutLink = SignOutURL
    const MyBudgetsLink = MyBudgetsURL
    const AccountLink = AccountURL
  return (
    <Navbar bg="none" expand="lg" variant='light'>
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