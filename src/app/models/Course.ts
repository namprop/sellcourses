import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    teacher: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    image: { type: String, required: false, trim: true },
    description: { type: String, required: false, trim: true },
  },
  { timestamps: true }
);

export type CourseDocument = mongoose.InferSchemaType<typeof courseSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default mongoose.models.Course ||
  mongoose.model("Course", courseSchema);

