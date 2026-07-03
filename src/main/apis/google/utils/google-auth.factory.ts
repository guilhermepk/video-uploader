import { ReadGoogleTokenUseCase } from "@main/secure-data-manager/use-cases/read-google-token/read-google-token.use-case";
import { Logger } from "@nestjs/common";
import { Auth } from "googleapis";

export async function googleAuthFactory(readGoogleTokenUseCase: ReadGoogleTokenUseCase) {
  const logger = new Logger(googleAuthFactory.name);

  const client = new Auth.OAuth2Client(
    __GOOGLE_CLIENT_ID__,
    __GOOGLE_CLIENT_SECRET__,
    'http://localhost:3000' // Porta local temporária
  );

  try {
    const googleKeys = await readGoogleTokenUseCase.execute();

    if (googleKeys) {
      client.setCredentials({
        access_token: googleKeys.accessToken,
        refresh_token: googleKeys.refreshToken
      });

      const { token } = await client.getAccessToken().catch((err) => {
        logger.warn(`Falha ao obter/refrescar o access_token: ${err.message}`);
        return { token: null };
      });

      if (token) logger.debug('Google previamente autenticado');
      else logger.debug('Google não autenticado');
    } else {
      logger.debug('Google não autenticado');
    }
  } catch (error) {
    logger.error('Erro ao inicializar credenciais do Google', error);
  }

  return client;
}