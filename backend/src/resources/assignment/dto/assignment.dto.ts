import {Expose} from "class-transformer";
import {IsNotEmpty, IsString, MinLength, IsInt, IsPositive} from "class-validator";

export class AssignmentDto {
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
    title !: string;


    @IsInt({
        message:"Has to be number",
    })
    @IsNotEmpty({
        message: "Field required",
    })
    @IsPositive({
        message:"Cant be negative",
    })
    @Expose()
    lessonHour !: number;




    @IsString({
        message:"Has to be date",
    })
    @IsNotEmpty({
        message: "Field required",
    })
    @Expose()
    date !: string;


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
    category !: string;


    @Expose()
    description !: string;
}