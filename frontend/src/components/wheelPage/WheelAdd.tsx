import { useState, useEffect } from "react";

export const WheelAdd = () => {
    const [student_id, setStudentId] = useState('');
    const [course_id, setCourseId] = useState('');
    const [shouldSend, setShouldSend] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const addData = async () => {
            if (!shouldSend) return;

            const payload = { student_id, course_id };

            try {
                const response = await fetch(`http://localhost:3000/wheel/${student_id}/${course_id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    setMessage("Added successfully!");
                } else {
                    setMessage("Failed to add.");
                }
            } catch (error) {
                setMessage("Fatal error.");
            } finally {
                setShouldSend(false); // Resetowanie flagi
            }
        };

        addData();
    }, [shouldSend]);

    return (
        <div>
            <h3>Add to wheel:</h3>

            <input
                type="text"
                placeholder="Type student_id"
                value={student_id}
                onChange={(e) => setStudentId(e.target.value)}
            />
            <br />

            <input
                type="text"
                placeholder="Type course_id"
                value={course_id}
                onChange={(e) => setCourseId(e.target.value)}
            />
            <br />

            <button onClick={() => setShouldSend(true)}>Add</button>

            {message && <p>{message}</p>}
        </div>
    );
};