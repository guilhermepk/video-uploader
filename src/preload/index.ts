import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ContextBridgeApi } from './api.interface'
import { IpcResponse } from '@shared/models/interfaces/ipc-response.interface'
import { GetGoogleUserDataResponse } from '@shared/models/responses/google/get-google-user-data.response'
import { GetPlaylistsResponse } from '@shared/models/responses/google/youtube/get-playlists.response'
import { DownloadAndRenameResponse } from '@shared/models/responses/upload-flows-manager/download-and-rename.response'
import { DownloadAndRenameDto } from '@shared/models/dtos/upload-flow-manager/download-and-rename.dto'
import { DownloadAndRenameUseCase } from '@main/upload-flows-manager/use-cases/download-and-rename/download-and-rename.use-case'
import { subscribe } from './utils/subscribe.util'
import { CopyPlaylistItemsDto } from '@shared/models/dtos/upload-flow-manager/copy-playlist-items.dto'
import { CopyPlaylistItemsUseCase } from '@main/upload-flows-manager/use-cases/copy-playlist-items/copy-playlist-items.use-case'

const api: ContextBridgeApi = {
  google: {
    startAuth: (): Promise<IpcResponse<null>> => ipcRenderer.invoke('google/start-auth'),
    getUserData: (): Promise<IpcResponse<GetGoogleUserDataResponse>> => ipcRenderer.invoke('google/get-user-data'),
    onAuthSuccess(callback: (payload: { email: string }) => void) {
      const subscription = (_event: Electron.IpcRendererEvent, payload: { email: string }) => callback(payload);
      ipcRenderer.on('google-auth-success', subscription);
      return () => ipcRenderer.removeListener('google-auth-success', subscription);
    },
    logout: (): Promise<IpcResponse<void>> => ipcRenderer.invoke('google/logout'),
    youtube: {
      getPlaylists: (): Promise<IpcResponse<GetPlaylistsResponse>> => ipcRenderer.invoke('google/youtube/get-playlists')
    }
  },
  fileManager: {
    dialogSelecFolder: (): Promise<IpcResponse<{ folderPath: string | null }>> => ipcRenderer.invoke('file-manager/dialog-select-folder'),
    getFilePath: (file: File): string => webUtils.getPathForFile(file)
  },
  uploadFlowsManager: {
    downloadAndRename: (payload: DownloadAndRenameDto): Promise<IpcResponse<DownloadAndRenameResponse>> => ipcRenderer.invoke('upload-flows/download-and-rename', payload),
    onDownloadProgress: (callback) => subscribe(`${DownloadAndRenameUseCase.name}/progress`, callback),
    onTotalRows: (callback) => subscribe(`${DownloadAndRenameUseCase.name}/total-rows`, callback),
    updateVideos: (payload) => ipcRenderer.invoke('upload-flows/update-videos', payload),
    copyPlaylistItems: {
      execute: (payload: CopyPlaylistItemsDto) => ipcRenderer.invoke('upload-flows/copy-playlist-items', payload),
      onResult: (callback) => subscribe(`${CopyPlaylistItemsUseCase.name}/result-item`, callback),
    }
  },
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
