import { IpcErrorCodes } from '../enums/ipc-error-codes.enum';
import { IpcError } from "./ipc.error";

export class ServiceUnavailableError extends IpcError {
  constructor(
    readonly message: string,
    details?: string[]
  ) {
    super(IpcErrorCodes.SERVICE_UNAVAILABLE, message, details);
  }
}