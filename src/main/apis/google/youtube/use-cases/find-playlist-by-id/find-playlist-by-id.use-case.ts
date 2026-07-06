import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "@shared/models/errors/not-found.error";
import { Auth, youtube_v3 } from "googleapis";

@Injectable()
export class FindPlaylistByIdUseCase {
  constructor(
    @Inject(youtube_v3.Youtube)
    private readonly youtubeClient: youtube_v3.Youtube,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,
  ) { }

  async execute(playlistId: string): Promise<youtube_v3.Schema$Playlist> {
    return await tryCatch(async () => {
      const response = await this.youtubeClient.playlists.list({
        auth: this.oAuth2Client,
        part: ['snippet'],
        id: [playlistId]
      });

      const playlist = response.data.items?.[0];

      if (!playlist) throw new NotFoundError(`Nenhuma playlist encontrada com o ID "${playlistId}"`)

      return playlist;
    }, `Erro ao buscar playlist por ID "${playlistId}"`);
  }
}