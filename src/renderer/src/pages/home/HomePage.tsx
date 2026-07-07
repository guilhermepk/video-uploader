import Page from "@renderer/components/Page";
import UpdateVideosFlowCard from "./components/UpdateVideosFlowCard";
import CopyPlaylistCard from "./components/CopyPlaylistCard";
// import FullFlowCard from "./components/FullFlowCard";

export default function HomePage(): React.JSX.Element {
  return (
    <Page>
      <h1> Bem-vindo ao Workspace </h1>

      <div
        className="flex items-stretch justify-center gap-8"
      >
        {/* <FullFlowCard /> */}
        <UpdateVideosFlowCard />

        <CopyPlaylistCard />
      </div>
    </Page>
  );
}