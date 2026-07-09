import { routes } from "@renderer/common/routes";
import Button from "@renderer/components/Button";
import Page from "@renderer/components/Page";
import { HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Page>
      <h1> Parece que você se perdeu! </h1>

      <Button
        onClick={() => navigate(routes.homePage.path)}
        className="flex items-center justify-center gap-4"
      >
        <HomeIcon />
        <p> Voltar para a página inicial </p>
      </Button>
    </Page>
  );
}