import { Module } from "@nestjs/common";
import { Auth, google, youtube_v3 } from "googleapis";
import { PublishVideoUseCase } from "./use-cases/publish-video/publish-video.use-case";
import { GoogleModule } from "../google.module";
import { GetPlaylistsUseCase } from "./use-cases/get-playlists/get-playlists.use-case";
import { GetPlaylistItemsUseCase } from "./use-cases/get-playlist-items/get-playlist-items.use-case";
import { UpdateVideoUseCase } from "./use-cases/update-video/update-video.use-case";
import { FindVideoByIdUseCase } from "./use-cases/find-video-by-id/find-video-by-id.use-case";
import { InsertVideoInPlaylistsUseCase } from "./use-cases/insert-video-in-playlists/insert-video-in-playlists.use-case";
import { FindPlaylistByIdUseCase } from "./use-cases/find-playlist-by-id/find-playlist-by-id.use-case";

@Module({
  imports: [
    GoogleModule
  ],
  providers: [
    {
      provide: youtube_v3.Youtube,
      useFactory: (oAuth2Client: Auth.OAuth2Client) => google.youtube({ version: 'v3', auth: oAuth2Client }),
      inject: [Auth.OAuth2Client]
    },
    PublishVideoUseCase,
    GetPlaylistsUseCase,
    GetPlaylistItemsUseCase,
    UpdateVideoUseCase,
    FindVideoByIdUseCase,
    InsertVideoInPlaylistsUseCase,
    FindPlaylistByIdUseCase
  ],
  exports: [
    UpdateVideoUseCase,
    GetPlaylistItemsUseCase,
    InsertVideoInPlaylistsUseCase,
    FindPlaylistByIdUseCase
  ]
})
export class YoutubeModule { }