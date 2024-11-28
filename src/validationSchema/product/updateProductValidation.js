import {
    validateBrand,
    validateCategory,
    validateDescription,
    validateImageUrl,
    validatePrice,
    validateTitle,
    validateTotalStock,
} from "./sharedProductValidation";

const updateProductValidation = [
    validateBrand().optional(),
    validateCategory().optional(),
    validateDescription().optional(),
    validateImageUrl().optional(),
    validatePrice().optional(),
    validateTitle().optional(),
    validateTotalStock().optional(),
];

export default updateProductValidation;
