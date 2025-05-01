import {Text} from "../ui/Text";
import {Grade} from "../ui/Grade";
import {useState} from "react";
import {EditGradePopup} from "./EditGradePopup.tsx";
import {AddGradePopup} from "./AddGradePopup.tsx";

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

export const Student = ({student}: {student: Student}) => {
    const [selectedGrade, setSelectedGrade] = useState<null | Grade>(null);
    const [studentGrades, setStudentGrades] = useState<Grade[]>(student.grades);
    const [selectedStudent, setSelectedStudent] = useState<string|null>(null);


    return(
        <div>
            <Text>{student.name}:</Text>
            <div className={'flex flex-wrap gap-2 mt-1 mb-4 items-center'}>
                {
                    studentGrades[0]?
                        <>
                        {
                            studentGrades.map((grade: Grade) => (
                            <div className="relative group inline-block cursor-pointer" onClick={() => setSelectedGrade(grade)}>
                                <Grade size="small" value={grade.value}/>
                                <div
                                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-mediumlight-gray text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                    {grade.title}
                                </div>
                            </div>
                            ))
                        }
                        <button className={'cursor-pointer'} onClick={()=>{setSelectedStudent(student.name)}}><Text type={'h4'}>+</Text></button>
                        </>
                        :
                        <Text>
                            <div className={'w-40 my-4 border-b border-1 border-lightgray'}></div>
                        </Text>
                }
            </div>

            {selectedGrade ?
               <EditGradePopup selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} setStudentGrades={setStudentGrades}/>
                : null}
            {selectedStudent ?
                <AddGradePopup selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} studentId={student.studentId} setStudentGrades={setStudentGrades}/>
            :null}
        </div>

    )
}