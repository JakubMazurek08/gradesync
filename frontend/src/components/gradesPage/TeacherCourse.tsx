import {useNavigate} from "react-router-dom";
import {Text} from "../ui/Text.tsx";
import {Lesson} from "../ui/Icons.tsx";

type CourseProps = {
    courseName: string
    yearString : string
}

export const TeacherCourse = ({courseName, yearString}:CourseProps) => {
    const navigate = useNavigate();

    return(
        <button onClick={() => navigate(`/grades/${courseName}`)}
    className="cursor-pointer flex gap-4 justify-start items-center text-start text-purple-500">
    <Lesson/>
    <div>
    <Text type={'h4'}>{courseName}</Text>
        <Text type={'small'}>{yearString}</Text>
    </div>
    </button>
)
}