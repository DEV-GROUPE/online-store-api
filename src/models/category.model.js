import  mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});
// Add the plugin
CategorySchema.plugin(mongoosePaginate);
export default mongoose.model("Category", CategorySchema);
