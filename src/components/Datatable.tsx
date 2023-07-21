import React, { FC, useState } from 'react';
import { CSVLink } from 'react-csv';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TabledataItems {
    [key: string]: string | number;
}

interface DatatableProps {
    tableData: TabledataItems[];
}

const Datatable: FC<DatatableProps> = ({ tableData }) => {

    // State to track the edited data
    const [editedData, setEditedData] = useState<TabledataItems[]>(tableData);

    // Extracting headers from the first row of the table data
    const headers = Object.keys(editedData[0]);

    // Converting table data (JSON) to CSV format (array of arrays)
    const csvData = editedData.map((row) => {
        return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value]));
    });

    // Function to validate the name field
    const isNameValid = (name: string): boolean => {

        // Name should not start with a number
        if (/^\d/.test(name)) return false;

        // Name should not contain any special characters (allow only alphabets and spaces)
        if (!/^[A-Za-z\s]+$/.test(name)) return false;

        // Name should contain a minimum of 3 characters
        if (name?.length < 3) return false;

        return true;
    };

    // Function to validate the phone number field
    const isPhoneNumberValid = (phoneNumber: string): boolean => {
        // Assuming Indian phone numbers are 10 digits long and start with 7, 8, or 9
        return /^[789]\d{9}$/.test(phoneNumber);
    };

    // Function to handle data editing
    const handleEditData = (index: number, header: string, value: string) => {
        // Make a copy of the edited data to avoid directly modifying the state
        const updatedData = [...editedData];

        if (value !== null) {
            if (header === 'Name' && !isNameValid(value)) {
                return toast.error("Invalid Name")
            }

            if (header === 'Phone' && !isPhoneNumberValid(value)) {
                return toast.error("Invalid phone number")
            }
        }
        updatedData[index][header] = value;
        setEditedData(updatedData);
        toast.success("Updated entry")
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
                                            <tr key={index} className={`border-b dark:border-neutral-500 ${row['Name'] && row['Phone'] && (!isNameValidated || !isPhoneNumberValidated) ? 'bg-red-200' : ''}`}>
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
            <div className="mt-10 text-center">

                {/* CSVLink component to create a download link for the CSV file */}
                <CSVLink data={csvData} filename={'data.csv'} className="btn text-center bg-black p-2 text-white font-medium mb-20">
                    Download CSV
                </CSVLink>
            </div>
        </>
    );
};

export default Datatable;
