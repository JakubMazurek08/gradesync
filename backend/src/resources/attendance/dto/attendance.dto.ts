import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString, IsArray, IsDate, IsNumber, IsInt, IsIn, ValidateNested, ArrayMinSize } from "class-validator";

export class AttendanceRecordDto {
    @IsInt({
        message: "Student ID must be an integer",
    })
    @IsNotEmpty({
        message: "Student ID is required",
    })
    @Expose()
    studentId!: number;

    @IsString({
        message: "Status must be a string",
    })
    @IsIn(['present', 'absent_excused', 'absent_unexcused', 'late'], {
        message: "Status must be one of: present, absent_excused, absent_unexcused, late",
    })
    @IsNotEmpty({
        message: "Status is required",
    })
    @Expose()
    status!: string;
}

export class BulkAttendanceDto {
    @IsArray({
        message: "Attendance records must be an array",
    })
    @ArrayMinSize(1, {
        message: "At least one attendance record is required",
    })
    @ValidateNested({ each: true })
    @Type(() => AttendanceRecordDto)
    @Expose()
    attendanceRecords!: AttendanceRecordDto[];

    @IsString({
        message: "Date must be a string in ISO format (YYYY-MM-DD)",
    })
    @IsNotEmpty({
        message: "Date is required",
    })
    @Expose()
    date!: string;

    @IsInt({
        message: "Course ID must be an integer",
    })
    @IsNotEmpty({
        message: "Course ID is required",
    })
    @Expose()
    courseId!: number;
}