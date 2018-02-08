const express = require('express');
const router = express.Router();

const product = require('../../controllers/products/products');
const verifyToken = require('../../middlewares/verifyToken');

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

function hasAccess(accessLevel) {
    return function (req, res, next) {

        if (req.user && req.user.hasAccess(accessLevel)) {
            return next();
        }
        console.log('have no permissions')
        return res.json({
            success: false,
            error: 'Unauthorized'
        });
    }
}

// hasAccess('admin')

router.post('/cart-list', product.cart_list);
router.use(verifyToken);
router.post('/create',  product.create_product);
router.post('/add-new-variant', product.add_new_variant);
router.post('/add-to-cart', product.add_to_cart);
router.get('/products-list', product.get_all_products);
router.put('/update', product.update_product);
router.delete('/delete', product.delete_product);

module.exports = router;
