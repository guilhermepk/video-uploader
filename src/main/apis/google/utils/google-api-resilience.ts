import { HttpStatus, Logger } from "@nestjs/common";
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

  return await new Promise(async (resolve, reject) => {
    while (attempts <= maxAttempts) {
      try {
        logger.debug(`[${actionName}] Requisitando ao Google... (${attempts}/${maxAttempts})`);

        const result = await callback()


        logger.debug(`[${actionName}] Fluxo de resiliência encerrado (${attempts}/${maxAttempts})`);

        attempts = maxAttempts + 1;

        resolve(result);
      } catch (error: any) {
        if (error! instanceof gaxios.GaxiosError) reject(error);

        const { status, message } = error;

        if (status !== HttpStatus.FORBIDDEN && status !== HttpStatus.TOO_MANY_REQUESTS) reject(error);

        const errorMessage = `Erro ${status} - "${message}".`;

        if (attempts + 1 > maxAttempts) {
          attempts += 1;

          logger.error(`[${actionName}] Todas as ${maxAttempts} foram mal sucedidas. ${errorMessage}`);

          reject(error);
        } else {
          logger.warn(`[${actionName}] ${errorMessage}`);
          attempts += 1;
          await sleep(3_000);
          continue;
        }
      }
    }
  });
}