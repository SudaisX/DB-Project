import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = ({ history }) => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    if (!shippingAddress) {
        history.push('/shipping');
    }

    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        history.push('/placeorder');
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>

                    <Col>
                        <Form.Check
                            type='radio'
                            label='Cash on Delivery'
                            id='cod'
                            name='paymentMethod'
                            value='Cash on Delivery'
                            onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                        <Form.Check
                            type='radio'
                            label='Credit Card'
                            id='credit'
                            name='paymentMethod'
                            value='Credit Card'
                            onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                        <Form.Check
                            type='radio'
                            label='Debit Card'
                            id='debit'
                            name='paymentMethod'
                            value='Debit Card'
                            onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                    </Col>

                    <Button type='submit' variant='primary' className='mt-3'>
                        Continue
                    </Button>
                </Form.Group>
            </Form>
        </FormContainer>
    );
};

export default PaymentScreen;
