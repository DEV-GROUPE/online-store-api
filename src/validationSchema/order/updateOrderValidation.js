import { validateOrderStatus } from "./sharedOrderValidation.js";

const updateOrderValidation = [validateOrderStatus().optional()];
export default updateOrderValidation;
