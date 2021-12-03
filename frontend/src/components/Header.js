import React from 'react';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import SearchBox from './SearchBox';
import { logout } from '../actions/userActions';

const Header = () => {
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const logoutHandler = () => {
        dispatch(logout());
    };

    return (
        <header>
            <Navbar
                style={{ backgroundColor: 'rgba(33,33,33,0.95)' }}
                variant='dark'
                expand='lg'
                collapseOnSelect>
                <Container style={{ maxWidth: '92%' }}>
                    <LinkContainer to='/'>
                        <Navbar.Brand>
                            <div>
                                <img
                                    src='http://nonamakeup.com/wp-content/uploads/2021/10/Nona-name-160-w.png'
                                    alt='logo'
                                />
                            </div>
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav style={{ marginLeft: '40px' }}>
                            <LinkContainer to='/'>
                                <Nav.Link>Home</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to='/about'>
                                <Nav.Link>About</Nav.Link>
                            </LinkContainer>
                        </Nav>

                        <Route render={({ history }) => <SearchBox history={history} />} />

                        <Nav style={{ marginLeft: 'auto' }}>
                            <LinkContainer to='/cart'>
                                <Nav.Link>
                                    <i className='fas fa-shopping-cart' /> Cart
                                </Nav.Link>
                            </LinkContainer>
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                    <LinkContainer to='/orders'>
                                        <NavDropdown.Item>My Orders</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Edit Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    {userInfo.isAdmin && (
                                        <>
                                            <NavDropdown.Divider />
                                            <LinkContainer to='/admin/userlist'>
                                                <NavDropdown.Item>Users List</NavDropdown.Item>
                                            </LinkContainer>

                                            <LinkContainer to='/admin/productlist'>
                                                <NavDropdown.Item>Products List</NavDropdown.Item>
                                            </LinkContainer>

                                            <LinkContainer to='/admin/orderlist'>
                                                <NavDropdown.Item>Orders List</NavDropdown.Item>
                                            </LinkContainer>
                                            <NavDropdown.Divider />
                                        </>
                                    )}
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to='/login'>
                                    <Nav.Link>
                                        <div>
                                            <i className='fas fa-user' /> Sign In
                                        </div>
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
