import { IsString } from 'class-validator';

export class ProjectDTO {
  @IsString()
  name: string;
}
