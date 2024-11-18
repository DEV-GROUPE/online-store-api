import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        brand: { type: String, required: true },
        price: { type: mongoose.Schema.Types.Decimal128, required: true },
        salePrice: { type: mongoose.Schema.Types.Decimal128, required: true },
        totalStock: { type: Number, required: true },
        averageReview: { type: Number },
        category: { type: Schema.Types.ObjectId, ref: "Category" },
    },
    { timestamps: true }
);

const Prodcut = models.Product || model("Product", ProductSchema);

export default Prodcut;
