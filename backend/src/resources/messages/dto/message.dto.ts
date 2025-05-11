import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateConversationDto {
    @IsString()
    @IsOptional()
    title !: string;

    @IsNumber()
    @IsNotEmpty()
    studentId !: number;
}

export class SendMessageDto {
    @IsString()
    @IsNotEmpty()
    content !: string;

    @IsNumber()
    @IsNotEmpty()
    conversationId !: number;
}