import mongoose from "mongoose";
import appError from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";

const checkIsValidObjId = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = appError.create(
            "Invalid category ID format",
            400,
            httpStatusText.ERROR
        );
        return next(error);
    }

    next();
};
export default checkIsValidObjId;
