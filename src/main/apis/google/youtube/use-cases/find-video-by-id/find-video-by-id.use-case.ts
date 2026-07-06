import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "@shared/models/errors/not-found.error";
import { Auth, youtube_v3 } from "googleapis";

@Injectable()
export class FindVideoByIdUseCase {
  constructor(
    @Inject(youtube_v3.Youtube)
    private readonly youtubeClient: youtube_v3.Youtube,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,
  ) { }

  async execute(videoId: string): Promise<youtube_v3.Schema$Video> {
    return await tryCatch(async () => {
      const response = await this.youtubeClient.videos.list({
        auth: this.oAuth2Client,
        part: ['snippet'],
        id: [videoId]
      });

      const video = response.data.items?.[0];

      if (!video) throw new NotFoundError(`Nenhum vídeo encontrado com o ID "${videoId}"`)

      return video;
    }, `Erro ao buscar vídeo por ID "${videoId}"`)
  }
}