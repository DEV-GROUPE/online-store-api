import  mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
},{ timestamps: true });
CategorySchema.pre(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});
// Add the plugin
CategorySchema.plugin(mongoosePaginate);
export default mongoose.model("Category", CategorySchema);
