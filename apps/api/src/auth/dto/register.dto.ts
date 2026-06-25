import { IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator'

export class RegisterDto {
  @IsString() @MinLength(3) @MaxLength(100)
  fullName: string

  @IsString() @MinLength(10) @MaxLength(15)
  phone: string

  @IsString() @MinLength(8)
  password: string

  @IsOptional() @IsString()
  referralCode?: string
}
