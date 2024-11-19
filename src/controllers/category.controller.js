import asyncWrapper from "../middlewares/asyncWrapper.js";
import Category from "../models/category.model.js";
import appError from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";

const getAllcategories = asyncWrapper(async (req, res) => {
    const query = req.query;
    const limit = +query.limit || 6;
    const page = +query.page || 1;

    const skip = (page - 1) * limit;
    const categories = await Category.find({}, { __v: 0 })
        .limit(limit)
        .skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { categories } });
});

const getcategory = asyncWrapper(async (req, res) => {
    const id = req.params.id;

    const category = await Category.findById(id);
    res.json({ status: httpStatusText.SUCCESS, data: { category } });
});
const createCategory = asyncWrapper(async (req, res, next) => {
    const { name } = req.body;

    const oldCategory = await Category.findOne({ name });

    if (oldCategory) {
        const error = appError.create(
            "category already exists",
            400,
            httpStatusText.FAIL
        );
        return next(error);
    }

    const newCategory = new Category(req.body);
    await newCategory.save();

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { category: newCategory },
    });
});
const deleteCotegory = asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const deleteCotegory = await Category.findByIdAndDelete({ _id: id });
    if (!deleteCotegory) {
        const error = appError.create(
            "category not found",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});
const updateCotegory = asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const category = await Category.findById({ _id: id });
    if (!category) {
        const error = appError.create(
            "category not found",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    const udateCategory = await Category.updateOne(
        { _id: id },
        { $set: { ...req.body } }
    );
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { category: udateCategory },
    });
});

export {
    getAllcategories,
    getcategory,
    createCategory,
    deleteCotegory,
    updateCotegory,
};
