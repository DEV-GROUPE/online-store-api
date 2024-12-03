import asyncWrapper from "../middlewares//error/asyncWrapper.js";
import Category from "../models/category.model.js";
import Prodcut from "../models/product.model.js";
import appError from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";

const getAllCategories = asyncWrapper(async (req, res) => {
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

    // Paginate all categories without filters
    const categories = await Category.paginate({}, options);
    res.json({ status: httpStatusText.SUCCESS, data: { categories } });
});

const getCategory = asyncWrapper(async (req, res) => {
    const { id } = req.params;

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
const deleteCategory = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const product = await Prodcut.countDocuments({category: id});
    if(product > 0){
        const error = appError.create(
            "Can't delete category. It's associated with a product.",
            400,
            httpStatusText.FAIL
        );
        return next(error);
    }
    const deleteCotegory = await Category.findByIdAndDelete(id);
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
const updateCategory = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const udateCategory = await Category.findByIdAndUpdate(
        id,
        { ...req.body },
        {
            new: true,
        }
    );
    if (!udateCategory) {
        const error = appError.create(
            "category not found",
            404,
            httpStatusText.FAIL
        );
        return next(error);
    }
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { category: udateCategory },
    });
});

export {
    getAllCategories,
    getCategory,
    createCategory,
    deleteCategory,
    updateCategory,
};
