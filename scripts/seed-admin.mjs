import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = "mongodb+srv://dineshyadav2571_db_user:zdExIVFq5ttJcWtG@cluster0.7lxscmw.mongodb.net/?appName=Cluster0";
const SEED_ADMIN_NAME = "Dinesh Kumar";
const SEED_ADMIN_EMAIL = "dineshyadav2571@gmail.com";
const SEED_ADMIN_PASSWORD = "password";

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}
if (!SEED_ADMIN_NAME || !SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
  throw new Error(
    "Missing SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, or SEED_ADMIN_PASSWORD",
  );
}
if (SEED_ADMIN_PASSWORD.length < 8) {
  throw new Error("SEED_ADMIN_PASSWORD must be at least 8 characters");
}

const adminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

await mongoose.connect(MONGODB_URI, { dbName: "trustlab" });

const email = SEED_ADMIN_EMAIL.trim().toLowerCase();
const existing = await Admin.findOne({ email }).lean();

if (existing) {
  console.log(`Admin already exists for ${email}`);
  await mongoose.disconnect();
  process.exit(0);
}

const passwordHash = await bcrypt.hash(SEED_ADMIN_PASSWORD, 12);
await Admin.create({
  name: SEED_ADMIN_NAME.trim(),
  email,
  passwordHash,
  isActive: true,
});

console.log(`Seeded first admin: ${email}`);
await mongoose.disconnect();
