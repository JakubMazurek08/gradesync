import {Text} from "../components/ui/Text.tsx";
import {Grade} from "../components/ui/Grade.tsx";
import {CoursesList} from "../components/gradesPage/CoursesList.tsx";
import {useState} from "react";

export const StudentGradesPage = () => {
    const [average, setAverage] = useState(0);

    return (
        <main className="p-5 lg:p-0 lg:px-[10vw] lg:pt-14">
            <div className='w-full flex flex-col sm:flex-row justify-between'>
                <Text type='h1'>Grades</Text>
                <div className='flex items-center gap-6'>
                    <Text type='h3'>Average:</Text>
                    <Grade size='large' value={average}/>
                </div>
            </div>
            <CoursesList setAverage={setAverage}/>
        </main>
    )
}