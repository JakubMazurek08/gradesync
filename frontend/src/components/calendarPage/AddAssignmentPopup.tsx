import {Text} from "../ui/Text.tsx";
import {Input} from "../ui/Input.tsx";
import {Button} from "../ui/Button.tsx";
import {Controller, useForm} from "react-hook-form";
import Select from 'react-select'
import {useEffect, useState} from "react";
import toastify from "toastify-js";

type AddAssignmentPopupProps = {
    addAssignmentDate: string;
    setAddAssignmentDate: (date: null) => void;
}

type FormFields = {
    title: string;
    lessonHour: number|null;
    date: string;
    course: number;
    category: string;
    description?: string;
}

type Course = {
    id: number;
    courseName: string;
    yearString: string;
}



export const AddAssignmentPopup = ({addAssignmentDate, setAddAssignmentDate}: AddAssignmentPopupProps) => {
    const [courses, setCourses] = useState()
    const [lessonHours, setLessonHours] = useState()

    const [isDisabled, setIsDisabled] = useState(true)


    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
        setValue,
    } = useForm<FormFields>();

    const onSubmit = async (formData: FormFields) => {
        const URL = import.meta.env.VITE_URL + "assignment"

        const splitDays = addAssignmentDate.split("-");
        const day = splitDays[0];
        const month = splitDays[1];
        const year = splitDays[2];

        const data = {
            ...formData,
            date : year+'-'+month+'-'+day,
        }

        console.log(data);

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
                        text: "Assignment Added!",
                        duration: 3000,
                        backgroundColor: '#903FEDFF',
                    }
                ).showToast();

                //const addedGrade = await response.json();

                // setStudentGrades((prevState: Grade[]) =>
                //     [...prevState, addedGrade]
                // );

                setAddAssignmentDate(null);
            } else {
                const errorData = await response.json();
                toastify({
                        text: `Error: ${errorData.error}`,
                        duration: 3000,
                        backgroundColor: '#ff0000',
                    }
                ).showToast();

                setAddAssignmentDate(null);
            }
        } catch (err) {
            toastify({
                    text: `Error: ${err}`,
                    duration: 3000,
                    backgroundColor: '#ff0000',
                }
            ).showToast();
            setAddAssignmentDate(null);
        }
    }

    useEffect(() => {
        const URL = import.meta.env.VITE_URL + "teacher/courses"
        fetch(URL,{
            method: "GET",
            credentials: "include",
        }).then(res=>{if(res.status===200)
            res.json().then((data=>{
            setCourses(data.map((course:Course)=>{
                return({
                    value: course.id,
                    label: course.courseName + " (" + course.yearString + ")",
                })
            }))
        }))
        })
    }, []);

    const updateLessonHourData = async (value:number) => {
        const URL = import.meta.env.VITE_URL + `course/${value}/date/${addAssignmentDate}/lesson-hours`
        fetch(URL,{
            method: "GET",
            credentials: "include",
        }).then(res=>{if(res.status===200){
            res.json().then((data=>{
            setLessonHours(data.map((lessonHour:number)=>{
                return({
                    value: lessonHour,
                    label: lessonHour
                })
            }))
        }))}else{
                setLessonHours(undefined);
            }
        })
    }

    return (
        <>
            <div className="absolute w-screen h-screen left-0 top-0 z-40">
                <div
                    onClick={() => {
                        setAddAssignmentDate(null);
                    }}
                    className="absolute w-full h-full bg-black opacity-50"
                ></div>

                <div className="flex justify-center items-center w-full h-full">
                    <div
                        className="bg-background p-10 min-w-1/4 w-fit m-2 rounded-xl  z-50 flex  drop-shadow-2xl  flex-col gap-8">
                        <Text type={'p'}>Adding New Assignment on {addAssignmentDate}</Text>

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
                                        inputSize="medium"
                                    />
                                    {errors?.title && <Text>{errors.title.message}</Text>}
                                </div>

                                <div className="w-full">
                                    <Text type="h4">Category</Text>
                                    <Input
                                        {...register("category",
                                            {
                                                required: "Category is required",
                                                minLength: {
                                                    value: 4,
                                                    message: "Category must be at least 4 characters"
                                                }
                                            })}
                                        placeholder="type here..."
                                        inputSize="medium"
                                    />
                                    {errors?.category && <Text>{errors.category.message}</Text>}
                                </div>

                                <div className="w-full">
                                    <Text type="h4">Course</Text>
                                    <Controller
                                        name="course"
                                        control={control}
                                        render={({field}) => (
                                            <Select
                                                {...field}
                                                options={courses}
                                                // @ts-ignore
                                                value={courses?.find(course => course.value === field.value)}
                                                styles={{
                                                    control: (base, state) => ({
                                                        ...base,
                                                        backgroundColor: "transparent",
                                                        borderColor: state.isFocused ? '#D0D0D0' : '#3C1596',
                                                        outline: 'none',
                                                        boxShadow: 'none',
                                                        '&:hover': {
                                                            borderColor: '#3C1596',
                                                        },
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        backgroundColor: '#222222',
                                                        border: 'none',
                                                        boxShadow: 'none',
                                                    }),
                                                    option: (base) => ({
                                                        ...base,
                                                        color: '#D0D0D0',
                                                        backgroundColor: '#222222',
                                                    }),
                                                    singleValue: (base) => ({
                                                        ...base,
                                                        color: '#D0D0D0',
                                                    }),
                                                }}
                                                onChange={(newValue) => {
                                                    setIsDisabled(false);
                                                    setValue("lessonHour", null);
                                                    field.onChange(newValue?.value);
                                                    updateLessonHourData(newValue.value);
                                                }}
                                            />
                                        )}
                                    />
                                    {errors?.course && <Text>{errors.course.message}</Text>}
                                </div>


                                <div className="w-full">
                                    <Text type="h4">Lesson Hour</Text>
                                    <Controller
                                        name="lessonHour"
                                        control={control}

                                        render={({field}) => (
                                            <Select
                                                isDisabled={isDisabled}
                                                placeholder={isDisabled ? 'Select Course First' : 'Select...'}
                                                {...field}
                                                // @ts-ignore
                                                value={lessonHours?.find(lesson => lesson.value === field.value)}
                                                options={lessonHours}
                                                styles={{
                                                    control: (base, state) => ({
                                                        ...base,
                                                        backgroundColor: "transparent",
                                                        borderColor: isDisabled ? 'red' : state.isFocused ? '#D0D0D0' : '#3C1596',
                                                        outline: 'none',
                                                        boxShadow: 'none',
                                                        '&:hover': {
                                                            borderColor: '#3C1596',
                                                        },
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        backgroundColor: '#222222',
                                                        border: 'none',
                                                        boxShadow: 'none',
                                                    }),
                                                    option: (base) => ({
                                                        ...base,
                                                        color: '#D0D0D0',
                                                        backgroundColor: '#222222',
                                                    }),
                                                    singleValue: (base) => ({
                                                        ...base,
                                                        color: '#D0D0D0',
                                                    }),
                                                }}
                                                onChange={(newValue) => {
                                                    // @ts-ignore
                                                    field.onChange(newValue?.value);
                                                }}
                                            />
                                        )}
                                    />
                                    {errors?.lessonHour && <Text>{errors.lessonHour.message}</Text>}
                                </div>

                                <div className="w-full">
                                    <Text type="h4">Description</Text>
                                    <textarea
                                        className={`mt-4 mb-8 sm:mb-16 bg-mediumgray text-lightGray w-full h-40 rounded-[10px] p-4 focus:outline-none max-h-80 min-h-40 text-[20px] sm:text-[20px] text-lightgray font-open-sans`}
                                        placeholder={'Type here...'}
                                        {...register('description')}
                                    />
                                </div>

                            </div>

                            <Button type={'submit'} variant={'important'}>Add Assignment</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}