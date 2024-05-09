import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashArrowUp, faEdit } from '@fortawesome/free-solid-svg-icons';
import { url } from '../../api/api';
import Loader from '../../common/Loader';

const StaffPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [staffIdToDelete, setStaffIdToDelete] = useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const navigate = useNavigate();
  

  const handleAddStaffClick = () => {
    navigate('/staff/addstaff');
  };

  const handleEditClick = (row) => {
    navigate(/editstaff/${row.staff_id}, { state: { staffData: row } });
  };

  const handleDeleteClick = (staffId) => {
    setStaffIdToDelete(staffId);
    setDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(${url}deleteStaff, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'jwt': localStorage.getItem('token'),
        },
        body: JSON.stringify({ staffId: staffIdToDelete }), // Change staffId to _id
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete staff');
      }
  
      // Update the records after deletion
      const updatedRecords = records.filter(record => record.staff_id !== staffIdToDelete);
      setRecords(updatedRecords);
  
      // Close delete confirmation dialog
      setDeleteConfirmation(false);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting staff:', error);
      setError('Failed to delete staff. Please try again later.');
    }
  };
  

  const handleCancelDelete = () => {
    // Close delete confirmation dialog
    setDeleteConfirmation(false);
  };

  const handleFilter = (event) => {
    const { value } = event.target;
    const newData = records.filter((row) =>
      row.staff_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRecords(newData);
  };
  

  useEffect(() => {
    // Initialize filteredRecords with all records initially
    setFilteredRecords(records);
  }, [records]);
  
  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const response = await fetch(${url}staffList, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'jwt': localStorage.getItem('token'),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setRecords(data.staffList);
      setTimeout(() => {
        setLoading(false); // Set loading to false
      }, 1000); // Set loading to false
    } catch (error) {
      console.error('Error fetching data: ', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const columns = [
    {
      name: 'STAFF NAME',
      selector: (row) => row.staff_name,
      sortable: true,
    },
    {
      name: 'STAFF ID',
      selector: (row) => row.staff_id,
      sortable: true,
    },
    {
      name: 'DEPARTMENT',
      selector: (row) => row.department,
      sortable: true,
    },
    {
      name: 'ROLE',
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: 'MOBILE',
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "ACTION",
      cell: (row) => (
        <div>
          <div className='mr-3' style={{ textAlign: "center", cursor: "pointer", color: "green", display: 'inline' }} onClick={() => handleEditClick(row)}>
            <FontAwesomeIcon icon={faEdit} />
          </div>
          <div style={{ textAlign: "center", cursor: "pointer", color: "red", display: 'inline' }} onClick={() => handleDeleteClick(row._id)}>
            <FontAwesomeIcon icon={faTrashArrowUp} />
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];


  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="relative">
    {/* Show loader covering the entire page when loading */}
    
     {loading &&
     <Loader positionLeftValue="150" />
     }
    <DefaultLayout>
      <Breadcrumb pageName="Staff" />
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark text-black  dark:text-white">
        <div className="container mt-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center ml-2">
              <Link
                to="/staff/addstaff"
                onClick={handleAddStaffClick}
                className="py-2 px-4 bg-primary  text-white  dark:text-white rounded-md pb-2 mx-2 my-2 shadow-md hover:bg-primary-dark transition duration-300"
              >
                <span className='font-bold'>+ </span>Add Staff
              </Link>
              <input type="text" onChange={handleFilter} className="py-2 px-4 bg-white border dark:border-strokedark dark:bg-boxdark border-gray-300 rounded-md shadow-md focus:outline-none focus:ring focus:border-blue-300" placeholder='Search'/>
            </div>
          </div>
        </div>
        
            <DataTable columns={columns} data={filteredRecords} fixedHeader pagination highlightOnHover striped />
          
        </div>
      {deleteConfirmation && (
        <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-md p-8">
            <p className="mb-4">Are you sure?</p>
            <div className="flex justify-center">
              <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-500 text-white rounded-md mr-4">Yes</button>
              <button onClick={handleCancelDelete} className="px-4 py-2 bg-blue-500 text-white rounded-md">No</button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
    </div>
  );
};

export default StaffPage;