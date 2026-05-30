const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const supervisorSchema = new mongoose.Schema(
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
    address: { type: String, default: "" },
    avatar: { type: String, default: "" },
    role: { type: String, default: "supervisor" },
    employeeId: { type: String, default: "" },
    assignedZones: { type: [String], default: [] },
    isVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    suspendedAt: { type: Date },
    suspendedReason: { type: String },
  },
  { timestamps: true },
);

supervisorSchema.pre("save", async function (next) {
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

supervisorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

supervisorSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const Supervisor = mongoose.model("Supervisor", supervisorSchema);

module.exports = { Supervisor };
