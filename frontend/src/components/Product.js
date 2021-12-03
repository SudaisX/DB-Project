import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Rating from './Rating';
import commaNumber from 'comma-number';

const Product = ({ product }) => {
    return (
        <Card className='my-3 p-3 rounder round-card'>
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image} variant='top' />
            </Link>

            <Card.Body>
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                    <Card.Title as='div'>
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>
                <hr style={{ margin: '0' }} />
                <Card.Text as='div'>
                    <div className='my-3'>
                        <Rating value={product.rating} text={`   ${product.numReviews}  reviews`} />
                    </div>
                </Card.Text>

                <Card.Text as='h3'>₨{commaNumber(product.price)}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Product;
