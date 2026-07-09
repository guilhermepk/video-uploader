import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { InternalError } from "@shared/models/errors/internal.error";
import { Auth, youtube_v3 } from "googleapis";
import { FindPlaylistByIdUseCase } from "../find-playlist-by-id/find-playlist-by-id.use-case";

@Injectable()
export class GetPlaylistItemsUseCase {
  constructor(
    @Inject(youtube_v3.Youtube)
    private readonly youtubeClient: youtube_v3.Youtube,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    @Inject(FindPlaylistByIdUseCase)
    private readonly findPlaylistByIdUseCase: FindPlaylistByIdUseCase
  ) { }

  async execute(
    playlist: string | youtube_v3.Schema$Playlist,
    playlistItemCount: number
  ): Promise<Array<youtube_v3.Schema$PlaylistItem>> {
    let playlistId: string = '';

    if (typeof playlist === 'string') {
      playlistId = playlist;
      await this.findPlaylistByIdUseCase.execute(playlist);
    } else {
      if (!playlist.id) throw new InternalError(`Não foi possível obter o ID da playlist. (É necessário correção no código fonte).`)
      else playlistId = playlist.id
    }

    return await tryCatch(async () => {
      const response = await this.youtubeClient.playlistItems.list({
        auth: this.oAuth2Client,
        part: ['snippet'],
        playlistId,
        maxResults: playlistItemCount > 0 ? playlistItemCount : 50,
      });

      return response.data.items ?? [];
    }, `Erro ao buscar itens de playlist`);
  }
}