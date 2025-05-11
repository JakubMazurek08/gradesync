import {Expose} from "class-transformer";
import {IsNotEmpty, IsString, MinLength, IsEmail, IsInt, IsPositive, IsDate, Max} from "class-validator";

export class GradeDto {
    @IsInt({
        message:"Has to be number",
    })
    @IsNotEmpty({
        message: "Field required",
    })
    @IsPositive({
        message:"Cant be nagative",
    })
    @Max(100,{
        message:"Cant go over 100",
    })
    @Expose()
    value !: number;


    @Expose()
    studentId !: number;



    @Expose()
    course !: string;


    @IsString({
        message:"Has to be number",
    })
    @IsNotEmpty({
        message: "Field required",
    })
    @Expose()
    title !: string;


    @IsString({
        message:"Has to be number",
    })
    @IsNotEmpty({
        message: "Field required",
    })
    @Expose()
    category !: string;


    @Expose()
    description !: string;
}