import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userRefreshSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "AppUser",
      required: true,
      index: true,
    },
    tokenId: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

userRefreshSessionSchema.index({ userId: 1, revokedAt: 1 });

export type UserRefreshSessionDocument = InferSchemaType<
  typeof userRefreshSessionSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const UserRefreshSession: Model<UserRefreshSessionDocument> =
  mongoose.models.UserRefreshSession ??
  mongoose.model<UserRefreshSessionDocument>(
    "UserRefreshSession",
    userRefreshSessionSchema,
  );
