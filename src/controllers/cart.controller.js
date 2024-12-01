import asyncWrapper from "../middlewares/error/asyncWrapper.js";
import User from "../models/user.model.js";
import { httpStatusText } from "../utils/httpStatusText.js";

const getPoductsFromCart = asyncWrapper(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);
    const cart = user.cart;

    res.json({ status: httpStatusText.SUCCESS, data: { cart } });
});

const addOrUpdateCart = asyncWrapper(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);

    const product = await Product.findById(productId);

    if (!product) {
        const error = appError.create(
            "Product do not exists",
            400,
            httpStatusText.FAIL
        );
        return next(error);
    }

    const productInCart = user.cart.find(
        (item) => item.productId?.toString() === productId
    );

    if (productInCart) productInCart.quantity = quantity;
    else user.cart.push({ productId, quantity });

    await user.save();
    return res.json({
        status: httpStatusText.SUCCESS,
        data: { cart: user.cart },
    });
});

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

export { getPoductsFromCart, deleteProductFromCart, addOrUpdateCart };
