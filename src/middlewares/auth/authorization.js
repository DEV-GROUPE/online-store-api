import appError from "../../utils/appError.js";
import { httpStatusText } from "../../utils/httpStatusText.js";

const authorization = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            const error = appError.create(
                "You Are Not Authorized",
                403,
                httpStatusText.FAIL
            );
            return next(error);
        }
        next();
    };
};

export default authorization;
