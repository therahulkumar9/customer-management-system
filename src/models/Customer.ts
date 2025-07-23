import mongoose, { Document, Model } from "mongoose"

export interface ICustomer extends Document {
  name: string
  email: string
  phone?: string
  location?: string
  profession?: string
  plan: {
    name: string
    startDate: Date
    endDate: Date
  }
  paymentScreenshot: string
  isCompanyMember: boolean
  addedBy: string
  createdAt: Date
  updatedAt: Date
}

const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
})

const CustomerSchema = new mongoose.Schema<ICustomer>(
  {
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
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    profession: {
      type: String,
      trim: true,
    },
    plan: {
      type: PlanSchema,
      required: true,
    },
    paymentScreenshot: {
      type: String,
      required: true,
    },
    isCompanyMember: {
      type: Boolean,
      required: true,
      default: false,
    },
    addedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const CustomerModel: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema)
export default CustomerModel
