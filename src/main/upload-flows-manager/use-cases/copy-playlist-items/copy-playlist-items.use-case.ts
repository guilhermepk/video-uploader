import { FindPlaylistByIdUseCase } from "@main/apis/google/youtube/use-cases/find-playlist-by-id/find-playlist-by-id.use-case";
import { GetPlaylistItemsUseCase } from "@main/apis/google/youtube/use-cases/get-playlist-items/get-playlist-items.use-case";
import { InsertVideoInPlaylistsUseCase } from "@main/apis/google/youtube/use-cases/insert-video-in-playlists/insert-video-in-playlists.use-case";
import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { CopyPlaylistItemsDto } from "@shared/models/dtos/upload-flow-manager/copy-playlist-items.dto";
import { InternalError } from "@shared/models/errors/internal.error";
import { CopyPlaylistItemsResponse, ResultItemInCopyPlaylistItemsResponse } from "@shared/models/responses/upload-flows-manager/copy-playlist-items-response";
import { BrowserWindow } from "electron";
import { youtube_v3 } from "googleapis";

@Injectable()
export class CopyPlaylistItemsUseCase {
  constructor(
    @Inject(FindPlaylistByIdUseCase)
    private readonly findPlaylistByIdUseCase: FindPlaylistByIdUseCase,

    @Inject(GetPlaylistItemsUseCase)
    private readonly getPlaylistItemsUseCase: GetPlaylistItemsUseCase,

    @Inject(InsertVideoInPlaylistsUseCase)
    private readonly insertVideoInPlaylistsUseCase: InsertVideoInPlaylistsUseCase
  ) { }

  async execute(data: CopyPlaylistItemsDto): Promise<CopyPlaylistItemsResponse> {
    return await tryCatch(async () => {
      const { originPlaylistId, destinationPlaylistId } = data;

      const originPlaylist: youtube_v3.Schema$Playlist = await this.findPlaylistByIdUseCase.execute(originPlaylistId);
      // const destinationPlaylist: youtube_v3.Schema$Playlist = await this.findPlaylistByIdUseCase.execute(destinationPlaylistId);

      if (!originPlaylist.contentDetails?.itemCount) {
        const playlistTitle: string = originPlaylist.snippet?.title ? `"${originPlaylist.snippet?.title}"` : '';
        throw new InternalError(`Não foi possível obter a quantidade de itens da playlist de origem${playlistTitle}. (É necessário correção no código fonte).`);
      }

      const originPlaylistItens: Array<youtube_v3.Schema$PlaylistItem> = await this.getPlaylistItemsUseCase.execute(originPlaylist, originPlaylist.contentDetails?.itemCount);

      const results: CopyPlaylistItemsResponse = [];

      for (const playlistItem of originPlaylistItens) {
        const { videoId } = playlistItem.contentDetails ?? {};

        if (!videoId) {
          const playlistTitle: string = originPlaylist.snippet?.title ? ` "${originPlaylist.snippet?.title}"` : '';
          throw new InternalError(`Não foi possível obter o ID dos vídeos da playlist de origem${playlistTitle}. (É necessário correção no código fonte).`)
        }

        try {
          const response = await this.insertVideoInPlaylistsUseCase.execute({
            video: videoId,
            playlist: destinationPlaylistId
          });

          const result: ResultItemInCopyPlaylistItemsResponse = { videoId, success: response.success };
          this.emitResult(result);
          results.push(result);
        } catch (error: any) {
          const result: ResultItemInCopyPlaylistItemsResponse = { videoId, success: false, error: error.message ?? String(error) };
          this.emitResult(result);
          results.push(result);
        }
      }

      return results;
    }, `Erro ao copiar playlist`);
  }


  private emitResult(
    result: ResultItemInCopyPlaylistItemsResponse
  ) {
    this.emit(`${CopyPlaylistItemsUseCase.name}/result-item`, result)
  }


  private emit(channel: string, payload: any): void {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send(channel, payload);
    });
  }
}