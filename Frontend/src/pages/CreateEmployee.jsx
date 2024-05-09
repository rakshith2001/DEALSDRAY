import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEmployeeContext } from '../hooks/useEmployeeContext';

const CreateEmployee = () => {
    const { user } = useAuthContext();
    const { dispatch } = useEmployeeContext();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [designation, setDesignation] = useState('');
    const [gender, setGender] = useState('');
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])
  

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
          setCourses([...courses, value]);
        } else {
          setCourses(courses.filter((course) => course !== value));
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in');
            return;
        }

        const newEmployee = { f_Name:name, f_Email:email, f_Mobile:mobile, f_Designation:designation, f_gender:gender, f_Course:courses };
        const response = await fetch('http://localhost:4500/api/employee', {
            method: 'POST',
            body: JSON.stringify(newEmployee),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields || []);
        } else {
            // Reset form fields on successful submission
            setName('');
            setEmail('');
            setMobile('');
            setDesignation('');
            setGender('');
            setCourses([]);
            setError(null);
            setEmptyFields([]);
            dispatch({ type: 'CREATE_EMPLOYEE', payload: json }); // Assuming this is your dispatch action
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Create Employee</h2>
    <div style={{ marginBottom: '10px', width: '100%' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '8px' }} />
    </div>

    <div style={{ marginBottom: '10px', width: '100%' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px' }} />
    </div>

    <div style={{ marginBottom: '10px', width: '100%' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Mobile No:</label>
        <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} style={{ width: '100%', padding: '8px' }} />
    </div>

    <div style={{ marginBottom: '10px', width: '100%' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Designation:</label>
        <select value={designation} onChange={(e) => setDesignation(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="">Select...</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
        </select>
    </div>

    <div style={{ marginBottom: '10px', width: '100%' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Gender:</label>
        <div style={{ display: 'flex', gap: '10px' }}>
            <label style={{ marginRight: '20px' }}>
                <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={() => setGender('Male')} />
                Male
            </label>
            <label>
                <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={() => setGender('Female')} />
                Female
            </label>
        </div>
    </div>

    <div style={{ marginBottom: '10px', width: '100%' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Courses:</label>
        <div style={{ display: 'flex', gap: '10px' }}>
            <label style={{ marginRight: '20px' }}>
                <input type="checkbox" value="MCA" checked={courses.includes('MCA')} onChange={handleCheckboxChange} />
                MCA
            </label>
            <label style={{ marginRight: '20px' }}>
                <input type="checkbox" value="BCA" checked={courses.includes('BCA')} onChange={handleCheckboxChange} />
                BCA
            </label>
            <label>
                <input type="checkbox" value="BSC" checked={courses.includes('BSC')} onChange={handleCheckboxChange} />
                BSC
            </label>
        </div>
    </div>

    <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>Submit</button>
    {error && <div className="error" style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</div>}
</form>
    );
}

export default CreateEmployee;
