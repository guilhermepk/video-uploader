import { Module, OnApplicationBootstrap } from "@nestjs/common";
import { UpdateVideosUseCase } from "./use-cases/update-videos/update-videos.use-case";
import { FileManagerModule } from "@main/file-manager/file-manager.module";
import { YoutubeModule } from "@main/apis/google/youtube/youtube.module";
// import { GetFileUseCase } from "@main/file-manager/use-cases/get-file/get-file.use-case";
import { DownloadAndRenameUseCase } from "./use-cases/download-and-rename/download-and-rename.use-case";
import { CopyPlaylistItemsUseCase } from "./use-cases/copy-playlist-items/copy-playlist-items.use-case";

@Module({
  imports: [
    FileManagerModule,
    YoutubeModule
  ],
  providers: [
    UpdateVideosUseCase,
    DownloadAndRenameUseCase,
    CopyPlaylistItemsUseCase
  ]
})
export class UploadFlowsManagerModule implements OnApplicationBootstrap {
  // logger = new Logger(UploadFlowsManagerModule.name);

  // constructor(
  //   @Inject(UpdateVideosUseCase)
  //   private readonly uploadFlow2UseCase: UpdateVideosUseCase,

  //   @Inject(DownloadAndRenameUseCase)
  //   private readonly downloadAndRenameUseCase: DownloadAndRenameUseCase,

  //   @Inject(GetFileUseCase)
  //   private readonly getFileUseCase: GetFileUseCase
  // ) { }

  async onApplicationBootstrap() {
    // try {
    //   const filePath = `C:\\Users\\Guilherme\\Downloads\\teste.xlsx`;
    //   const file: File | null = await this.getFileUseCase.execute(filePath);

    //   if (!file) throw new Error(`Erro ao obter o arquivo "${filePath}". O arquivo realmente existe?`);

    //     const response = await this.uploadFlow2UseCase.execute({
    //       sheetData: {
    //         file,
    //         personFirstNameColunmIndex: 0,
    //         personLastNameColunmIndex: 1,
    //         personSectorColumnIndex: 2,
    //         descriptionColunmIndex: 3,
    //       },
    //       playlist: {
    //         id: 'PLHvogOXMIOMU58YqADqXMKk-XSnEoIF68',
    //         name: 'Playlist de teste',
    //         itemCount: 2
    //       }
    //     });

    //   const response = await this.downloadAndRenameUseCase.execute({
    //     destinationFolderPath: 'C:\\Users\\Guilherme\\Downloads\\testecriacao',
    //     sheet: {
    //       file,
    //       personFirstNameColumnIndex: 0,
    //       personLastNameColumnIndex: 1,
    //       personSectorColumnIndex: 2,
    //       urlColumnIndex: 4
    //     }
    //   });

    //   this.logger.debug('\n' + response.results.map(item => `${item.rowIndex} - ${item.success} - ${item.error}`).join('\n'));
    // } catch (error: any) {
    //   this.logger.error(error.message ?? error, error);
    // }
  }
}