import { Model, Schema, model, models } from "mongoose";

/** Normal portal users created by admins (not staff). */
export interface AppUserDocument {
  name: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appUserSchema = new Schema<AppUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

export const AppUser: Model<AppUserDocument> =
  models.AppUser || model<AppUserDocument>("AppUser", appUserSchema);
