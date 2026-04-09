import { Model, Schema, model, models } from "mongoose";

export interface OpportunityDocument {
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const opportunitySchema = new Schema<OpportunityDocument>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 5000,
    },
  },
  { timestamps: true },
);

opportunitySchema.index({ createdAt: -1 });

export const Opportunity: Model<OpportunityDocument> =
  models.Opportunity || model<OpportunityDocument>("Opportunity", opportunitySchema);
