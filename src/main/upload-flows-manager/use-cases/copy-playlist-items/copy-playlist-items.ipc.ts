import { CopyPlaylistItemsDto } from "@shared/models/dtos/upload-flow-manager/copy-playlist-items.dto";
import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { CopyPlaylistItemsUseCase } from "./copy-playlist-items.use-case";
import createIpcHandler from "@main/common/utils/create-ipc-handler";
import { CopyPlaylistItemsResponse } from "@shared/models/responses/upload-flows-manager/copy-playlist-items-response";

export function registerCopyPlaylistItemsIpc(): void {
  async function handler(
    payload: CopyPlaylistItemsDto,
    useCase: CopyPlaylistItemsUseCase
  ): Promise<IpcResponse<CopyPlaylistItemsResponse>> {
    return {
      success: true,
      data: await useCase.execute(payload)
    }
  }

  createIpcHandler(
    'upload-flows/copy-playlist-items',
    handler,
    {
      dtoClass: CopyPlaylistItemsDto,
      useCaseClass: CopyPlaylistItemsUseCase,
    }
  )
}