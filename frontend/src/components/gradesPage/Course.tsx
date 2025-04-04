import {Grade} from "../ui/Grade.tsx";
import {Text} from "../ui/Text.tsx";

type Course = {
    courseId: number,
    courseName: string,
    teacherFirstName: string,
    teacherLastName: string,
    averageGrade: number,
}

export const Course = ({course}:{course:Course}) => {
    console.log(course);
    return(
        <div className="flex gap-4">
            <Grade size='large' value={Math.round(course.averageGrade)}/>
            <div>
                <Text type={'h4'}>{course.courseName}</Text>
                <Text type={'small'}>{course.teacherFirstName} {course.teacherLastName}</Text>
            </div>
        </div>
    )
}