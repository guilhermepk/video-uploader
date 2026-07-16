export type ResultItemInCopyPlaylistItemsResponse = {
  videoId: string,
  success: boolean,
  error?: string
}

export type CopyPlaylistItemsResponse = Array<ResultItemInCopyPlaylistItemsResponse>