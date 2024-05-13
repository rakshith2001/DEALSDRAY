import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEmployeeContext } from '../hooks/useEmployeeContext';

const EmployeeList = () => {
    const { user } = useAuthContext();
    const { employees, dispatch } = useEmployeeContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(employees);
    }, [employees]);

    const handleFilter = (event) => {
        const { value } = event.target;
        setSearchTerm(value);
        const newData = employees.filter((row) =>
            row.f_Name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(newData);
    };

    const columns = [
        {
            name: 'Unique Id',
            selector: row => row._id,
        },
        {
            name: 'Image',
            grow: 0,
            cell: row => <img height="84px" width="56px" alt={row.f_Image} src={`http://localhost:4500/images/${row.f_Image}`} />,
        },
        {
            name: 'Name',
            selector: row => row.f_Name,
        },
        {
            name: 'Email',
            selector: row => row.f_Email,
        },
        {
            name: 'Mobile No',
            selector: row => row.f_Mobile,
        },
        {
            name: 'Designation',
            selector: row => row.f_Designation,
        },
        {
            name: 'Gender',
            selector: row => row.f_gender,
        },
        {
            name: 'Course',
            selector: row => row.f_Course,
        },
        {
            name: 'Created At',
            selector: row => row.f_Createdate,
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => (
                <>
                    <Link to={`/editemployee/${row._id}`}><button style={{background:"grey", height:"25px"}}>Edit</button></Link>
                    <button style={{background:"red", height:"25px"}} onClick={() => handleDelete(row._id)}>Delete</button>
                </>
            ),
        },
    ];

    const handleDelete = async (id) => {
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

    return (
        <div>
            <div className="pseudo-nav">
                <h1>Employee List</h1>
                <Link to='/createemployee'>Create Employee</Link>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleFilter}
                    placeholder="Search Employee"
                />
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                />
            </div>
        </div>
    );
};

export default EmployeeList;
