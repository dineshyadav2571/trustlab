import { Model, Schema, Types, model, models } from "mongoose";

export const contentKinds = ["text", "image", "pdf", "word"] as const;
export type ContentKind = (typeof contentKinds)[number];

export interface ContentDocument {
  title: string;
  kind: ContentKind;
  /** Plain text when kind is `text` */
  textBody: string;
  /** Binary for image / pdf / word */
  fileData?: Buffer;
  fileMimeType: string;
  originalFileName: string;
  allowedUserIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema = new Schema<ContentDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    kind: {
      type: String,
      required: true,
      enum: contentKinds,
    },
    textBody: {
      type: String,
      default: "",
      maxlength: 500_000,
    },
    fileData: {
      type: Buffer,
      required: false,
    },
    fileMimeType: {
      type: String,
      default: "",
      maxlength: 200,
    },
    originalFileName: {
      type: String,
      default: "",
      maxlength: 500,
    },
    allowedUserIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "AppUser",
        required: true,
      },
    ],
  },
  { timestamps: true },
);

contentSchema.index({ createdAt: -1 });
contentSchema.index({ allowedUserIds: 1 });

export const Content: Model<ContentDocument> =
  models.Content || model<ContentDocument>("Content", contentSchema);
