import mongoose, { Schema, model } from "mongoose";

const ProductSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        brand: { type: String, required: true },
        price: { type: String, required: true },
        salePrice: {type: String, required: true },
        totalStock: { type: Number, required: true },
        averageReview: { type: Number },
        category: { type: Schema.Types.ObjectId, ref: "Category" },
    },
    { timestamps: true }
);

const Prodcut = model("Product", ProductSchema);

export default Prodcut;
