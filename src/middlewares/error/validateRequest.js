import { validationResult } from "express-validator";
import appError from "../../utils/appError.js";

const validateRequest = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map((validation) => validation.run(req)));

        // Check for validation errors
        const errors = validationResult(req);

        // If there are errors, return them
        if (!errors.isEmpty()) {
            const error = appError.create(
                errors.array(),
                400,
                "Validation Failed"
            );
            return next(error);
        }

        next();
    };
};

export default validateRequest;
