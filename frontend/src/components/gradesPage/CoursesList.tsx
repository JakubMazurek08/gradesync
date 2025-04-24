import {useEffect, useState, useMemo} from "react";
import {Input} from "../ui/Input.tsx";
import {Text} from "../ui/Text.tsx";
import {Course} from "./Course.tsx";
import {Button} from "../ui/Button.tsx";
import {useParams} from "react-router-dom";
import {TeacherCourse} from "./TeacherCourse.tsx";

type Course = {
    courseId: number,
    courseName: string,
    teacherFirstName: string,
    teacherLastName: string,
    averageGrade: number,
    yearString: string,
}

export const CoursesList = ({setAverage, isTeacher}:{setAverage?: (arg0: number) => (void), isTeacher: boolean,}) => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const {course} = useParams();

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil((courses?.length || 0) / 6);

    const startIndex = (currentPage - 1) * 6;

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        if(!isTeacher){
            const URL = import.meta.env.VITE_URL + "grade/courses";
            fetch(URL, {
                method: "GET",
                credentials: "include",
            }).then(res => {if(res.status===200)res.json().then((data: Course[]) => {
                setCourses(data);
                const sum = data.reduce((acc, course) => acc + Math.round(course.averageGrade), 0);
                if(setAverage){
                    setAverage(Math.round(sum / data.length));
                }
            })});
        }else{
            const URL = import.meta.env.VITE_URL + "teacher/courses"
            fetch(URL,{
                method: "GET",
                credentials: "include",
            }).then(res=>{if(res.status===200)res.json().then((data=>{
                console.log(data);
                setCourses(data)
            }))})
        }

    }, []);

    const getSimilarityScore = (courseName: string, search: string): number => {
        const name = courseName.toLowerCase();
        const input = search.toLowerCase();

        if (name === input) return Infinity;
        if (name.startsWith(input)) return 1000;
        if (name.includes(input)) return 100;

        return -name.indexOf(input);
    };

    const sortedCourses = useMemo(() => {
        if (!selectedCourse.trim()) return courses.slice(startIndex, startIndex + 6) || [];

        return [...courses].sort((a, b) => {
            const scoreA = getSimilarityScore(a.courseName, selectedCourse);
            const scoreB = getSimilarityScore(b.courseName, selectedCourse);
            return scoreB - scoreA;
        }).slice(startIndex, startIndex + 6) || [];
    }, [selectedCourse, courses, currentPage]);

    return (
        <div
            className={`w-80 flex-col flex-grow justify-between xl:w-100 shrink-0 border-r-0 sm:border-r-1 border-lightgray pr-0 lg:pr-20 ${!course ? 'flex' : 'hidden sm:flex'}`}>
            <div>
                <Input onChange={(e) => setSelectedCourse(e.target.value)} placeholder='search...'/>

                <div className='flex flex-col justify-between mt-10 gap-10'>
                    {courses[0] ? (
                            <>
                                <div className='flex flex-col gap-6'>
                                    {sortedCourses.map(course => {
                                        if (isTeacher) {
                                            return <TeacherCourse key={course.courseId} courseName={course.courseName}
                                                                  yearString={course.yearString}/>
                                        } else {
                                            return <Course key={course.courseId} course={course}/>
                                        }
                                    })}
                                </div>
                            </>
                        ) :
                        <Text>loading...</Text>
                    }

                </div>
            </div>
            <div className='flex items-center justify-center w-full gap-2 justify-self-end'>
                <Button size='small' onClick={goToPreviousPage}>Prev</Button>
                <Text type='p'> {currentPage} of {totalPages} </Text>
                <Button size='small' onClick={goToNextPage}>Next</Button>
            </div>
        </div>
    );
};
