import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { InternalError } from "@shared/models/errors/internal.error";
import { Auth, youtube_v3 } from "googleapis";
// import { FindPlaylistByIdUseCase } from "../find-playlist-by-id/find-playlist-by-id.use-case";
import { googleApiResilience } from "@main/apis/google/utils/google-api-resilience";

@Injectable()
export class GetPlaylistItemsUseCase {
  constructor(
    @Inject(youtube_v3.Youtube)
    private readonly youtubeClient: youtube_v3.Youtube,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    // @Inject(FindPlaylistByIdUseCase)
    // private readonly findPlaylistByIdUseCase: FindPlaylistByIdUseCase
  ) { }

  async execute(
    playlist: string | youtube_v3.Schema$Playlist,
    playlistItemCount: number
  ): Promise<Array<youtube_v3.Schema$PlaylistItem>> {
    return await tryCatch(async () => {
      let playlistId: string = '';

      if (typeof playlist === 'string') {
        playlistId = playlist;
        // await this.findPlaylistByIdUseCase.execute(playlist);
      } else {
        if (!playlist.id) throw new InternalError(`Não foi possível obter o ID da playlist. (É necessário correção no código fonte).`);
        else playlistId = playlist.id;
      }

      const allItems: youtube_v3.Schema$PlaylistItem[] = [];
      let nextPageToken: string | undefined | null = undefined;
      const targetCount = playlistItemCount > 0 ? playlistItemCount : 50;

      do {
        const itemsToFetch = Math.min(50, targetCount - allItems.length);

        const response = await googleApiResilience(async () => {
          return await this.youtubeClient.playlistItems.list({
            auth: this.oAuth2Client,
            part: ['snippet', 'contentDetails'],
            playlistId,
            maxResults: itemsToFetch,
            pageToken: nextPageToken ?? undefined
          });
        }, { actionName: 'Busca de itens de playlist' });

        const items = response.data.items ?? [];
        allItems.push(...items);

        // Atualiza o token para a próxima página. Se não vier, é porque a playlist acabou.
        nextPageToken = response.data.nextPageToken;

      } while (nextPageToken && allItems.length < targetCount);

      return allItems;
    }, `Erro ao buscar itens de playlist`);
  }
}