export class UnsupportedEntityError extends Error {
  constructor(public message: string = "", public entityId: string) {
    super(message);

    this.name = "UnsupportedEntityError";
    this.stack = (<any>new Error()).stack;
    Object.setPrototypeOf(this, UnsupportedEntityError.prototype);
  }
}
