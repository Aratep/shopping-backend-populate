const express = require('express');
const router = express.Router();

const Product = require('../../models/schemas/products');
const Variant = require('../../models/schemas/variants');
const Cart = require('../../models/schemas/cart');
const Users = require('../../models/schemas/users');

router.create_product = (req, res, next) => {
    console.log(req.body);
    const name = req.body.values.name;
    const imagePath = req.body.values.path;
    const description = req.body.values.description;
    const price = req.body.values.price;
    const available_quantity = req.body.values.quantity;
    const status = req.body.values.status;

    const product = {name, imagePath, description, price, available_quantity, status};
    const newProduct = new Product(product);

    newProduct.save()
        .then(prod => {
            return res.json(prod);
        })
        .catch(err => console.log(err))
};

router.add_to_cart = (req, res, next) => {
    console.log(req.body)

    const prod_id = req.body.prod_id;
    const user_id = req.body.user_id;

    Users.findOne({_id: user_id})
        .then(user => {

            if (user) {
                let productIds = user.products;
                productIds.push(prod_id);

                console.log(user)
                Users.updateOne(
                    {_id: user_id},
                    {$set: {products: productIds}},
                    {runValidators: true, context: 'query'}
                )
                    .then(() => {
                        res.status(200).json({updated: {user}});
                    })
                    .catch(err => {
                        for (let i in err.errors) {
                            return res.status(400).send({
                                message: err.errors[i].message
                            });
                        }
                    })
            }
        })
        .catch(err => console.log(err));
};

router.get_all_products = (req, res) => {

    Product.find({}).populate('variants').exec((err, prod) => {
        if (err) throw err;

        console.log(prod)
        res.status(200).json({prod})
    })
};

router.add_new_variant = (req, res, next) => {
    console.log(req.body);

    const variant_name = req.body.values.variantName;
    const variant_price = req.body.values.variantPrice;
    const variant_status = req.body.values.variantStatus;
    const variant_image_path = req.body.values.variantImagePath;
    const id = req.body.values.id;

    const variant = {variant_name, variant_price, variant_status, variant_image_path};
    const newVariant = new Variant(variant);

    newVariant.save()
        .then(variant => {
            Product.findOne({_id: id})
                .then(product => {
                    let variantsIds = product.variants;
                    variantsIds.push(variant._id);

                    if (product) {
                        Product.updateOne(
                            {_id: id},
                            {$set: {variants: variantsIds}},
                            {runValidators: true, context: 'query'}
                        )
                            .then(() => {
                                res.status(200).json({updated: {variant}});
                            })
                            .catch(err => {
                                for (let i in err.errors) {
                                    return res.status(400).send({
                                        message: err.errors[i].message
                                    });
                                }
                            })
                    }
                })
                .catch(err => console.log(err));

            res.status(200).json({variant})
        })
        .catch(err => console.log(err))

}

// router.update_product = (req, res, next) => {
//     const name = req.body.values.name;
//     const imagePath = req.body.values.path;
//     const description = req.body.values.description;
//     const price = req.body.values.price;
//     const available_quantity = req.body.values.quantity;
//     const status = req.body.values.status;
//     const id = req.body.id;
//
//     // console.log(req.body);
//
//     Product.findOne({_id: id})
//         .then(product => {
//             if (product) {
//                 Product.updateOne(
//                     {_id: id},
//                     {$set: {name, imagePath, description, price, available_quantity, status}},
//                     {runValidators: true, context: 'query'}
//                 )
//                     .then(() => {
//                             res.status(200).json({
//                                     updated: {name, imagePath, description, price, available_quantity, status}
//                                 }
//                             );
//                         }
//                     )
//                     .catch(err => {
//                         for (let i in err.errors) {
//                             return res.status(400).send({
//                                 message: err.errors[i].message
//                             });
//                         }
//                     })
//             }
//         })
//         .catch(err => console.log(err));
// }

router.delete_product = (req, res) => {
    const id = req.body.id;

    Product.findOne({_id: id})
        .then(product => {
            if (product) {
                Variant.remove({_id: {$in: product.variants}})
                    .then(() => {console.log('variants are deleted')});
                Product.remove({_id: id})
                    .then(() => {
                        res.status(200).json({message: `${product.name} is deleted`});
                    });

            }
        })
        .catch(err => console.log(err))
};


module.exports = router;


