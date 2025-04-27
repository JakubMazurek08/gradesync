import {Text} from "../ui/Text.tsx";
import {Grade} from "../ui/Grade.tsx";
import {capitalCase} from "change-case";
import {useState} from "react";

type Grade = {
    gradeId: number;
    gradeValue: number;
    gradeTitle: string;
    gradeCategory: string;
}

type GradeDisplayCategoryProps = {
    category? : string;
    grades: Grade[];
}


export const GradeDisplayCategory = ({category, grades} : GradeDisplayCategoryProps) => {
    const [selectedGrade, setSelectedGrade] = useState<null|Grade>(null);

    let filteredGrades = [];
    if(category){
        filteredGrades = grades.filter((grade) => grade.gradeCategory === category);
    }else{
        filteredGrades = grades;
    }

    if(filteredGrades[0]) {
        return<><div className="m-4 flex flex-col gap-2">
            <Text type='h4'>{category ? capitalCase(category) : 'Additional'}:</Text>
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_max-content))] gap-2">
                {filteredGrades.map((grade) => (
                    <div key={grade.gradeId} onClick={()=>{setSelectedGrade(grade)}} className="flex items-center cursor-pointer gap-2 w-[200px]">
                        <Grade size='small' value={grade.gradeValue}/>
                        <Text type='small'>{grade.gradeTitle}</Text>
                    </div>
                ))}
            </div>
        </div>
            {selectedGrade ?
                    <div className={'absolute w-screen h-screen flex justify-center items-center left-0 top-0 z-50 bg-black opacity-50'}>
                        <div>
                            <Text type={'h4'}>{selectedGrade.gradeTitle}</Text>
                        </div>
                    </div>
                : null}
        </>
    }
}