import { Model, Schema, Types, model, models } from "mongoose";

export interface RefreshSessionDocument {
  adminId: Types.ObjectId;
  tokenId: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const refreshSessionSchema = new Schema<RefreshSessionDocument>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    tokenId: {
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
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

refreshSessionSchema.index({ adminId: 1, revokedAt: 1 });

export const RefreshSession: Model<RefreshSessionDocument> =
  models.RefreshSession ||
  model<RefreshSessionDocument>("RefreshSession", refreshSessionSchema);
