import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ORDER_STATUS } from "../utils/orderStatus";

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                price: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: { type: Number, required: true },
        address: {
            type: String,
            required: true,
            minlength: 5,
        },
        city: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^\d{5}$/.test(v);
                },
                message: (props) => `${props.value} is not a valid pincode!`,
            },
        },
        phone: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^\d{10,15}$/.test(v);
                },
                message: (props) =>
                    `${props.value} is not a valid phone number!`,
            },
        },
        notes: {
            type: String,
            maxlength: 500,
        },
        status: {
            type: String,
            enum: Object.values(ORDER_STATUS),
            default: ORDER_STATUS.PENDING,
            required: true,
        },
    },
    { timestamps: true }
);
OrderSchema.plugin(mongoosePaginate);
const Order = mongoose.model("Order", OrderSchema);
export default Order;
