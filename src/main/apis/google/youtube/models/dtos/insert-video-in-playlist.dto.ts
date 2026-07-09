import { youtube_v3 } from "googleapis";

/** Objeto de Transferência de Dados para o caso de uso de Inserção de Vídeo em Playlist */
export class InsertVideoInPlaylistDto {
  /** Vídeo para inserir na playlist.
   * 
   * Pode ser o ID (string) ou o objeto (contendo o ID) do vídeo caso o mesmo já tenha sido buscado/encontrado.
   * 
   * Se for string será tratado como ID e uma busca para confirmar que um vídeo com esse ID existe será feita.
  */
  video: string | youtube_v3.Schema$Video;

  /** Playlist na qual o vídeo será inserido.
   * 
   * Pode ser o ID (string) ou o objeto (contendo o ID) da playlist caso a mesma já tenha sido buscada/encontrada.
   * 
   * Se for string será tratado como ID e uma busca para confirmar que uma playlist com esse ID existe será feita.
  */
  playlist: string | youtube_v3.Schema$Playlist;
}