import {
    validateBrand,
    validateCategory,
    validateDescription,
    validateImageUrl,
    validatePrice,
    validateTitle,
    validateTotalStock,
} from "./sharedProductValidation.js";

const createProductValidation = [
    validateBrand(),
    validateCategory(),
    validateDescription(),
    validateImageUrl(),
    validatePrice(),
    validateTitle(),
    validateTotalStock(),
];

export default createProductValidation;
