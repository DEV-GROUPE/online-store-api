import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import appError from "../../utils/appError.js";
import { httpStatusText } from "../../utils/httpStatusText.js";

const requireAuth = async (req, res, next) => {
    // verify user is authenticated
    const { authorization } = req.headers;

    if (!authorization) {
        const error = appError.create(
            "Authorization token required",
            401,
            httpStatusText.FAIL
        );
        return next(error);
    }

    const token = authorization.split(" ")[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET);

        req.user = await User.findOne({ _id }).select("_id role");
        if (!req.user) {
            const error = appError.create(
                "Authorization: User Not Fount",
                401,
                httpStatusText.FAIL
            );
            return next(error);
        }
        next();
    } catch (err) {
        
        const error = appError.create(
            "Request is not authorized",
            401,
            httpStatusText.FAIL
        );
        return next(error);
    }
};

export default requireAuth;
