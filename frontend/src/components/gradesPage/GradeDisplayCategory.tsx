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
        return <div className="m-4 flex flex-col gap-2">
            <Text type='h4'>{category ? capitalCase(category) : 'Additional'}:</Text>
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_max-content))] gap-4">
                {filteredGrades.map((grade) => (
                    <div key={grade.gradeId} className="flex items-center gap-2 w-[200px]">
                        <Grade size='small' value={grade.gradeValue}/>
                        <Text type='small'>{grade.gradeTitle}</Text>
                    </div>
                ))}
            </div>
        </div>
    }
}