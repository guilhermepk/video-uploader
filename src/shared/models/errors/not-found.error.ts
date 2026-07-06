import { IpcErrorCodes } from "../enums/ipc-error-codes.enum";
import { IpcError } from "./ipc.error";

export class NotFoundError extends IpcError {
  constructor(
    readonly message: string,
    details?: string[]
  ) {
    super(IpcErrorCodes.NOT_FOUND, message, details);
  }
}