import { useState } from "react";

export const WheelPut = () => {
    const [studentId, setStudentId] = useState("");
    const [new_student_id, setNewStudentId] = useState("");
    const [courseId, setCourseId] = useState("");
    const [message, setMessage] = useState("");

    const putData = async () => {
        if (!studentId || !new_student_id || !courseId) {
            setMessage("Please provide both student ID and course ID.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/wheel/${studentId}/${courseId}/${new_student_id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.ok) {
                setMessage("Putted successfully!");
            } else {
                const data = await response.json();
                setMessage(data.error || "Failed to put.");
            }
        } catch (error) {
            setMessage(`Error: ${error}`);
        }
    };

    return (
        <div>
            <h3>Put</h3>
            <input
                type="text"
                placeholder="Type student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
            />

            <br />

            <input
                type="text"
                placeholder="Type course ID"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
            />

            <br />

            <input
                type="text"
                placeholder="Type new student ID"
                value={new_student_id}
                onChange={(e) => setNewStudentId(e.target.value)}
            />
            <br />

            <button onClick={putData}>Put</button>

            {message && <p>{message}</p>}
        </div>
    );
};