import asyncHandler from 'express-async-handler';
import sql from '../config/sqldb.js';

// @desc    Create new Order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        const [order] = await sql('Order').insert(
            {
                address: shippingAddress.address,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country,
                paymentMethod,
                taxPrice,
                shippingPrice,
                totalPrice,
                user: req.user._id,
            },
            '*'
        );

        console.log(order);

        const orderItemsRecord = [];
        for (let i = 0; i < orderItems.length; i++) {
            let [createdItem] = await sql('OrderItem').insert(
                {
                    name: orderItems[i].name,
                    image: orderItems[i].image,
                    orderId: order._id,
                    price: orderItems[i].price,
                    product: orderItems[i].product,
                    qty: orderItems[i].qty,
                },
                '*'
            );
            orderItemsRecord.push(createdItem);
        }

        console.log(orderItems);

        const createdOrder = {
            ...order,
            orderItems: orderItemsRecord,
            shippingAddress: {
                address: order.address,
                city: order.city,
                postalCode: order.postalCode,
                country: order.country,
            },
        };

        console.log(createdOrder);
        res.status(201).json(createdOrder);
    }
});

// @desc    Get Order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await sql('Order').where('_id', req.params.id);

    if (order) {
        const [user] = await sql('User').where('_id', order[0].user);
        const orderItems = await sql('OrderItem')
            .innerJoin('Product', 'Product._id', 'OrderItem.product')
            .where('orderId', req.params.id);

        const orderFull = {
            ...order[0],

            orderItems,
            shippingAddress: {
                address: order[0].address,
                city: order[0].city,
                postalCode: order[0].postalCode,
                country: order[0].country,
            },
            user,
        };
        // console.log(orderFull);
        res.json(orderFull);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update Order to Paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const [order] = await sql('Order').where('_id', req.params.id);

    if (order) {
        const timestamp = new Date().toISOString();
        const updatedOrder = await sql('Order')
            .update(
                {
                    isPaid: true,
                    paidAt: timestamp,
                },
                '*'
            )
            .where('_id', req.params.id);

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update Order to Delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const [order] = await sql('Order').where('_id', req.params.id);

    if (order) {
        const timestamp = new Date().toISOString();
        const updatedOrder = await sql('Order')
            .update(
                {
                    isDelivered: true,
                    deliveredAt: timestamp,
                },
                '*'
            )
            .where('_id', req.params.id);

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    GET logged in user's orders
// @route   GET /api/orders/myorder
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await sql('Order').where('user', req.user._id);
    console.log(orders);
    res.json(orders);
});

// @desc    GET All Orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await sql('Order');

    const populatedOrders = [];
    for (let i = 0; i < orders.length; i++) {
        const [user] = await sql.select('_id', 'name').from('User').where('_id', orders[i].user);
        populatedOrders[i] = {
            ...orders[i],
            user,
        };
    }

    res.json(populatedOrders);
});

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
};
