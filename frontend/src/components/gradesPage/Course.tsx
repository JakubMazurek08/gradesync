import {Grade} from "../ui/Grade.tsx";
import {Text} from "../ui/Text.tsx";
import {useNavigate} from "react-router-dom";

type Course = {
    courseId: number,
    courseName: string,
    teacherFirstName: string,
    teacherLastName: string,
    averageGrade: number,
}

export const Course = ({course}:{course:Course}) => {
    const navigate = useNavigate();

    return(
        <button onClick={() => navigate(`/grades/${course.courseName}`)}
                className="cursor-pointer flex gap-4 justify-start text-start">
            <Grade size='large' value={Math.round(course.averageGrade)}/>
            <div>
                <Text type={'h4'}>{course.courseName}</Text>
                <Text type={'small'}>{course.teacherFirstName} {course.teacherLastName}</Text>
            </div>
        </button>
    )
}