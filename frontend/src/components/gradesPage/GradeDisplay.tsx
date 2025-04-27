import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Text} from "../ui/Text.tsx";
import {Grade} from "../ui/Grade.tsx";
import {GradeDisplayCategory} from "./GradeDisplayCategory.tsx";
import {capitalCase} from "change-case";

type Grade = {
    gradeId: number;
    gradeValue: number;
    gradeTitle: string;
    gradeCategory: string;
}

type Data = {
    courseName : string;
    teacherFirstName: string;
    teacherLastName: string;
    grades: Grade[]
}

export const GradeDisplay = () => {
    const {course} = useParams();

    const [data, setData] = useState<Data|null>(null);
    const [fullGrade, setFullGrade] = useState(0);

    useEffect(() => {
        if(course){
            const URL = import.meta.env.VITE_URL + "grade/" + course;

            fetch(URL, {
                method: "GET",
                credentials: "include",
            }).then(res=>res.json().then(data=>{
                setData(data);
                let fullGrade = 0;
                data.grades.forEach((grade: Grade)=>{
                    fullGrade += grade.gradeValue;
                })
                setFullGrade(Math.round(fullGrade/data.grades.length));
            }))
        }
    }, [course]);



    return <div className={`h-[calc(100vh-200px)] w-full flex-col items-center sm:ml-10 xl:ml-20  ${course ? 'flex' : 'hidden sm:flex'}`}>
        {
            !course ? <Text type='h3'> Select a course to see all grades... </Text> : !data ? <Text type='h3'> Loading... </Text> :
                <>
                    <div className='w-full flex flex-col'>
                        <Text type={'h2'}>{capitalCase(data.courseName)}</Text>
                        <Text type={'p'}>{data.teacherFirstName} {data.teacherLastName}</Text>
                        <div className='flex mt-2 items-center gap-4 w-fit h-fit'>
                            <Text type='h4'>Full Grade:</Text>
                            <Grade value={fullGrade}/>
                        </div>
                    </div>
                    <div className='w-full overflow-y-scroll bg-darkgray p-2 rounded-2xl flex mt-10 flex-col'>
                        <GradeDisplayCategory category='test' grades={data.grades}/>
                        <GradeDisplayCategory category='short_test' grades={data.grades}/>
                        <GradeDisplayCategory grades={data.grades}/>
                    </div>

                </>
        }
    </div>;

}