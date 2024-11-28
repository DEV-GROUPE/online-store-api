import {
    validateBrand,
    validateCategory,
    validateDescription,
    validateImageUrl,
    validatePrice,
    validateTitle,
    validateTotalStock,
} from "./sharedProductValidation";

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
