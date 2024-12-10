import {
    validateAddress,
    validateCity,
    validateNotes,
    validatePhone,
    validatePincode,
} from "./sharedOrderValidation.js";

const createOrderValidation = [
    validateAddress(),
    validateCity(),
    validatePincode(),
    validatePhone(),
    validateNotes(),
];

export default createOrderValidation;
