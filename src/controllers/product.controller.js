import { matchedData } from "express-validator";
import asyncWrapper from "../middlewares/error/asyncWrapper.js";
import Product from "../models/product.model.js";
import appError from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";

const getAllPoducts = asyncWrapper(async (req, res) => {
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

    // Paginate all products without filters
    const products = await Product.paginate({}, options);
    res.json({ status: httpStatusText.SUCCESS, data: { products } });
});

const getProduct = asyncWrapper(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id, { __v: 0 });

    res.json({ status: httpStatusText.SUCCESS, data: { product } });
});

const createProduct = asyncWrapper(async (req, res, next) => {
    const validatedData = matchedData(req, { locations: ["body"] });
    const newProduct = new Product(validatedData);
    await newProduct.save();

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { product: newProduct },
    });
});

const deleteProduct = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const deleteProduct = await Product.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date(),
    });
    if (!deleteProduct) {
        const error = appError.create(
            "Product not found",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});
const updatePoduct = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
    );
    if (!updatedProduct) {
        const error = appError.create(
            "Product not found",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { product: updatedProduct },
    });
});

export {
    getAllPoducts,
    getProduct,
    createProduct,
    deleteProduct,
    updatePoduct,
};
