import { IsString, MinLength, IsOptional } from 'class-validator'

export class LoginDto {
  @IsString() @MinLength(10)
  phone: string

  @IsString() @MinLength(6)
  password: string

  @IsOptional() @IsString()
  ip?: string
}
