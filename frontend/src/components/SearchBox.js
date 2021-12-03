import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchBox = ({ history }) => {
    const [keyword, setKeyword] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            history.push(`/search/${keyword}`);
        } else {
            history.push('/');
        }
    };

    return (
        <Form onSubmit={submitHandler} style={{ display: 'flex' }}>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='Search products..'
                className='mr-sm-2 ml-sm-2'
                style={{ marginLeft: '15px', borderRadius: '15px 0 0 15px' }}></Form.Control>
            <Button
                type='submit'
                variant='outline-success'
                className='p-2'
                style={{ borderRadius: '0 15px 15px 0' }}>
                Search
            </Button>
        </Form>
    );
};

export default SearchBox;
