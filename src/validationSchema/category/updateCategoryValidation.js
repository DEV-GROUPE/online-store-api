import { validateCategory } from "./sharedCategoryValidation.js";

const updateCategoryValidation = [validateCategory().optional()];

export default updateCategoryValidation;
