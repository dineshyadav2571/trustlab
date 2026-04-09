import { Model, Schema, Types, model, models } from "mongoose";

export interface PasswordResetTokenDocument {
  adminId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const passwordResetTokenSchema = new Schema<PasswordResetTokenDocument>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
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

passwordResetTokenSchema.index({ adminId: 1, usedAt: 1 });

export const PasswordResetToken: Model<PasswordResetTokenDocument> =
  models.PasswordResetToken ||
  model<PasswordResetTokenDocument>(
    "PasswordResetToken",
    passwordResetTokenSchema,
  );
