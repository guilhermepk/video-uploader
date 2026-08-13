import { youtube_v3 } from "googleapis";
import toast from "react-hot-toast";

type Response = null | {
  originPlaylistId: string,
  destinationPlaylistId: string
};


export function validateFields(
  originPlaylist: youtube_v3.Schema$Playlist | undefined,
  destinationPlaylist: youtube_v3.Schema$Playlist | undefined,
): Response {
  if (!originPlaylist || !destinationPlaylist) {
    const emptyFields: string[] = [];
    if (!originPlaylist) emptyFields.push('A playlist de origem');
    if (!destinationPlaylist) emptyFields.push('A playlist de destino');
    toast(`Selecione: ${emptyFields.map(item => `"${item}"`).join('; ')}`);
    return null;
  }

  if (!originPlaylist.id || !destinationPlaylist.id) {
    const missingIds: string[] = [];
    if (!originPlaylist.id) missingIds.push('Playlist de origem');
    if (!destinationPlaylist.id) missingIds.push('Playlist de destino');
    toast(`Não foi possível obter o ID de: ${missingIds.map(item => `"${item}"`).join('; ')}\n(É necessário correção no código fonte)`);
    return null;
  }

  return { originPlaylistId: originPlaylist.id, destinationPlaylistId: destinationPlaylist.id }
}