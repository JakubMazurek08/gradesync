import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsDateString, IsArray } from 'class-validator';
import { BulkAttendanceRecordDto } from './bulk-attendance-record.dto';

export class BulkAttendanceDto {
    @IsInt({ message: 'courseId must be an integer' })
    @IsNotEmpty({ message: 'courseId is required' })
    @Expose()
    courseId!: number;

    @IsDateString({}, { message: 'date must be a valid ISO 8601 date string' })
    @IsNotEmpty({ message: 'date is required' })
    @Expose()
    date!: string;

    @IsArray({ message: 'attendanceRecords must be an array' })
    @ArrayNotEmpty({ message: 'attendanceRecords cannot be empty' })
    @ValidateNested({ each: true })
    @Type(() => BulkAttendanceRecordDto)
    @Expose()
    attendanceRecords!: BulkAttendanceRecordDto[];
}
