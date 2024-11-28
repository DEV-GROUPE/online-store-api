import { validateCategory } from "./sharedCategoryValidation";

const updateCategoryValidation = [validateCategory().optional()];

export default updateCategoryValidation;
