import { Model, Schema, Types, model, models } from "mongoose";

export interface UserPasswordResetTokenDocument {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userPasswordResetTokenSchema = new Schema<UserPasswordResetTokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "AppUser",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

userPasswordResetTokenSchema.index({ userId: 1, usedAt: 1 });

export const UserPasswordResetToken: Model<UserPasswordResetTokenDocument> =
  models.UserPasswordResetToken ||
  model<UserPasswordResetTokenDocument>(
    "UserPasswordResetToken",
    userPasswordResetTokenSchema,
  );
