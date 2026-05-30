const { verifyIdTokenSafe, initFirebaseAdmin } = require("../config/firebaseAdmin");
const { findAccountByPhone, normalizePhone } = require("../utils/findAccountByPhone");
const { generateToken } = require("../utils/generateToken");
const { ensureWallet } = require("../services/walletService");

const DEMO_PHONE_ROLE = {
  "+919000000001": "trial_member",
  "+919000000002": "member",
  "+919000000003": "supervisor",
  "+919000000004": "delivery_agent",
  "+919000000005": "recycler",
  "+919000000006": "admin",
};

/**
 * POST /api/auth/firebase
 * body: { idToken: string } OR demo { phone: string } when ECO_DEMO_AUTH=true
 */
const loginWithFirebase = async (req, res, next) => {
  try {
    let phone = "";
    let firebaseUid = "";

    const demoAuth = process.env.ECO_DEMO_AUTH === "true";
    const adminSdk = initFirebaseAdmin();

    if (demoAuth && req.body?.phone && !req.body?.idToken) {
      phone = normalizePhone(req.body.phone);
    } else if (req.body?.idToken) {
      if (!adminSdk) {
        return res.status(503).json({
          success: false,
          message: "Firebase Admin is not configured on the server",
        });
      }
      const decoded = await verifyIdTokenSafe(req.body.idToken);
      firebaseUid = decoded.uid;
      phone = normalizePhone(decoded.phone_number || decoded.phone || "");
    } else {
      return res.status(400).json({
        success: false,
        message: "idToken required (or enable ECO_DEMO_AUTH with phone for local demo)",
      });
    }

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone not found on token" });
    }

    let found = await findAccountByPhone(phone);
    if (!found && DEMO_PHONE_ROLE[phone]) {
      return res.status(404).json({
        success: false,
        message:
          "Account not provisioned for this phone. Run npm run seed in server to create demo users.",
        data: { phone, expectedRole: DEMO_PHONE_ROLE[phone] },
      });
    }
    if (!found) {
      return res.status(404).json({
        success: false,
        message: "No EcoXchange account for this phone number",
      });
    }

    const { doc, modelName } = found;
    if (firebaseUid) {
      const Model = doc.constructor;
      const existingUid = doc.firebaseUid;
      if (existingUid && existingUid !== firebaseUid) {
        return res.status(403).json({ success: false, message: "Phone linked to another account" });
      }
      if (!existingUid) {
        await Model.findByIdAndUpdate(doc._id, { firebaseUid }).catch(() => undefined);
      }
    }

    const wallet = await ensureWallet(doc._id, modelName);
    const token = generateToken(doc);

    const userJson = doc.toJSON ? doc.toJSON() : doc;
    delete userJson.password;

    return res.status(200).json({
      success: true,
      message: "Authenticated",
      token,
      data: {
        user: userJson,
        modelName,
        wallet,
      },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { loginWithFirebase };
