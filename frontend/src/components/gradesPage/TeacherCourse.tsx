import {useNavigate} from "react-router-dom";
import {Text} from "../ui/Text.tsx";

type CourseProps = {
    courseName: string
}

export const TeacherCourse = ({courseName}:CourseProps) => {
    const navigate = useNavigate();

    return(
        <button onClick={() => navigate(`/grades/${courseName}`)}
    className="cursor-pointer flex gap-4 justify-start text-start">
    {/*<Grade size='large' value={Math.round(course.averageGrade)}/>*/}
    <div>
    <Text type={'h4'}>{courseName}</Text>
        <Text type={'small'}>2023-2028</Text>
    </div>
    </button>
)
}