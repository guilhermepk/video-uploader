import BackButton from "@renderer/components/BackButton";
import Page from "@renderer/components/Page";
import { StepItem, Stepper } from "@renderer/components/Stepper";
import { useState } from "react";
import * as XLSX from 'xlsx';
import SheetUploadStep from "./components/SheetUploadStep";
import ColumnMappingStep from "./components/ColumnMappingStep";
import { ColumnData, useUpdateVideosFlow } from "@renderer/contexts/UpdateVideosFlowContext";
import DownloadStep from "./components/DownloadStep";
import SelectPlaylistStep from "./components/SelectPlaylistStep";
import UpdateVideosStep from "./components/UpdateVideosStep";
import { useNavigate } from "react-router-dom";
import { routes } from "@renderer/common/routes";
import toast from 'react-hot-toast';
import { showConfirmModal } from "@renderer/components/ConfirmModal";


export default function UpdateVideosFlowPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { flowData, updateFlowData } = useUpdateVideosFlow();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const extractHeadersFromFile = async (fileToRead: File) => {
    const data = await fileToRead.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][];

    if (jsonData.length > 0) {
      const extractedHeaders: Array<ColumnData> = jsonData[0].map((header, index) => ({ header, index }));
      updateFlowData({ extractedHeaders });
    }
  };

  function isSheetUploadValid(): boolean {
    const { sheet, sheetPath } = flowData;

    if (!sheet) {
      toast('Envie um arquivo antes de prosseguir');
      return false;
    }

    if (!sheetPath) {
      toast('O caminho para o arquivo enviado não foi definido');
      return false;
    }

    extractHeadersFromFile(sheet);
    return true;
  }

  function isMappingValid(): boolean {
    const { firstNameColumn, sectorColumn, urlColumn } = flowData;

    if (!firstNameColumn || !sectorColumn || !urlColumn) {
      const fields: Array<{ name: string, value: any }> = [
        { name: 'Nome', value: firstNameColumn },
        { name: 'Setor', value: sectorColumn },
        { name: 'URL', value: urlColumn },
      ];
      const missing = fields.filter(item => !item.value);

      toast(`Mapeie todas as colunas antes de prosseguir. Campos faltando:\n\n${missing.map((item, index) => `${index + 1} - "${item.name}"`).join(';\n')}`);
      return false;
    }
    return true;
  }

  function isDownloadCompleted(): boolean {
    const { downloadFolderPath, downloadsCompleted } = flowData;
    if (!downloadFolderPath) {
      toast('Selecione a pasta de destino de download dos vídeos');
      return false;
    }

    if (!downloadsCompleted) {
      toast('O download ainda não terminou');
      return false;
    }

    return true;
  }

  function verifyIsPlaylistIsSelected(): boolean {
    const { playlist } = flowData;
    if (!playlist) {
      toast('Selecione a playlist em que os vídeos foram manualmente cadastrados');
      return false;
    } else return true;
  }

  async function confirmPlaylistSelection(): Promise<boolean> {
    return await new Promise((resolve, _reject) => {
      showConfirmModal({
        title: 'Já publicou os vídeos?',
        message: 'Antes de selecionar a playlist, você precisa ter publicado os vídeos no youtube manualmente e colocado eles na playlist.',
        onConfirm: () => {
          resolve(true);
        },
        onCancel: () => {
          toast('Seleção cancelada', { duration: 2 });
          resolve(false);
        },
      });
    })
  }

  async function validatePlaylist(): Promise<boolean> {
    const isPlaylistSelected: boolean = verifyIsPlaylistIsSelected();

    if (isPlaylistSelected) {
      const playlistSelectionConfirmed: boolean = await confirmPlaylistSelection();
      return isPlaylistSelected && playlistSelectionConfirmed;
    } else return false;
  }

  const steps: Array<StepItem & { canMoveToNextStep?: (() => boolean) | (() => Promise<boolean>) }> = [
    {
      title: "Upload da planilha",
      content: <SheetUploadStep />,
      canMoveToNextStep: isSheetUploadValid
    },
    {
      title: "Mapear colunas",
      content: <ColumnMappingStep />,
      canMoveToNextStep: isMappingValid
    },
    {
      title: "Download automático",
      content: <DownloadStep />,
      canMoveToNextStep: isDownloadCompleted
    },
    {
      title: "Selecionar playlist",
      content: <SelectPlaylistStep />,
      canMoveToNextStep: validatePlaylist
    },
    {
      title: "Atualização automática",
      content: <UpdateVideosStep />
    },
  ];

  async function nextStep(): Promise<void> {
    const currentStep = steps[currentStepIndex];
    const currentStepAllows: boolean = currentStep.canMoveToNextStep ? await currentStep.canMoveToNextStep() : true;

    if (currentStepIndex < (steps.length - 1) && currentStepAllows) setCurrentStepIndex((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStepIndex > 0) setCurrentStepIndex((prev) => prev - 1);
  };

  return (
    <Page className="p-0!">

      <div className="w-[80%] bottom-[10px]">
        <Stepper
          steps={steps}
          currentStepIndex={currentStepIndex}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onFinish={() => navigate(routes.homePage.path)}
        />
      </div>
    </Page>
  );
}