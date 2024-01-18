import React, { useState, useEffect } from 'react';
import "../styles/AvailableTeachersList.css";

const AvailableTeachersList = ({ studentId }) => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        // Fetch the available teachers when the component mounts
        const fetchTeachers = async () => {
            try {
                const response = await fetch('http://localhost:3001/available-teachers');
                const data = await response.json();
                setTeachers(data);
                console.log('Fetched teachers:', data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };

        fetchTeachers();
    }, []);

    const handleRequest = async (teacherId) => {
        console.log('Requesting teacher with teacher_id:', teacherId, 'and student_id:', studentId);

        try {
            const response = await fetch('http://localhost:3001/request-teacher', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, teacherId })
            });
            const data = await response.json();
            console.log(data.message);

            // Remove the teacher from the list after the request is made
            setTeachers(teachers.filter((teacher) => teacher.teacher_id !== teacherId));
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };

    return (
        <div className='AvailableTeachersList'>
            <h3>Available Teachers</h3>
            <ul>
                {teachers.map((teacher) => (
                    <li key={teacher.teacher_id}>
                        <div className='teacher-name'>{teacher.Firstname} {teacher.lastName}</div>
                        <button onClick={() => handleRequest(teacher.teacher_id)}>Request</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AvailableTeachersList;
