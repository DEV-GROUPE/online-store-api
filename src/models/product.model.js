import mongoose, { Schema, model } from "mongoose";
import User from "./user.model.js";
import mongoosePaginate from "mongoose-paginate-v2";
const ProductSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        brand: { type: String, required: true },
        price: { type: Number, required: true },
        totalStock: { type: Number, required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category" },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
    },
    { timestamps: true }
);

ProductSchema.post("updateOne", async function () {
    const query = this.getQuery();
    const productId = query._id;
    const product = await Product.findById(productId);

    if (!product.isDeleted) return;

    const users = await User.find({ "cart.product": productId });

    users.map(async (user) => {
        user.cart = user.cart.filter(
            (item) => item.product?.toString() !== productId?.toString()
        );
        await user.save();
    });
});
// Add the plugin
ProductSchema.plugin(mongoosePaginate);

const Product = model("Product", ProductSchema);

export default Product;
