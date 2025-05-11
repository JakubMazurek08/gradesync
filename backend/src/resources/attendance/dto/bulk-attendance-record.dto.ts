import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class BulkAttendanceRecordDto {
    @IsInt({ message: 'studentId must be an integer' })
    @IsNotEmpty({ message: 'studentId is required' })
    @Expose()
    studentId!: number;

    @IsString({ message: 'status must be a string' })
    @IsIn(['present', 'absent_excused', 'absent_unexcused', 'late'], {
        message: 'Invalid status',
    })
    @Expose()
    status!: string;
}
