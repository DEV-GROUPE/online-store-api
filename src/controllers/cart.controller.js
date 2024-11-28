import asyncWrapper from "../middlewares/error/asyncWrapper.js";
import User from "../models/user.model.js";
import appError from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";

const getPoductsFromCart = asyncWrapper(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);
    const cart = user.cart;

    res.json({ status: httpStatusText.SUCCESS, data: { cart } });
});

const addOrUpdateCart = asyncWrapper(async (req, res, next) => {
    const { productId, quantity } = req.body;
    if (quantity < 0) {
        const error = appError.create(
            "Invalid quantity for new cart item",
            400,
            httpStatusText.FAIL
        );
        return next(error);
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

    const productInCart = user.cart.find(
        (item) => item.productId.toString() === productId
    );

    if (productInCart)
        productInCart.quantity =
            quantity > 0 ? quantity : productInCart.quantity;
    else user.cart.push({ productId, quantity });

    await user.save();
    return res.json({
        status: httpStatusText.SUCCESS,
        data: { cart: user.cart },
    });
});

// const addProductToCart = asyncWrapper(async (req, res, next) => {
//     const userId = req.user._id;
//     const { productId, quantity = 1 } = req.body;
//     const user = await User.findById(userId);

//     const existingProductIndex = user.cart.findIndex((item) => {
//         return item.productId?.toString() === productId;
//     });

//     if (existingProductIndex !== -1) {
//         user.cart[existingProductIndex].quantity += +quantity;
//     } else {
//         user.cart.push({ productId, quantity });
//     }

//     await user.save();

//     res.status(200).json({
//         status: httpStatusText.SUCCESS,
//         data: { cart: user.cart },
//     });
// });

// const updateCartQuantity = asyncWrapper(async (req, res, next) => {
//     const userId = req.user._id;
//     const { productId, quantity } = req.body;
//     const user = await User.findById(userId);
//     const existingProductIndex = user.cart.findIndex((item) => {
//         return item.productId?.toString() === productId?.toString();
//     });
//     if (existingProductIndex === -1) {
//         const error = appError.create(
//             "Product not found in cart",
//             404,
//             httpStatusText.FAIL
//         );
//         return next(error);
//     }
//     user.cart[existingProductIndex].quantity = +quantity;
//     await user.save();
//     res.status(200).json({
//         status: httpStatusText.SUCCESS,
//         data: { cart: user.cart },
//     });
// });

const deleteProductFromCart = asyncWrapper(async (req, res, next) => {
    const productId = req.params.id;
    const userId = req.user._id;
    const user = await User.findById(userId);

    user.cart = user.cart.filter(
        (item) => item.productId?.toString() !== productId
    );
    await user.save();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

export {
    getPoductsFromCart,
    deleteProductFromCart,
    addOrUpdateCart,
    // addProductToCart,
    // updateCartQuantity,
};
