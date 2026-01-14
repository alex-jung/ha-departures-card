export class UnsupportedEntityError extends Error {
  constructor(public message: string = "", public entityId: string) {
    super(message);

    this.name = entityId;
    this.stack = (<any>new Error()).stack;
    Object.setPrototypeOf(this, UnsupportedEntityError.prototype);
  }
}

export class EntityNotAvailable extends Error {
  constructor(public message: string = "", public entityId: string) {
    super(message);

    this.name = entityId;
    this.stack = (<any>new Error()).stack;
    Object.setPrototypeOf(this, EntityNotAvailable.prototype);
  }
}
