import mongoose, { Document, Model } from "mongoose"

export interface IStaff extends Document {
  _id: mongoose.Types.ObjectId; 
  username: string
  password: string
  role: "Adder" | "Updater"
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

const StaffSchema = new mongoose.Schema<IStaff>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Adder", "Updater"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
)

const StaffModel: Model<IStaff> =
  mongoose.models.Staff || mongoose.model<IStaff>("Staff", StaffSchema)
export default StaffModel
