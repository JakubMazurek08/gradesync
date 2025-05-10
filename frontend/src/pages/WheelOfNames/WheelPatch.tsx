import { useState } from "react";

export const WheelPatch = () => {
  const [studentId, setStudentId] = useState("");
  const [new_student_id, setNewStudentId] = useState("");
  const [message, setMessage] = useState("");

  const patchData = async () => {
    if (!studentId || !new_student_id) {
      setMessage("Please provide both student ID and course ID.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/wheel/${studentId}/${new_student_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        setMessage("Patched successfully!");
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to patched.");
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
  };

  return (
    <div>
      <h3>Patch</h3>
      <input
        type="text"
        placeholder="Type student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Type new student ID"
        value={new_student_id}
        onChange={(e) => setNewStudentId(e.target.value)}
      />
      <br />
      
      <button onClick={patchData}>Patch</button>

      {message && <p>{message}</p>}
    </div>
  );
};




