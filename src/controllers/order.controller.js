import asyncWrapper from "../middlewares/error/asyncWrapper.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import appError from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";
import { USER_ROLES } from "../utils/userRoles.js";

const createOrder = asyncWrapper(async (req, res, next) => {
    const { address, city, pincode, phone, notes } = req.body;
    const userId = req.user._id;
    const cartItems = [];
    let totalAmount = 0;
    const user = await User.findById(userId).populate("cart.product");
    const cart = user.cart;
    if (cart.length === 0) {
        const error = appError.create(
            "No items in the cart",
            400,
            httpStatusText.FAIL
        );
        return next(error);
    }
    for (const item of cart) {
        if (item.product.totalStock === 0) {
            const error = appError.create(
                `The product '${item.product.title}' is out of stock`,
                400,
                httpStatusText.FAIL
            );
            return next(error);
        }
        if (item.quantity > item.product.totalStock) {
            const error = appError.create(
                `The requested quantity exceeds available stock.Only ${item.product.totalStock} units of '${item.product.title}' are available.`,
                400,
                httpStatusText.FAIL
            );
            return next(error);
        }
        cartItems.push({
            product: item.product._id,
            price: item.product.price,
            quantity: item.quantity,
        });
        totalAmount += +item.product.price * item.quantity;
        await Product.findByIdAndUpdate(item.product.id, {
            $inc: { totalStock: -item.quantity },
        });
    }

    const newOrder = new Order({
        user: userId,
        cartItems,
        totalAmount,
        address,
        city,
        pincode,
        phone,
        notes,
    });
    await newOrder.save();

    user.cart = [];
    await user.save();

    res.status(201).json({ status: httpStatusText.SUCCESS, data: newOrder });
});

const getUserOrders = asyncWrapper(async (req, res, next) => {
    const userId = req.user._id;
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "asc",
    } = req.query;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        populate: [
            {
                path: "cartItems.product",
                populate: {
                    path: "category",
                    select: "name",
                },
            },
            { path: "user", select: "username email" },
        ],
        sort: { [sortBy]: order === "desc" ? -1 : 1 },
    };
    const orders = await Order.paginate({ user: userId }, options);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: orders });
});

const getAllOrders = asyncWrapper(async (req, res, next) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "asc",
    } = req.query;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        populate: [
            {
                path: "cartItems.product",
                populate: {
                    path: "category",
                    select: "name",
                },
            },
            { path: "user", select: "username email" },
        ],
        sort: { [sortBy]: order === "desc" ? -1 : 1 },
    };
    const orders = await Order.paginate({}, options);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: orders });
});

const getOrder = asyncWrapper(async (req, res, next) => {
    const userId = req.user._id;
    const role = req.user.role;
    const orderId = req.params.id;
    let query = { _id: orderId, user: userId };
    if (role === USER_ROLES.ADMIN) {
        query = { _id: orderId };
    }
    const order = await Order.findOne(query)
        .populate({
            path: "cartItems.product",
            populate: {
                path: "category",
                select: "name",
            },
        })
        .populate("user");
    if (!order) {
        const error = appError.create(
            "Order not found",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    res.status(200).json({ status: httpStatusText.SUCCESS, data: order });
});

const updateOrderStatus = asyncWrapper(async (req, res, next) => {
    const orderId = req.params.id;
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus },
        { new: true }
    );
    if (!order) {
        const error = appError.create(
            "Order not found",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    res.status(200).json({ status: httpStatusText.SUCCESS, data: order });
});

export { createOrder, getAllOrders, getUserOrders, getOrder, updateOrderStatus };
