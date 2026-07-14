import { googleApiResilience } from "@main/apis/google/utils/google-api-resilience";
import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { GetPlaylistsResponse } from "@shared/models/responses/google/youtube/get-playlists.response";
import { Auth, youtube_v3 } from "googleapis";

@Injectable()
export class GetPlaylistsUseCase {
  constructor(
    @Inject(youtube_v3.Youtube)
    private readonly youtubeClient: youtube_v3.Youtube,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,
  ) { }

  async execute(): Promise<GetPlaylistsResponse> {
    return await tryCatch(async () => {
      return await googleApiResilience(async () => {
        const response = await this.youtubeClient.playlists.list({
          auth: this.oAuth2Client,
          part: ['snippet', 'contentDetails'],
          mine: true,
          maxResults: 50
        });

        return {
          nextPageToken: response.data.nextPageToken ?? null,
          playlists: response.data.items ?? []
        }
      }, { actionName: 'Busca de playlists' });
    }, `Erro ao buscar playlists no YouTube`);
  }
}