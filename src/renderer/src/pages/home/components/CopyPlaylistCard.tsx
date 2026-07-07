import { routes } from "@renderer/common/routes";
import Card from "@renderer/components/Card";
import { CopyPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CopyPlaylistCard(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(routes.copyPlaylistPage.path)}>
      <CopyPlus />

      <h2> Copiar playlist </h2>

      <p className="text-justify">
        Selecione uma playlist de origem e uma de destino. Todos os vídeos da playlist de origem serão adicionados à playlist de destino. (Não remove vídeos de nenhuma das playlists).
      </p>
    </Card>
  );
}