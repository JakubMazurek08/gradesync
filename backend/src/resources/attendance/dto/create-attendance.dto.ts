import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import { AttendanceStatus } from './attendance-status.enum';

export class CreateAttendanceDto {
    @IsInt({ message: 'studentId must be an integer' })
    @IsNotEmpty({ message: 'studentId is required' })
    @Expose()
    studentId!: number;

    @IsDateString({}, { message: 'date must be a valid ISO 8601 date string' })
    @IsNotEmpty({ message: 'date is required' })
    @Expose()
    date!: string;

    @IsEnum(AttendanceStatus, {
        message: `status must be one of: ${Object.values(AttendanceStatus).join(', ')}`,
    })
    @IsNotEmpty({ message: 'status is required' })
    @Expose()
    status!: AttendanceStatus;
}
