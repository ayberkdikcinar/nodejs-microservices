import nats, { Stan } from "node-nats-streaming";
class NatsClient {
  private _instance?: Stan;
  get instance() {
    if (!this._instance) {
      throw new Error("Cannot accesss NATS instance before conencting");
    }
    return this._instance;
  }
  connect(clusterId: string, clientId: string, url: string) {
    this._instance = nats.connect(clusterId, clientId, {
      url,
    });

    return new Promise<void>((resolve, reject) => {
      this._instance!.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this._instance!.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsClient = new NatsClient();
