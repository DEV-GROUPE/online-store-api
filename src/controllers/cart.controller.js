import asyncWrapper from "../middlewares//error/asyncWrapper.js";
import Cart from "../models/cart.model.js";
import appError from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";

const createCart = asyncWrapper(async (req, res, next) => {
    const newCart = new Cart(req.body);
    await newCart.save();

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { cart: newCart },
    });
});

const getCart = asyncWrapper(async (req, res) => {
    const id = req.params.id;

    const cart = await Cart.findById(id);
    res.json({ status: httpStatusText.SUCCESS, data: { cart } });
});
const getAllCarts = asyncWrapper(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "asc",
    } = req.query;
    // Pagination options
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { [sortBy]: order === "desc" ? -1 : 1 },
    };

    // Paginate all carts without filters
    const carts = await Cart.paginate({}, options);
    res.json({ status: httpStatusText.SUCCESS, data: { carts } });
});

const deleteCart = asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const deleteCart = await Cart.findByIdAndDelete(id);
    if (!deleteCart) {
        const error = appError.create(
            "cart not found",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});
const updateCart = asyncWrapper(async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        const error = appError.create(
            "Request body cannot be empty",
            400,
            httpStatusText.FAIL
        );
        return next(error);
    }
    const id = req.params.id;
    const cart = await Cart.findById(id);
    if (!cart) {
        const error = appError.create(
            "cart not found",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    const updateCart = await Cart.updateOne(
        { _id: id },
        { $set: { ...req.body } }
    );
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: null,
    });
});
export { createCart, getAllCarts, getCart, deleteCart, updateCart };
