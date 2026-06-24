import { IsEmail, IsString, MinLength, MaxLength, IsDateString, IsOptional, Matches } from 'class-validator'

export class RegisterDto {
  @IsString() @MinLength(3) @MaxLength(100)
  fullName: string

  @IsEmail()
  email: string

  @IsString() @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, { message: 'CPF inválido' })
  cpf: string

  @IsString() @MinLength(10) @MaxLength(15)
  phone: string

  @IsDateString()
  birthDate: string

  @IsString() @MinLength(8)
  password: string

  @IsOptional() @IsString()
  referralCode?: string
}
