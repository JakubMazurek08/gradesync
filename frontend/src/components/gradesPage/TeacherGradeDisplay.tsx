import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Text} from "../ui/Text.tsx";
import {Grade} from "../ui/Grade.tsx";
import {GradeDisplayCategory} from "./GradeDisplayCategory.tsx";
import {capitalCase} from "change-case";

export const TeacherGradeDisplay = () => {
    const {course} = useParams();

    return <div className={`h-[calc(100vh-200px)] w-full flex-col items-center sm:ml-10 xl:ml-20  ${course ? 'flex' : 'hidden sm:flex'}`}>
        {
            !course ? <Text type='h3'> Select a course to begin grading... </Text> :
                <>
                    <Text type={'h3'}> {course} </Text>
                </>
        }
    </div>;

}