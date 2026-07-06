import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Auth, youtube_v3 } from "googleapis";
import { UpdateVideoDto } from "../../models/dtos/update-video.dto";
import { FindVideoByIdUseCase } from "../find-video-by-id/find-video-by-id.use-case";

// Função simples para aguardar em caso de falha
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Injectable()
export class UpdateVideoUseCase {
  logger = new Logger(UpdateVideoUseCase.name)

  constructor(
    @Inject(youtube_v3.Youtube)
    private readonly youtubeClient: youtube_v3.Youtube,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    @Inject(FindVideoByIdUseCase)
    private readonly findVideoByIdUseCase: FindVideoByIdUseCase,
  ) { }

  async execute(data: UpdateVideoDto): Promise<youtube_v3.Schema$Video> {
    return await tryCatch(async () => {
      const { id, title, description } = data;
      let retries = 3;

      while (retries > 0) {
        try {
          const foundVideo = await this.findVideoByIdUseCase.execute(id);

          const updatedSnippet = {
            ...foundVideo.snippet,
            title: title ?? foundVideo.snippet?.title ?? '',
            description,
            categoryId: foundVideo.snippet?.categoryId ?? '22',
          };

          const updateResponse = await this.youtubeClient.videos.update({
            auth: this.oAuth2Client,
            part: ['snippet'],
            requestBody: {
              id,
              snippet: updatedSnippet,
            }
          });

          if (!updateResponse.data) {
            throw new Error(`A API do YouTube não retornou dados após atualizar o vídeo ${id}`);
          }

          return updateResponse.data;

        } catch (error: any) {
          retries--;

          if ((error.code === 409 || error.code === 403 || error.code === 429) && retries > 0) {
            this.logger.warn(`[YouTube API] Conflito ao atualizar vídeo ${id}. Tentando novamente...`);
            await sleep(3000);
            continue;
          }

          throw error;
        }
      }

      throw new Error(`Não foi possível atualizar o vídeo ${id} após o número máximo de tentativas.`);
    }, `Erro ao editar vídeo`);
  }
}