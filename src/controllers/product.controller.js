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
        populate: {
            path: "category",
            select: "name",
        },
    };

    // Paginate all products without filters
    const products = await Product.paginate({ isDeleted: false }, options);
    res.json({ status: httpStatusText.SUCCESS, data: products });
});

const getProduct = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findOne(
        { _id: id, isDeleted: false },
        { __v: 0}
    ).populate({
        path: "category",
        select: "name",
    });
    console.log("product", product);

    if (!product) {
        const error = appError.create(
            "Product not found or deleted",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    res.json({ status: httpStatusText.SUCCESS, data: product });
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
    const product = await Product.findOne({ _id: id, isDeleted: false });

    if (!product) {
        const error = appError.create(
            "Product not found",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }

    await Product.updateOne(
        { _id: id },
        {
            isDeleted: true,
            deletedAt: new Date(),
        }
    );
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});
const updatePoduct = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const validatedData = matchedData(req, { locations: ["body"] });

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        validatedData,
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
