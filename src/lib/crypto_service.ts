import * as nacl from "ecma-nacl";
import * as crypto from "crypto";
import { debug } from "../util/logging";
import { binToObject } from "../util/stringarray";
import { Buffer } from "buffer";
import * as request from "request-promise-native";
import { Application } from "../app";
import { URL } from "url";
import http = require("http");

export class CryptoService {

    public static create(privateKey: string, ssoPublicKey: string): CryptoService {
      return new CryptoService(new Buffer(privateKey, "Base64"), new Buffer(ssoPublicKey, "Base64"));
    }

    public readonly publicKey: string;
    private encryptor: nacl.secret_box.Encryptor | null = null;
    private decryptor: nacl.secret_box.Decryptor;
    private randomPayload: Buffer | null = null;

    constructor(privateKey: Buffer, ssoPublicKey: Buffer) {
      this.publicKey = new Buffer(nacl.box.generate_pubkey(privateKey)).toString("Base64");
      this.decryptor = nacl.box.formatWN.makeDecryptor(ssoPublicKey, privateKey);
      this.createNonce().then((nonce) => {
        this.encryptor = nacl.box.formatWN.makeEncryptor(ssoPublicKey, privateKey, nonce);
      });
      this.randomBytes(64).then((bytes) => {
        this.randomPayload = new Buffer(bytes);
      });
    }

    public verifyToken(token: string): Promise<any> {
      debug("Authenticating token", token);
      return new Promise((resolve, reject) => {
        if (!this.randomPayload || !this.encryptor) {
          debug("Crypto is uninitialized");
          return reject("Crypto not initialized yet");
        }
        const cipherBytes = this.encryptor.pack(this.randomPayload);

        const payload = new Buffer(cipherBytes).toString("Base64");
        debug("Payload", payload);

        const url = new URL(`/auth/lookup/${token}`, Application.config.ssoAPI);
        debug("URL", url.toString());

        const context = this;
        const options = {
          encoding: null,
          headers: {
            "User-Agent": "SMS/SSOTest",
            "Authorization": `PRODUCTAUTH ${Application.config.ssoName}:${payload}`,
          },
          transform: (body: any, response: http.IncomingMessage, resolveWithFullResponse?: boolean) => {
            const decoded = context.decryptor.open(Buffer.from(body));
            return binToObject(decoded);
          },
        };
        debug("Authorization", options.headers);
        resolve(request(url.toString(), options));
      }).then((response: any) => {
        debug("Decoded response", response);
        return response;
      });
    }

    private createNonce(): Promise<Uint8Array> {
      return this.randomBytes(nacl.secret_box.NONCE_LENGTH);
    }

    private randomBytes(length: number): Promise<Uint8Array> {
      return new Promise((resolve, reject) => {
        crypto.randomFill(new Uint8Array(length), (err, nonce) => {
          if (err) {
            return reject(err);
          }
          resolve(nonce);
        });
      });
    }
}
