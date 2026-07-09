import { IsNotEmpty, IsString } from "class-validator";

export class CopyPlaylistItemsDto {
  @IsNotEmpty()
  @IsString()
  originPlaylistId: string;

  @IsNotEmpty()
  @IsString()
  destinationPlaylistId: string;
}