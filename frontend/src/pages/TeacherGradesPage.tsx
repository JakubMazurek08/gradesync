import {Text} from "../components/ui/Text.tsx";
import {CoursesList} from "../components/gradesPage/CoursesList.tsx";
import {useParams, useNavigate} from "react-router-dom";
import {Button} from "../components/ui/Button.tsx";
import {TeacherGradeDisplay} from "../components/gradesPage/TeacherGradeDisplay.tsx";

export const TeacherGradesPage = () => {

    const {course} = useParams();
    const navigate = useNavigate();

    return <main className="p-5 h-full lg:p-0 lg:px-[5vw] lg:pt-14">
        <div className={`w-full ${course?'hidden sm:flex' : 'flex'} flex-col sm:flex-row justify-between`}>
            <Text type='h1'>Grades</Text>
        </div>
        <Button onClick={()=>{navigate('/grades')}}
                className={`${course? 'block sm:hidden bg-transparent hover:bg-blue-500 hover:border-blue-500 border-lightgray  w-fit px-4 py-1 border-2  rounded-lg cursor-pointer active:scale-95 transition-all duration-200' : 'hidden' }`}>Back</Button>
        <div className='flex flex-row my-6'>
            <CoursesList isTeacher={true}/>
            <TeacherGradeDisplay/>
        </div>
    </main>
}