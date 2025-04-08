import {Text} from "../ui/Text.tsx";
import {Grade} from "../ui/Grade.tsx";
import {capitalCase} from "change-case";

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
    let filteredGrades = [];
    if(category){
        filteredGrades = grades.filter((grade) => grade.gradeCategory === category);
    }else{
        filteredGrades = grades;
    }

    if(filteredGrades[0]) {
        return <div className="m-4">
            <Text type='h4'>{category? capitalCase(category) : 'Additional'}:</Text>
            <div className='grid grid-cols-1 2xl:grid-cols-2'>
                {filteredGrades.map((grade) => (
                    <div key={grade.gradeId} className="flex items-center gap-2 m-2 w-[250px]">
                        <Grade size='small' value={grade.gradeValue}/>
                        <Text type='small'>{grade.gradeTitle}</Text>
                    </div>
                ))}
            </div>
        </div>
    }
}