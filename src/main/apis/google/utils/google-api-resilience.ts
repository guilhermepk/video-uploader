import { HttpStatus, Logger } from "@nestjs/common";
import { ServiceUnavailableError } from "@shared/models/errors/service-unavailable.error";
import { sleep } from "@shared/utils/sleep";
import { gaxios } from "google-auth-library";

const logger = new Logger(googleApiResilience.name);

export async function googleApiResilience<T>(
  callback: () => Promise<T>,
  options: {
    actionName: string,
    maxAttempts?: number
  }
): Promise<T> {
  const {
    actionName,
    maxAttempts = 5
  } = options ?? {};
  let attempts: number = 1;


  const promiseResult: T = await new Promise(async (resolve, reject) => {
    let rejectedError: any = null;

    while (attempts <= maxAttempts) {
      try {
        logger.debug(`[${actionName}] Requisitando ao Google... (${attempts}/${maxAttempts})`);

        const callbackResult = await callback();

        logger.debug(`[${actionName}] Fluxo de resiliência encerrado (${attempts}/${maxAttempts})`);

        attempts = maxAttempts + 1;

        resolve(callbackResult);
      } catch (error: any) {
        if (!(error instanceof gaxios.GaxiosError)) {
          rejectedError = error;
          break;
        }

        const { status, message } = error;

        if (status !== HttpStatus.FORBIDDEN && status !== HttpStatus.TOO_MANY_REQUESTS) {
          rejectedError = error;
          break;
        }

        if (status === HttpStatus.FORBIDDEN) {
          if (message.includes('you have exceeded your') && message.includes('quota')) {
            throw new ServiceUnavailableError(`O limite de cota do Google foi excedido. Por favor, tente novamente mais tarde.`);
          }

          const reasons: Array<string> = error.response?.data?.error?.errors.map(item => item.reason).filter(item => typeof item != 'string');


          if (reasons.find(item => item == 'quotaExceeded')) {
            throw new ServiceUnavailableError(`O limite de cota do Google foi excedido. Por favor, tente novamente mais tarde.`);
          }

          const nonRetryErrors = reasons.filter(item => item != 'rateLimitExceeded' && item != 'userRateLimitExceeded');

          if (nonRetryErrors.length > 0) {
            rejectedError = error;
            break;
          }
        }

        const errorMessage = `Erro ${status} - "${message}".`;

        if (attempts + 1 > maxAttempts) {
          attempts += 1;

          logger.error(`[${actionName}] Todas as ${maxAttempts} foram mal sucedidas. ${errorMessage}`);

          rejectedError = error;
          break;
        } else {
          logger.warn(`[${actionName}] ${errorMessage}`);
          attempts += 1;
          await sleep(3_000);
          continue;
        }
      }
    }

    if (rejectedError !== null) reject(rejectedError);
  });


  return promiseResult;
}