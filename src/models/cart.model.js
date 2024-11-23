import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);
// Add an index to improve query performance for userId
CartSchema.index({ userId: 1 });
// Add the plugin
CartSchema.plugin(mongoosePaginate);
export default mongoose.model("Cart", CartSchema);
