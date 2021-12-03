import React from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
    return (
        // <footer>
        //     <Container>
        //         <Row>
        //             <Col className='text-center py-3'>Copyright &copy; Dukaan</Col>
        //         </Row>
        //     </Container>
        // </footer>
        <footer className='site-footer'>
            <div className='container'>
                <div className='row'>
                    <div className=' copyright-text col-md-8 col-sm-6 col-xs-12'>
                        Copyright &copy; 2021 All Rights Reserved by Dukaan.
                    </div>

                    <div className='col-md-4 col-sm-6 col-xs-12'>
                        <ul className='social-icons'>
                            <li>
                                <a className='facebook' href='!#'>
                                    <i className='fab fa-facebook-f'></i>
                                </a>
                            </li>
                            <li>
                                <a className='instagram' href='!#'>
                                    <i className='fab fa-instagram'></i>
                                </a>
                            </li>
                            <li>
                                <a className='twitter' href='!#'>
                                    <i className='fab fa-twitter'></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
