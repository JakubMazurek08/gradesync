import {Expose} from "class-transformer";
import {IsNotEmpty, IsString, MinLength, IsEmail} from "class-validator";

export class RegisterDto{
    @IsString({
        message:"Has to be string",
    })
    @IsNotEmpty({
        message: "Field required",
    })
    @MinLength(4, {
        message:"Login must be at least 4 characters",
    })
    @Expose()
    login !: string;


    @IsString({
        message:"Has to be string",
    })
    @IsNotEmpty({
        message: "Field required",
    })
    @MinLength(6, {
        message:"Password must be at least 6 characters",
    })
    @Expose()
    password !: string;


    @IsString({
        message:"Has to be string",
    })
    @IsEmail()
    @IsNotEmpty({
        message: "Field required",
    })
    @Expose()
    email !: string;


    @IsString({
        message:"Has to be string",
    })
    @IsNotEmpty({
        message: "Field required",
    })
    @Expose()
    fullName !: string;
}