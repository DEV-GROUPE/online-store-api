import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const ProductSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        brand: { type: String, required: true },
        price: { type: String, required: true },
        totalStock: { type: Number, required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category" },
    },
    { timestamps: true }
);
// Add the plugin
ProductSchema.plugin(mongoosePaginate);

const Prodcut = model("Product", ProductSchema);

export default Prodcut;
