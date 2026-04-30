import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;                   

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password!: string;              

  @IsString()
  @IsNotEmpty()
  firstName!: string;              

  @IsString()
  @IsNotEmpty()
  lastName!: string;                

  @IsOptional()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(['MALE', 'FEMALE'])
  gender?: 'MALE' | 'FEMALE';

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(['SEDENTARY', 'PHYSICALLY_ACTIVE'])
  occupation?: 'SEDENTARY' | 'PHYSICALLY_ACTIVE';
}