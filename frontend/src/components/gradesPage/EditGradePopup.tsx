import {Text} from "../ui/Text.tsx";
import {capitalCase} from "change-case";
import {InputGrade} from "../ui/InputGrade.tsx";
import {useState} from "react";
import {Button} from "../ui/Button.tsx";

type Grade = {
    id: number;
    value: number;
    title: string;
    category: string;
    description?: string;
}

type EditGradePopupProps = {
    selectedGrade : Grade;
    setSelectedGrade : (selectedGrade : Grade|null) => void;
    setStudentGrades : React.Dispatch<React.SetStateAction<Grade[]>>;
}

export const EditGradePopup = ({selectedGrade, setSelectedGrade, setStudentGrades} : EditGradePopupProps) => {
    const [newValue, setNewValue] = useState<string|null>(null);
    const [newDescription, setNewDescription] = useState<string|null>(null);

    const updateGrade = async () => {
        const URL = import.meta.env.VITE_URL + "grade/" + selectedGrade.id;

        const gradeData = {
            value: newValue !== null ? parseInt(newValue) : selectedGrade.value,
            title: selectedGrade.title,
            category: selectedGrade.category,
            description: newDescription !== null ? newDescription : selectedGrade.description
        };

        try {
            const response = await fetch(URL, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(gradeData),
            });

            if (response.ok) {
                alert('Grade updated');
                setStudentGrades((prevState: Grade[]) =>
                    prevState.map((grade) =>
                        grade.id === selectedGrade.id
                            ? { ...grade, ...gradeData }
                            : grade
                    )
                );
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (err) {
            alert('Something went wrong');
        }
    };

    const deleteGrade = async () => {
        const URL = import.meta.env.VITE_URL + "grade/" + selectedGrade.id;
        try {
            const response = await fetch(URL, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.ok) {
                alert('Grade updated');
                setStudentGrades((prevState: Grade[]) =>
                    prevState.filter((grade) => grade.id !== selectedGrade.id)
                );
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (err) {
            alert('Something went wrong');
        }
    }


    return(
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
                            <Text>{capitalCase(selectedGrade.category)}</Text>
                            <Text type="h3">{selectedGrade.title}</Text>
                        </div>

                        <div className="flex gap-4 items-center">
                            <Text type={'h3'}> Grade: </Text>
                            <InputGrade onChange={(e)=>{setNewValue(e.target.value)}} defaultValue={selectedGrade.value}/>
                        </div>

                        <div>
                            <Text type={"h4"}>Description:</Text>
                            <textarea
                                className={`mt-4 mb-8 sm:mb-16 bg-darkGray text-lightGray w-full h-40 rounded-[10px] p-4 focus:outline-none max-h-80 min-h-40 text-[20px] sm:text-[20px] text-lightgray font-open-sans`}
                                defaultValue={selectedGrade.description}
                                placeholder={'Add description...'}
                                onChange={(e)=>{setNewDescription(e.target.value)}}
                            />
                        </div>

                        <Button onClick={()=>{deleteGrade();setSelectedGrade(null)}} size={'small'}>Remove</Button>

                        <Button variant={'important'} onClick={() => {
                            updateGrade();
                            setSelectedGrade(null)
                        }}>Apply Changes</Button>
                    </div>
                </div>
            </div>
        </>
    )
}