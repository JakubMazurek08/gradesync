import {useEffect} from "react";

export const CoursesList = () => {
    useEffect(() => {
        const URL = import.meta.env.VITE_URL + "grade/courses";
        console.log(URL);
        fetch(URL,
            {
                method: "GET",
                credentials: "include",
            }
        ).then(res => res.json().then(data => {
            console.log(data);}));
    }, []);

    return <h1>sigma</h1>
}