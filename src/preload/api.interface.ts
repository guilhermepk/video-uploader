import { CopyPlaylistItemsDto } from "@shared/models/dtos/upload-flow-manager/copy-playlist-items.dto"
import { DownloadAndRenameDto } from "@shared/models/dtos/upload-flow-manager/download-and-rename.dto"
import { UpdateVideosDto } from "@shared/models/dtos/upload-flow-manager/update-videos.dto"
import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface"
import { GetGoogleUserDataResponse } from "@shared/models/responses/google/get-google-user-data.response"
import { GetPlaylistsResponse } from "@shared/models/responses/google/youtube/get-playlists.response"
import { SubscriptionResponse } from "@shared/models/responses/subscription.response"
import { CopyPlaylistItemsResponse, ResultItemInCopyPlaylistItemsResponse } from "@shared/models/responses/upload-flows-manager/copy-playlist-items-response"
import { DownloadAndRenameResponse } from "@shared/models/responses/upload-flows-manager/download-and-rename.response"
import { UpdateVideosResponse } from "@shared/models/responses/upload-flows-manager/update-videos.response"
import { DownloadProgresSubscriptionPayload } from "@shared/models/subscription-payloads/download-progress.subscription-payload"
import { TotalRowsSubscriptionPayload } from "@shared/models/subscription-payloads/total-rows.subscription-payload"

export interface ContextBridgeApi {
  google: {
    startAuth: () => Promise<IpcResponse<null>>,
    getUserData: () => Promise<IpcResponse<GetGoogleUserDataResponse>>,
    onAuthSuccess: (callback: (payload: { email: string | null }) => void) => (() => void),
    logout: () => Promise<IpcResponse<void>>;
    youtube: {
      getPlaylists: () => Promise<IpcResponse<GetPlaylistsResponse>>
    }
  },
  fileManager: {
    dialogSelecFolder: () => Promise<IpcResponse<{ folderPath: string | null }>>,
    getFilePath: (file: File) => string
  },
  uploadFlowsManager: {
    downloadAndRename: (payload: DownloadAndRenameDto) => Promise<IpcResponse<DownloadAndRenameResponse>>,
    onDownloadProgress: (callback: (payload: DownloadProgresSubscriptionPayload) => void) => SubscriptionResponse
    onTotalRows: (callback: (payload: TotalRowsSubscriptionPayload) => void) => SubscriptionResponse,
    updateVideos: (payload: UpdateVideosDto) => Promise<IpcResponse<UpdateVideosResponse>>,
    copyPlaylistItems: {
      execute: (payload: CopyPlaylistItemsDto) => Promise<IpcResponse<CopyPlaylistItemsResponse>>,
      onResult: (callback: (payload: ResultItemInCopyPlaylistItemsResponse) => void) => SubscriptionResponse
    }
  },
}