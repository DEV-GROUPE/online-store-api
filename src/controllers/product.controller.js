import mongoose from "mongoose";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import Prodcut from "../models/product.model.js";

import appError from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";

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
    
    
    const product = await Prodcut.find({_id}, { __v: 0 });

    res.json({ status: httpStatusText.SUCCESS, data: { product } });
});

const createProdcut = asyncWrapper(async (req, res, next) => {
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
