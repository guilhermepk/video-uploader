import { IpcError } from '../../../shared/models/errors/ipc.error'
import { InternalError } from '../../../shared/models/errors/internal.error';
import { IpcResponse } from '../../../shared/models/interfaces/ipc-response.interface';
import { Logger } from '@nestjs/common';

/**
 * Opções para customizar a tratativa do erro.
 * 
 * @property uncaughtErrorMessage - Uma mensagem personalizada a ser exibida em caso de um erro inesperado (não tratado como Ipc).
 * @property handleType - Tipo de tratativa. 'return' retorna o erro e 'throw' estoura ele. Ambos tratados para Ipc como InternalServerError (caso já não seja Ipc).
 */
interface ErrorOptions {
  uncaughtErrorMessage: string,
  handleType: 'throw' | 'return'
}

/**
 * Abstrai o uso de try cacth para padronizar a tratativa de erros.
 * Recebe uma função callback e a executa.
 * Em caso de erro, verifica se o erro é uma instância de IpcError e trata de acordo.
 * Isso evita que o backend trave com erros não tratados.
 * 
 * @param callback A função callback que será executada.
 * @property uncaughtErrorMessage - Uma mensagem personalizada a ser exibida em caso de um erro inesperado (não tratado como Ipc).
 * @returns O resultado da execução da função callback.
 *
 * @throws IpcError - Caso alguma regra de negócio seja atentida e estoure um erro previsto e programado.
 * @throws InternalServerError - Caso aconteça algum erro inesperado. Por exemplo, um erro no banco de dados ou um erro de runtime do JavaScript.
 * 
 * @example
 * return await tryCatch(async () => {
 *  const foundUser = await this.findUserByNicknameUseCase.execute(nickname)
 *    .catch(error => {
 *      if(error.code === IpcErrorCodes.NOT_FOUND) return null;
 *      else throw error;
 *    });
 *  if (foundUser) throw new ConflictError(`Já existe um usuário com o nickname ${nickname}`); // ConflictError herda/extende IpcError, logo, ele será estourado assim como foi criado.
 * 
 *  return await createUser(); // Se estourar um erro não tratado, como um do banco de dados por exemplo, ele será tratado pela função tryCatch como um InternalServerError.
 * }, `Erro ao criar usuário ${nickname}`); // Será exibido caso um erro não tratado ocorra.
 *
 */
export async function tryCatch<CallbackReturnType, OptionsType extends ErrorOptions>(
  callback: (() => CallbackReturnType) | (() => Promise<CallbackReturnType>),
  uncaughtErrorMessage: string
): Promise<CallbackReturnType | ReturnType<OptionsType>> {
  try {
    return await callback();
  } catch (error: any) {
    return handleError(error, { uncaughtErrorMessage, handleType: 'throw' });
  }
}

/**
 * Tipagem dinâmica de acordo com a forma de tratativa;
 */
type ReturnType<OptionsType extends ErrorOptions> = OptionsType extends { handleType: 'return' } ? IpcResponse<never> : never;

/**
 * Trata o erro recebido.
 * Caso seja um erro IPC (já tratado) o estoura.
 * Caso seja um erro comum (não tratado) o estoura como um erro interno do servidor.
 * 
 * @param error O erro a ser tratado.
 * @param errorOptions Opções para customizar a tratativa do erro.
 *
 * @throws IpcError Se o erro for uma instância de um erro IPC (erro já tratado).
 * @throws InternalServerError Se o erro recebido não for uma instância IPC (erro não tratado).
 */
export function handleError<OptionsType extends ErrorOptions>(error: any, errorOptions: OptionsType): ReturnType<OptionsType> {
  const { handleType, uncaughtErrorMessage } = errorOptions;

  if (error instanceof IpcError === false) {
    const logger = new Logger(handleError.name);
    logger.error(`${error.message ?? error}`);
  }

  const newError: IpcError = (error instanceof IpcError)
    ? error
    : new InternalError(
      `${uncaughtErrorMessage}`,
      [error.message ?? error]
    );

  switch (handleType) {
    case 'return':

      return {
        success: false,
        error: newError
      } as ReturnType<OptionsType>;
    case 'throw':
      throw newError;
  }
}