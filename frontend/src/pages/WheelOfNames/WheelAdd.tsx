import { useState, useEffect } from "react";

export const WheelAdd = () => {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const response = await fetch("http://localhost:3000/wheel/:student_id/:course_id")
    
    })
}


