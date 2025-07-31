import { join } from "path";
import * as fs from "fs";
import * as crypto from "crypto";

export function keyGenerate() {
  const dirPath = join(__dirname, process.env.KEY_PATH || "../../chaves");
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  const privateKeyPath = join(dirPath, "private_key.pem");
  const publicKeyPath = join(dirPath, "public_key.pem");

  if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    const key = crypto.generateKeyPairSync("ec", {
      namedCurve: "secp521r1",
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    fs.writeFileSync(privateKeyPath, key.privateKey);
    fs.writeFileSync(publicKeyPath, key.publicKey);
  }
}
