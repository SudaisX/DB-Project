import asyncHandler from 'express-async-handler';
import sql from '../config/sqldb.js';

// @desc    Fetch all Products
// @route   Get /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;

    // sql
    const keyword = req.query.keyword ? `%${req.query.keyword}%` : '';

    const sqlcount = keyword
        ? await sql('Product').count('name').where('name', 'ilike', keyword)
        : await sql('Product').count('name');

    const { count } = sqlcount[0];

    const products = keyword
        ? await sql('Product')
              .where('name', 'ilike', keyword)
              .limit(pageSize)
              .offset(pageSize * (page - 1))
        : await sql('Product')
              .limit(pageSize)
              .offset(pageSize * (page - 1));

    // console.log(keyword);
    // console.log(count);
    // console.log({ products2, page, pages: Math.ceil(count2 / pageSize) });

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   Get /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await sql('Product').where('_id', req.params.id);
    const reviews = await sql('Review').where('product', req.params.id);
    // console.log({ ...product[0], reviews });
    if (product) {
        res.json({ ...product[0], reviews });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await sql('Product').where('_id', req.params.id);

    if (product) {
        const reviews = await sql('Review').where('product', req.params.id);
        if (reviews) {
            await sql('Review').where('product', req.params.id).del();
        }
        await sql('Product').where('_id', req.params.id).del();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create Product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = await sql('Product').insert(
        {
            name: 'Sample Name',
            price: 0,
            user: req.user._id,
            image: '/images/sample.jpg',
            brand: 'Sample Brand',
            category: 'Sample Category',
            countInStock: 0,
            numReviews: 0,
            rating: 0,
            description: 'Sample Description',
        },
        '*'
    );

    res.status(201).json(product[0]);
});

// @desc    Update Product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await sql('Product').where('_id', req.params.id);
    if (product) {
        const updatedProduct = await sql('Product').where('_id', req.params.id).update(
            {
                name,
                price,
                description,
                image,
                brand,
                category,
                countInStock,
            },
            '*'
        );
        res.json(updatedProduct[0]);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create New Review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await sql('Product').where('_id', req.params.id);
    if (product) {
        const reviews = await sql('Review').where('product', req.params.id);
        if (reviews.length > 0) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        await sql('Review').insert({
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id, //req.user._id
            product: req.params.id,
        });

        const updatedReviews = await sql('Review').where('product', req.params.id);
        await sql('Product')
            .update({
                numReviews: updatedReviews.length,
                rating:
                    updatedReviews.reduce((acc, item) => item.rating + acc, 0) /
                    updatedReviews.length,
            })
            .where('_id', req.params.id);

        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Get Top Rated Products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await sql('Product').orderBy('rating', 'desc').limit(3);
    res.json(products);
});

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
};
