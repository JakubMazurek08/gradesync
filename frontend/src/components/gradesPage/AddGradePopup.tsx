import {Text} from "../ui/Text.tsx";
import {useForm} from "react-hook-form";
import {Input} from "../ui/Input.tsx";
import {Button} from "../ui/Button.tsx";
import {InputGrade} from "../ui/InputGrade.tsx";
import {useParams} from "react-router-dom";
import toastify from "toastify-js";

type Grade = {
    id: number;
    value: number;
    title: string;
    category: string;
    description?: string;
}

type AddGradePopupProps = {
    selectedStudent : string;
    setSelectedStudent: (selectedStudent: string|null) => void;
    studentId : number;
    setStudentGrades : React.Dispatch<React.SetStateAction<Grade[]>>;
}

type FormFields = {
    title : string;
    value : number;
    category : string
    description? : string;
}

export const AddGradePopup = ({selectedStudent, setSelectedStudent, studentId, setStudentGrades} : AddGradePopupProps) => {
    const {course} = useParams();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormFields>();

    const onSubmit = async (formData: FormFields) => {
        const URL = import.meta.env.VITE_URL + "grade"

        formData.value = Math.max(0, Math.min(formData.value, 100));

        const data = {
            ...formData,
            studentId : studentId,
            course : course,
        }
        try {
            const response = await fetch(URL, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            if (response.status === 201) {
                toastify({
                        text: "Grade Added!",
                        duration: 3000,
                        backgroundColor: '#903FEDFF',
                    }
                ).showToast();

                const addedGrade = await response.json();

                setStudentGrades((prevState: Grade[]) =>
                    [...prevState, addedGrade]
                );

                setSelectedStudent(null);
            } else {
                const errorData = await response.json();
                toastify({
                        text: `Error: ${errorData.error}`,
                        duration: 3000,
                        backgroundColor: '#ff0000',
                    }
                ).showToast();

                setSelectedStudent(null);
            }
        } catch (err) {
            toastify({
                    text: `Error: ${err}`,
                    duration: 3000,
                    backgroundColor: '#ff0000',
                }
            ).showToast();
            setSelectedStudent(null);
        }
    }

    return <>
        <div className="absolute w-screen h-screen left-0 top-0 z-40">
            <div
                onClick={() => {setSelectedStudent(null)}}
                className="absolute w-full h-full bg-black opacity-50"
            ></div>

            <div className="flex justify-center items-center w-full h-full">
                <div
                    className="bg-background p-10 min-w-1/4 w-fit m-2 rounded-xl  z-50 flex  drop-shadow-2xl  flex-col gap-8">
                    <Text type={'p'}>Adding New Grade For {selectedStudent}</Text>

                    <form
                        className="lg:w-100 flex items-center flex-col gap-10"
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        <div className="w-full flex flex-col gap-5">
                            <div className="w-full">
                                <Text type="h4">Title</Text>
                                <Input
                                    {...register("title",
                                        {
                                            required: "Title is required",
                                            minLength: {
                                                value: 4,
                                                message: "Title must be at least 4 characters"
                                            }
                                        })}
                                    placeholder="type here..."
                                    inputSize="large"
                                />
                                {errors?.title && <Text>{errors.title.message}</Text>}
                            </div>

                            <div className="w-full">
                                <Text type="h4">Category</Text>
                                <Input
                                    {...register("category",
                                        {
                                            required: "Category is required",
                                        })}
                                    placeholder="eg. test"
                                    inputSize="large"
                                />
                                {errors?.category && <Text>{errors.category.message}</Text>}
                            </div>

                            <div className="w-full">
                                <Text type="h4">Grade</Text>
                                <InputGrade {...register("value")} />
                                {errors?.value && <Text>{errors.value.message}</Text>}
                            </div>

                            <div className="w-full">
                                <Text type="h4">Description</Text>
                                <textarea
                                    className={`mt-4 mb-8 sm:mb-16 bg-darkGray text-lightGray w-full h-40 rounded-[10px] p-4 focus:outline-none max-h-80 min-h-40 text-[20px] sm:text-[20px] text-lightgray font-open-sans`}
                                    placeholder={'Type here...'}
                                    {...register('description')}
                                />
                            </div>
                        </div>

                        <Button type={'submit'} variant={'important'}>Add Grade</Button>
                    </form>
                </div>
            </div>
        </div>
    </>
}