import { ResultItemInCopyPlaylistItemsResponse } from "@shared/models/responses/upload-flows-manager/copy-playlist-items-response";
import { youtube_v3 } from "googleapis";


type Params = {
  originPlaylistId: string,
  destinationPlaylistId: string,
  setFailedVideos: (value: React.SetStateAction<Array<ResultItemInCopyPlaylistItemsResponse>>) => void,
  setOriginPlaylist: (value: React.SetStateAction<youtube_v3.Schema$Playlist | undefined>) => void,
  setDestinationPlaylist: (value: React.SetStateAction<youtube_v3.Schema$Playlist | undefined>) => void,
  setToastSuccessMessage: (newMessage: string) => void
}


export async function copyPlaylistItemsCallback({
  originPlaylistId,
  destinationPlaylistId,
  setFailedVideos,
  setOriginPlaylist,
  setDestinationPlaylist,
  setToastSuccessMessage
}: Params): Promise<void> {
  const response = await window.api.uploadFlowsManager.copyPlaylistItems.execute({
    originPlaylistId,
    destinationPlaylistId,
  });

  if (response.success) {
    const totalVideos: number = response.data.length;
    const totalSuccessfullVideos: number = response.data.reduce((previous, current) => previous += current.success ? 1 : 0, 0)
    const totalErrorVideos: number = response.data.reduce((previous, current) => previous += current.success ? 0 : 1, 0)
    let message: string = '';
    if (totalSuccessfullVideos > 0) message += `\nBem-sucedidos: (${totalSuccessfullVideos}/${totalVideos})`
    if (totalErrorVideos > 0) message += `\nDeram errado: (${totalErrorVideos}/${totalVideos})`;
    setToastSuccessMessage(message);

    setFailedVideos(response.data.filter(item => !item.success));

    setOriginPlaylist(undefined);
    setDestinationPlaylist(undefined);
  } else {
    const { code, message, details } = response.error;
    throw new Error(`${code} | ${message}${details ? ` | ${details.join('; ')}` : ''}`);
  }
}