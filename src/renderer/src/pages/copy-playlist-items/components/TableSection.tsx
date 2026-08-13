import { routes } from "@renderer/common/routes";
import Button from "@renderer/components/Button";
import Table from "@renderer/components/Table";
import { ResultItemInCopyPlaylistItemsResponse } from "@shared/models/responses/upload-flows-manager/copy-playlist-items-response";
import { useNavigate } from "react-router-dom";

interface TableSectionProps {
  results: Array<ResultItemInCopyPlaylistItemsResponse>
  // results: Array<any>
}


export default function TableSection({
  results
}: TableSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col items-center justify-center gap-4 select-text">
      <Table
        headers={['URL', 'Status']}
        rows={results.map(item => {
          return [
            { value: <p>{`https://www.youtube.com/watch?v=${item.videoId}`}</p> },
            {
              className: `${item.success ? 'text-[rgb(50,255,50)]' : 'text-[red]'}`,
              value: <p>{item.success ? 'Sucesso' : `Erro: ${item.error ?? 'indefinido'}`}</p>
            }
          ]
        })}
      />

      <Button
        onClick={() => navigate(routes.homePage.path)}
      >
        Voltar à página inicial
      </Button>
    </div>
  );
}