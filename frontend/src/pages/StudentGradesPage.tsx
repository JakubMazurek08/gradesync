import {Text} from "../components/ui/Text.tsx";
import {Grade} from "../components/ui/Grade.tsx";
import {CoursesList} from "../components/gradesPage/CoursesList.tsx";
import {useState} from "react";
import {GradeDisplay} from "../components/gradesPage/GradeDisplay.tsx";
import {useParams, useNavigate} from "react-router-dom";
import {Button} from "../components/ui/Button.tsx";

export const StudentGradesPage = () => {
    const [average, setAverage] = useState(0);
    const {course} = useParams();
    const navigate = useNavigate();

    return (
        <main className="p-5 h-full lg:p-0 lg:px-[5vw] lg:pt-14">
            <div className={`w-full ${course?'hidden sm:flex' : 'flex'} flex-col sm:flex-row justify-between`}>
                <Text type='h1'>Grades</Text>
                <div className='flex items-center gap-6'>
                    <Text type='h3'>Average:</Text>
                    <Grade size='large' value={average}/>
                </div>
            </div>
            <Button onClick={()=>{navigate('/grades')}}
                className={`${course? 'block sm:hidden bg-transparent hover:bg-blue-500 hover:border-blue-500 border-lightgray  w-fit px-4 py-1 border-2  rounded-lg cursor-pointer active:scale-95 transition-all duration-200' : 'hidden' }`}>Back</Button>
            <div className='flex flex-row my-6'>
                <CoursesList isTeacher={false} setAverage={setAverage}/>
                <GradeDisplay/>
            </div>
        </main>
    )
}