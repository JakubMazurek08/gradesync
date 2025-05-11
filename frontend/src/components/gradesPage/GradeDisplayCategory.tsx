import {Text} from "../ui/Text.tsx";
import {Grade} from "../ui/Grade.tsx";
import {capitalCase} from "change-case";
import {useState} from "react";

type Grade = {
    gradeId: number;
    gradeValue: number;
    gradeTitle: string;
    gradeCategory: string;
    gradeDescription?: string;
}

type GradeDisplayCategoryProps = {
    category?: string;
    grades: Grade[];
}


export const GradeDisplayCategory = ({category, grades}: GradeDisplayCategoryProps) => {
    const [selectedGrade, setSelectedGrade] = useState<null | Grade>(null);

    let filteredGrades = [];
    if (category) {
        filteredGrades = grades.filter((grade) => grade.gradeCategory === category);
    } else {
        filteredGrades = grades;
    }

    if (filteredGrades[0]) {
        return <>
            <div className="m-4 flex flex-col gap-2">
                <Text type='h4'>{category ? capitalCase(category) : 'Additional'}:</Text>
                <div className="flex flex-wrap gap-4">
                    {filteredGrades.map((grade) => (


                        <div key={grade.gradeId} onClick={() => {
                    setSelectedGrade(grade)}}
                            className="relative group inline-block cursor-pointer">
                            <Grade size="medium" value={grade.gradeValue}/>
                            <div
                                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-mediumlight-gray text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                {grade.gradeTitle}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedGrade ?
                <>
                    <div className="absolute w-screen h-screen left-0 top-0 z-40">
                        <div
                            onClick={() => setSelectedGrade(null)}
                            className="absolute w-full h-full bg-black opacity-50"
                        ></div>

                        <div className="flex justify-center items-center w-full h-full">
                            <div
                                className="bg-background p-10 min-w-1/4 w-fit m-2 rounded-xl  z-50 flex  drop-shadow-2xl  flex-col gap-8">
                                <div>
                                    <Text>{capitalCase(selectedGrade.gradeCategory)}</Text>
                                    <Text type="h3">{selectedGrade.gradeTitle}</Text>
                                </div>

                                <div className="flex gap-4 items-center">
                                    <Text type={'h3'}> Grade: </Text>
                                    <Grade  value={selectedGrade.gradeValue}/>
                                </div>

                                <div>
                                    <Text type={"h4"}>Description:</Text>
                                    <Text type={'small'}>{selectedGrade.gradeDescription ?? "No description"}</Text>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
                : null}
        </>
    }
}