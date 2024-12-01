import { validateProductId, validateQuantity } from "./sharedCartValidation.js";

const addOrUpdateCartValidation = [validateProductId(), validateQuantity()];

export default addOrUpdateCartValidation;
