import {useParams} from "react-router-dom";
import {Text} from "../ui/Text.tsx";
import {useEffect, useState} from "react";
import {Student} from "./Student";


type Grade = {
    id: number;
    value: number;
    title: string;
    category: string;
    description?: string;
}

type Student = {
    studentId: number;
    name: string;
    grades : Grade[];
}

export const TeacherGradeDisplay = () => {
    const {course} = useParams();

    const [data, setData] = useState<Student[]>([]);

    useEffect(() => {
        if(course){
            const URL = import.meta.env.VITE_URL + "grade/" + course + "/students";

            fetch(URL, {
                method: "GET",
                credentials: "include",
            }).then(res=>res.json().then(data=>{
                setData(data);
            }))
        }
    }, [course]);

    return <div className={`h-[calc(100vh-200px)] w-full flex-col sm:ml-10 xl:ml-20  ${course ? 'flex' : 'hidden sm:flex'}`}>
        {
            !course ? <Text type='h3'> Select a course to begin grading... </Text> :
                <>
                    <Text type={'h3'}>Students:</Text>
                    <div className={'p-2 bg-darkgray rounded-xl mt-4'}>
                        {
                            data?
                            data.map((studentData)=>(
                                <Student student={studentData} key={studentData.studentId}/>
                            ))
                            :<Text>Fetching students...</Text>
                        }
                    </div>
                </>
        }
    </div>;

}