const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    phone: { type: String, default: "", index: true },
    firebaseUid: { type: String, default: "", sparse: true, index: true },
    avatar: { type: String, default: "" },
    role: { type: String, default: "admin" },
    permissions: { type: [String], default: [] },
    isSuperAdmin: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

adminSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);

    return next();
  } catch (err) {
    return next(err);
  }
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

adminSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = { Admin };
