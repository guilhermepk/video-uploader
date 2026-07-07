import { routes } from "@renderer/common/routes";
import Card from "@renderer/components/Card";
import { Pen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpdateVideosFlowCard(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(routes.updateVideosFlowPage.path)}>
      <Pen />

      <h2> Fluxo de atualização de vídeos </h2>

      <p className="text-justify">
        Faça o upload de uma planilha e mapeie as colunas. Os vídeos serão baixados e renomeados. Após a publicação simples feita manualmente em uma playlist, serão atualizados com as informações completas.
      </p>
    </Card>
  );
}