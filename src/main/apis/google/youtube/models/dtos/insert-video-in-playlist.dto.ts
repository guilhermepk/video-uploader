import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";

export class InsertVideoInPlaylistDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  playlistIds: Array<string>;

  @IsString()
  @IsNotEmpty()
  videoId: string;
}