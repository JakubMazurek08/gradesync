import { useState } from "react";

export const WheelDelete = () => {
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [message, setMessage] = useState("");

  const deleteData = async () => {
    if (!studentId || !courseId) {
      setMessage("Please provide both student ID and course ID.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/wheel/${studentId}/${courseId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        setMessage("Deleted successfully!");
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to delete.");
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
  };

  return (
    <div>
      <h3>Delete from wheel</h3>
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
      
      <button onClick={deleteData}>Delete</button>

      {message && <p>{message}</p>}
    </div>
  );
};
