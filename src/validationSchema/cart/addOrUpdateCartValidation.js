import { validateProductId, validateQuantity } from "./sharedCartValidation";

const addOrUpdateCartValidation = [validateProductId(), validateQuantity()];

export default addOrUpdateCartValidation;
