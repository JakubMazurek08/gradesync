import {useUserStore} from "../stores/userStore.ts";
import { StudentGradesPage } from "./StudentGradesPage.tsx";
import { TeacherGradesPage } from "./TeacherGradesPage.tsx";

export const GradesPage = () => {
    const {isTeacher} = useUserStore();

    return(isTeacher ? <TeacherGradesPage/> : <StudentGradesPage/>);
}