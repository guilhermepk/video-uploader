import { tryCatch } from '../../../../common/utils/try-catch';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as http from 'http';
import * as url from 'url';
import * as crypto from 'crypto';
import { googleAuthHtmlResponse } from "./google-auth-html-response";
import { Auth } from 'googleapis';
import { BrowserWindow, shell } from 'electron';
import { BadGatewayError } from '../../../../../shared/models/errors/bad-gateway.error';
import { SaveGoogleTokenUseCase } from '@main/secure-data-manager/use-cases/save-google-token/save-google-token.use-case';
import { CodeChallengeMethod } from 'google-auth-library';

@Injectable()
export class StartGoogleAuthUseCase {
  private server: http.Server | null = null;
  private codeVerifier: string = ''
  private codeChallenge: string = ''

  constructor(
    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    @Inject(SaveGoogleTokenUseCase)
    private readonly saveGoogleTokenUseCase: SaveGoogleTokenUseCase
  ) { }

  async execute(): Promise<void> {
    return await tryCatch(async () => {
      const logger = new Logger(StartGoogleAuthUseCase.name);

      try {
        const pkce = this.generatePKCE();

        this.codeVerifier = pkce.codeVerifier;
        this.codeChallenge = pkce.codeChallenge;

        if (!this.server) {
          this.server = http.createServer(async (request, response) => {
            if (request.url) {
              const querySearch = new url.URL(request.url, 'http://localhost:3000').searchParams;
              const code: string | null = querySearch.get('code');

              response.end(googleAuthHtmlResponse);
              this.removeServer();

              if (code) {


                const tokens = await this.oAuth2Client.getToken({
                  code,
                  codeVerifier: this.codeVerifier
                })
                  .then(res => res.tokens)
                  .catch(error => {
                    logger.error(`Erro ao pegar tokens`, error);
                    throw error;
                  });

                logger.log(`code: ${code}`)
                logger.log(`access: ${tokens.access_token}`)
                logger.log(`refresh: ${tokens.refresh_token}`)

                const { access_token: accessToken, refresh_token: refreshToken } = tokens;

                if (accessToken && refreshToken) {
                  this.oAuth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

                  await this.saveGoogleTokenUseCase.execute({ accessToken, refreshToken })

                  const tokenInfo = await this.oAuth2Client.getTokenInfo(accessToken)
                    .catch(() => null);

                  BrowserWindow.getAllWindows().forEach((win) => {
                    win.webContents.send('google-auth-success', { email: tokenInfo?.email ?? null });
                  });

                } else throw new BadGatewayError('Não foi possível obter os tokens de autenticação do Google');
              }
            }
          }).listen(3000);
        }

        const authUrl: string = this.oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          redirect_uri: 'http://localhost:3000',
          scope: [
            'openid',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/youtube'
          ],
          code_challenge: this.codeChallenge,
          code_challenge_method: CodeChallengeMethod.S256
        });

        shell.openExternal(authUrl);
      } catch (error) {
        this.removeServer();
        throw new BadGatewayError(`Falha ao trocar o código de autorização pelo token do Google. ${error}`);
      }
    }, 'Erro ao iniciar autenticação no Google')
  }

  private removeServer(): void {
    if (this.server && this.server.listening) {
      this.server.close();
      this.server = null;
    }
  }

  private base64URLEncode(buffer: Buffer): string {
    return buffer.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private generatePKCE(): { codeVerifier: string, codeChallenge: string } {
    const verifierBuffer = crypto.randomBytes(32);
    const codeVerifier = this.base64URLEncode(verifierBuffer);
    const codeChallenge = this.base64URLEncode(crypto.createHash('sha256').update(codeVerifier).digest());
    return { codeVerifier, codeChallenge };
  }
}
