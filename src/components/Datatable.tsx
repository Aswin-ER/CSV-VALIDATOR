import React, { FC, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TabledataItems {
    [key: string]: any;
}

interface DatatableProps {
    tableData: TabledataItems[];
}

const Datatable: FC<DatatableProps> = ({ tableData }) => {

    // State to track the edited data
    const [editedData, setEditedData] = useState<TabledataItems[]>(tableData);

    const [newRowData, setNewRowData] = useState<TabledataItems>({});

    // Extracting headers from the first row of the table data
    const headers = Object.keys(editedData[0]);

    // Converting table data (JSON) to CSV format (array of arrays)
    const csvData = editedData.map((row) => {
        return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value]));
    });


    // Function to validate the name field
    const isNameValid = (name: any): boolean => {

        // Name should not start with a number
        if (/^\d/.test(name)) return false;

        // Name should not contain any special characters (allow only alphabets and spaces)
        if (!/^[A-Za-z\s]+$/.test(name)) return false;

        // Name should contain a minimum of 3 characters
        if (name?.length < 3) return false;

        return true;
    };

    // Function to validate the phone number field
    const isPhoneNumberValid = (phoneNumber: any): boolean => {
        // Assuming Indian phone numbers are 10 digits long and start with 7, 8, or 9
        return /^[789]\d{9}$/.test(phoneNumber);
    };


    // Function to handle data editing
    const handleEditData = (index: number, header: string, value: string) => {
        // Make a copy of the edited data to avoid directly modifying the state
        const updatedData = [...editedData];


        // Validate the new value
        if (header === 'Name' && !isNameValid(value)) {
            if (/^\d/.test(value)) return toast.error('Name should not start with a number')
            if (!/^[A-Za-z\s]+$/.test(value)) return toast.error('Name should not contain any special characters')
            if (value?.length < 3) return toast.error('Name should contain a minimum of 3 characters')

        } else if (header === 'Phone' && !isPhoneNumberValid(value)) {
            console.log(value,"phone value");
            return toast.error('Phone number should only contain numbers and 10 digit long')
        }

        // Update the edited data and validation errors state
        updatedData[index][header] = value;
        setEditedData(updatedData);
        toast.success('Updated entry');
    };

    // Function to handle entry deletion with confirmation dialog
    const handleDeleteEntry = (index: number) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            // Make a copy of the edited data to avoid directly modifying the state
            const updatedData = [...editedData];
            updatedData.splice(index, 1);
            setEditedData(updatedData);
            toast.success("Deleted entry")
        }
    };

    const handleAddNewRow = () => {
        // Check if the new row data is valid before adding
        for (const header of Object.keys(newRowData)) {
            if (header === 'Name' && !isNameValid(newRowData[header])) {
                if (/^\d/.test(newRowData[header])) return toast.error('Name should not start with a number')
                if (!/^[A-Za-z\s]+$/.test(newRowData[header])) return toast.error('Name should not contain any special characters')
                if (newRowData[header]?.length < 3) return toast.error('Name should contain a minimum of 3 characters')
                
            }
            
            if (header === 'Phone' && !isPhoneNumberValid(newRowData[header])) {
                return toast.error('Phone number should only contain numbers and 10 digit long')
            }
        }

        const updatedData = [...editedData];
        updatedData.push(newRowData);

        setNewRowData({});
        setEditedData(updatedData);
        toast.success('New row added');
    };

    const handleNewRowInputChange = (header: string, value: string | number) => {
        // Update the new row data state when the user enters data in the input fields
        setNewRowData({ ...newRowData, [header]: value });
    };


    return (
        <>
            {/* Rendering the table */}
            <div className="flex flex-col mx-auto shadow-2xl">
                <div className="overflow-x-auto mobile:mx-12 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                            <table className="min-w-full text-center text-sm font-light">
                                <thead className="border-b bg-neutral-800 font-medium text-white dark:border-neutral-500 dark:bg-neutral-900">
                                    <tr>

                                        {/* Rendering table headers */}
                                        {headers.map((header) => (
                                            <th key={header} scope="col" className="px-6 py-4">
                                                {header}
                                            </th>
                                        ))}
                                        <th scope="col" className="px-6 py-4">
                                            Delete
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {/* Rendering table rows */}
                                    {editedData.map((row: any, index: number) => {

                                        // Check if the name and phone number are valid
                                        const isNameValidated = isNameValid(row['Name']);
                                        const isPhoneNumberValidated = isPhoneNumberValid(row['Phone']);

                                        return (
                                            <tr key={index} className='border-b dark:border-neutral-500'>
                                                {headers.map((header) => (
                                                    <td key={`${index}-${header}`} className={`whitespace-nowrap px-6 py-4 font-medium ${header === 'Name' && !isNameValidated ? 'text-red-600' : ''} ${header === 'Phone' && !isPhoneNumberValidated ? 'text-red-600' : ''}`}
                                                        contentEditable
                                                        onBlur={(e) => handleEditData(index, header, e.target.textContent)}>
                                                        {row[header]}
                                                    </td>
                                                ))}
                                                <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                    <button onClick={() => handleDeleteEntry(index)} className="text-black-600 bg-red-500 p-2">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add new Row */}
            <div className="mt-5 lg:flex lg:justify-center lg:flex-row mobile:flex mobile:mx-auto mobile:w-1/2 mobile:flex-col">
                {headers.map((header) => (
                    <input
                        key={header}
                        type="text"
                        className="border-2 border-gray-300 p-2 lg:w-40 mr-3 my-1 mobile:my-2"
                        placeholder={header}
                        value={newRowData[header] || ''}
                        onChange={(e) => handleNewRowInputChange(header, e.target.value)}
                    />
                ))}
            </div>
            <div className="mt-5 flex justify-center">
                <button onClick={handleAddNewRow} className="btn bg-black h-10 p-2  text-white font-medium mr-3">
                    Add New Row
                </button>

                {/* CSVLink component to create a download link for the CSV file */}
                <CSVLink data={csvData} filename={'data.csv'} className="btn text-center bg-black p-2 text-white font-medium mb-20">
                    Download CSV
                </CSVLink>
            </div>
        </>
    );
};

export default Datatable;
