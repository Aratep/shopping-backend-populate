const express = require('express');
const router = express.Router();

const product = require('../../controllers/products/products');
const verifyToken = require('../../middlewares/verifyToken');

router.use(verifyToken);
router.post('/create', product.create_product);
router.post('/add-new-variant', product.add_new_variant);
router.post('/add-to-cart', product.add_to_cart);
router.get('/products-list', product.get_all_products);
router.post('/cart-list', product.cart_list);
router.put('/update', product.update_product);
router.delete('/delete', product.delete_product);

module.exports = router;
