import {useEffect, useState, useMemo} from "react";
import {Input} from "../ui/Input.tsx";
import {Text} from "../ui/Text.tsx";
import {Course} from "./Course.tsx";
import {Button} from "../ui/Button.tsx";
import {useParams} from "react-router-dom";

type Course = {
    courseId: number,
    courseName: string,
    teacherFirstName: string,
    teacherLastName: string,
    averageGrade: number,
}

export const CoursesList = ({setAverage}:{setAverage: (arg0: number) => (void)}) => {
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
        const URL = import.meta.env.VITE_URL + "grade/courses";
        fetch(URL, {
            method: "GET",
            credentials: "include",
        }).then(res => {if(res.status===200)res.json().then((data: Course[]) => {
            setCourses(data);
            const sum = data.reduce((acc, course) => acc + Math.round(course.averageGrade), 0);
            setAverage(Math.round(sum / data.length));
        })});
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
        <div className={`w-80 h-full xl:w-100 shrink-0 border-r-0 sm:border-r-1 border-lightgray pr-0 lg:pr-20 ${!course? 'block' : 'hidden sm:block'}`}>
            <Input onChange={(e) => setSelectedCourse(e.target.value)} placeholder='search...' />
            <div className='flex flex-col h-full justify-between mt-10 gap-10'>
                {courses[0] ? (
                    <>
                        <div className='flex flex-col gap-6'>
                            {sortedCourses.map(course => (
                            <Course key={course.courseId} course={course} /> ))}
                        </div>

                        <div className='flex items-center gap-2'><Button size='small' onClick={goToPreviousPage}>Prev</Button>
                            <Text type='small'> Page {currentPage} of {totalPages} </Text>
                            <Button size='small' onClick={goToNextPage}>Next</Button>
                        </div>
                    </>
                ):
                    <Text>loading...</Text>
                }

            </div>
        </div>
    );
};
