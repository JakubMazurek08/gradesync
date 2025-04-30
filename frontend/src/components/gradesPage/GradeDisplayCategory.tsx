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
                <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_max-content))] gap-2">
                    {filteredGrades.map((grade) => (
                        <div key={grade.gradeId} onClick={() => {
                            setSelectedGrade(grade)
                        }} className="flex items-center cursor-pointer gap-2 w-[200px]">
                            <Grade size='small' value={grade.gradeValue}/>
                            <Text type='small'>{grade.gradeTitle}</Text>
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
                                className="bg-background p-6 w-full m-2 rounded-xl sm:w-2/3 lg:w-1/3 z-50 flex  drop-shadow-2xl  flex-col gap-4">
                                <div className={'mb-10'}>
                                    <Text type="h2"><span className={'text-purple-500'}>{capitalCase(selectedGrade.gradeCategory)}.</span></Text>
                                    <Text type="h3">{selectedGrade.gradeTitle}</Text>
                                </div>

                                <div className="flex gap-4 items-center">
                                    <Text type={'h3'}> Grade: </Text>
                                <Grade size={'large'} value={selectedGrade.gradeValue}/>
                                </div>

                                <div>
                                    <Text type={"h4"}>Description</Text>
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