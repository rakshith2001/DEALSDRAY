import { useEffect ,useState} from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEmployeeContext } from '../hooks/useEmployeeContext';



const EmployeeList = () => {
    const { user } = useAuthContext();
    const { employees, dispatch } = useEmployeeContext();
    const [filteredRecords, setFilteredRecords] = useState([]);

    const EditButton = () => <button type="button">Edit</button>;
    
    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await fetch('http://localhost:4500/api/employee', {
                headers: { 'Authorization': `Bearer ${user.token}` },
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_EMPLOYEES', payload: json });
            }
        };

        if (user) {
            fetchEmployees();
        }
    }, [dispatch, user]);

    const columns = [
        {
            name: 'Unique Id',
            selector: row => row._id,
        },
        {
            name: 'Name',
            selector: row => row.name,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Mobile No',
            selector: row => row.mobile,
        },
        {
            name: 'Designation',
            selector: row => row.designation,
        },
        {
            name: 'Gender',
            selector: row => row.gender,
        },
        {
            name: 'Course',
            selector: row => row.course,
        },
        {
            name: 'Created At',
            selector: row => row.created,
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => (
                <>
                    <Link to={`/editemployee/${row._id}`}><EditButton /></Link>
                    <DeleteButton id={row._id} />
                </>
            ),
        },
    ];

    

    const DeleteButton = ({ id }) => {
        const handleClick = async () => {
            if (!user) {
                return;
            }
    
            const response = await fetch(`http://localhost:4500/api/employee/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
    
            console.log('Response status:', response.status);
    
            const json = await response.json();
    
            if (response.ok) {
                dispatch({ type: 'DELETE_EMPLOYEE', payload: json });
            }
        };
    
        return <button onClick={handleClick} type="button">Delete</button>;
    };
    

    const data = employees.map(employee => ({
        _id: employee._id,
        name: employee.f_Name,
        email: employee.f_Email,
        mobile: employee.f_Mobile,
        designation: employee.f_Designation,
        gender: employee.f_gender,
        course: employee.f_Course,
        created: employee.f_Createdate,
    }));



    const handleFilter = (event) => {
        const { value } = event.target;
        const newData = employees.filter((row) =>
          row.f_Name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredRecords(newData);
      };

      useEffect(() => {
        // Initialize filteredRecords with all records initially
        setFilteredRecords(employees);
      }, [employees]);
      

   

    return (
        <div>
            <div className="pseudo-nav">
                <h1>Employee List</h1>
                <Link to='/createemployee'><button className="material-symbols-outlined" >Create Employee</button></Link>
                <input type="text" onChange={handleFilter} placeholder="Search Employee" className='search' />
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                />
            </div>
        </div>
    );
};

export default EmployeeList;
