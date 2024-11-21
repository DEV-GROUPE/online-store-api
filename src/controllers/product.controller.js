import asyncWrapper from "../middlewares//error/asyncWrapper.js";
import Prodcut from "../models/product.model.js";

import appError from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";
import { validationResult } from "express-validator";
import Category from "../models/category.model.js";

const getAllPoducts = asyncWrapper(async (req, res) => {
    const query = req.query;
    const limit = +query.limit || 6;
    const page = +query.page || 1;

    const skip = (page - 1) * limit;
    const products = await Prodcut.find({}, { __v: 0 }).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { products } });
});

const getProdcut = asyncWrapper(async (req, res) => {
    const _id = req.params.id;

    const product = await Prodcut.find({ _id }, { __v: 0 });

    res.json({ status: httpStatusText.SUCCESS, data: { product } });
});

const createProdcut = asyncWrapper(async (req, res, next) => {
    const categoryId = req.body.category;

    const category = await Category.findById(categoryId);
    if (!category) {
        const error = appError.create(
            "Category not found",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
        return next(error);
    }
    const newProdcut = new Prodcut(req.body);
    await newProdcut.save();

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { Prodcut: newProdcut },
    });
});

const deleteProdct = asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const deleteProduct = await Prodcut.findByIdAndDelete({ _id: id });
    if (!deleteProduct) {
        const error = appError.create(
            "Prodcut not found",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});
const updatePoduct = asyncWrapper(async (req, res, next) => {
    const id = req.params.id;

    const product = await Prodcut.findById(id);

    if (!product) {
        const error = appError.create(
            "Prodcut not found",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    const udateProdcut = await Prodcut.updateOne(
        { _id: id },
        { $set: { ...req.body } }
    );
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { Prodcut: udateProdcut },
    });
});

export { getAllPoducts, getProdcut, createProdcut, deleteProdct, updatePoduct };
