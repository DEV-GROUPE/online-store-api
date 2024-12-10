import { validateOrderStatus } from "./sharedOrderValidation.js";

const updateOrderValidation = [validateOrderStatus()];
export default updateOrderValidation;
