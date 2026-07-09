import { Module } from '@nestjs/common';
import { Auth } from 'googleapis';
import { SecureDataManagerModule } from '../../secure-data-manager/secure-data-manager.module';
import { ReadGoogleTokenUseCase } from '@main/secure-data-manager/use-cases/read-google-token/read-google-token.use-case';
import { StartGoogleAuthUseCase } from './use-cases/start-auth/start-google-auth.use-case';
import { googleAuthFactory } from './utils/google-auth.factory';
import { GetGoogleUserDataUseCase } from './use-cases/get-user-data/get-google-user-data.use-case';
import { GoogleLogoutUseCase } from './use-cases/logout/google-logout.use-case';

@Module({
  imports: [
    SecureDataManagerModule,
  ],
  providers: [
    {
      provide: Auth.OAuth2Client,
      useFactory: googleAuthFactory,
      inject: [ReadGoogleTokenUseCase]
    },
    StartGoogleAuthUseCase,
    GetGoogleUserDataUseCase,
    GoogleLogoutUseCase
  ],
  exports: [
    Auth.OAuth2Client
  ]
})
export class GoogleModule { }