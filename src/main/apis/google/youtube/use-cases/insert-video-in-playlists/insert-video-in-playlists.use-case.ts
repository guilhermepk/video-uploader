import { Inject, Injectable } from "@nestjs/common";
import { InsertVideoInPlaylistDto } from "../../models/dtos/insert-video-in-playlist.dto";
import { tryCatch } from "@main/common/utils/try-catch";
import { Auth, youtube_v3 } from "googleapis";
import { InternalError } from "@shared/models/errors/internal.error";
import { googleApiResilience } from "@main/apis/google/utils/google-api-resilience";
// import { FindVideoByIdUseCase } from "../find-video-by-id/find-video-by-id.use-case";
// import { FindPlaylistByIdUseCase } from "../find-playlist-by-id/find-playlist-by-id.use-case";

@Injectable()
export class InsertVideoInPlaylistsUseCase {
  constructor(
    @Inject(youtube_v3.Youtube)
    private readonly youtubeClient: youtube_v3.Youtube,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    // @Inject(FindVideoByIdUseCase)
    // private readonly findVideoByIdUseCase: FindVideoByIdUseCase,

    // @Inject(FindPlaylistByIdUseCase)
    // private readonly findPlaylistByIdUseCase: FindPlaylistByIdUseCase
  ) { }

  async execute(data: InsertVideoInPlaylistDto): Promise<{ success: boolean }> {
    let videoTitle: string | null = null;
    let playlistTitle: string | null = null;

    return await tryCatch(async () => {
      let videoId: string | null = null;
      // let video: youtube_v3.Schema$Video;

      if (typeof data.video == 'string') {
        videoId = data.video;
        // video = await this.findVideoByIdUseCase.execute(data.video);
      } else {
        videoId = data.video.id ?? null;
        // video = data.video;
      }

      if (!videoId) throw new InternalError(`É necessário o ID dO vídeo para inserir um vídeo em uma playlist. (Necessário correção no código fonte).`)

      // videoTitle = video.snippet?.title ?? null;

      let playlistId: string | null = null;
      // let playlist: youtube_v3.Schema$Playlist;

      if (typeof data.playlist == 'string') {
        playlistId = data.playlist;
        // playlist = await this.findPlaylistByIdUseCase.execute(playlistId);
      } else {
        playlistId = data.playlist.id ?? null;
        // playlist = data.playlist;
      }

      if (!playlistId) throw new InternalError(`É necessário o ID da playlist para inserir um vídeo. (Necessário correção no código fonte).`)

      // playlistTitle = playlist.snippet?.title ?? null;

      return await googleApiResilience(async () => {
        const response = await this.youtubeClient.playlistItems.insert({
          auth: this.oAuth2Client,
          part: ['snippet'],
          requestBody: {
            snippet: {
              playlistId,
              resourceId: {
                kind: 'youtube#video',
                videoId: videoId
              }
            }
          }
        });

        return { success: response.ok };
      }, { actionName: 'Inserção de vídeo em playlist' });
    }, `Erro ao inserir vídeo${videoTitle ? ` "${videoTitle}"` : ''} na playlist${playlistTitle ? ` "${playlistTitle}"` : ''}`);
  }
}