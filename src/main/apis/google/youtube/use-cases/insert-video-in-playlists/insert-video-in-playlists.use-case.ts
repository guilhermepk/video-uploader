import { Inject, Injectable } from "@nestjs/common";
import { InsertVideoInPlaylistDto } from "../../models/dtos/insert-video-in-playlist.dto";
import { tryCatch } from "@main/common/utils/try-catch";
import { Auth, youtube_v3 } from "googleapis";
import { FindVideoByIdUseCase } from "../find-video-by-id/find-video-by-id.use-case";
import { FindPlaylistByIdUseCase } from "../find-playlist-by-id/find-playlist-by-id.use-case";

@Injectable()
export class InsertVideoInPlaylistsUseCase {
  constructor(
    @Inject(youtube_v3.Youtube)
    private readonly youtubeClient: youtube_v3.Youtube,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    @Inject(FindVideoByIdUseCase)
    private readonly findVideoByIdUseCase: FindVideoByIdUseCase,

    @Inject(FindPlaylistByIdUseCase)
    private readonly findPlaylistByIdUseCase: FindPlaylistByIdUseCase
  ) { }

  async execute(data: InsertVideoInPlaylistDto) {
    return await tryCatch(async () => {
      const { playlistIds, videoId } = data;

      await this.findVideoByIdUseCase.execute(videoId);

      for (const playlistId of playlistIds) {
        await this.findPlaylistByIdUseCase.execute(playlistId);

        await this.youtubeClient.playlistItems.insert({
          auth: this.oAuth2Client,
          part: ['snippet'],
          requestBody: {
            snippet: {
              playlistId,
              resourceId: {
                kind: 'youtube#video',
                videoId
              }
            }
          }
        });
      }
    }, `Erro ao inserir vídeo em playlist(s)`);
  }
}