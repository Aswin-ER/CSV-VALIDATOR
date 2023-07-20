import React, { useState } from 'react'
import papaparse from 'papaparse';

function FilePicker({ onTableDataChange }) {

    const [first, setfirst] = useState('')

    // Event handler for file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        // Convert CSV to JSON Using Papaparse Library
        papaparse.parse(file, {
            header: true,
            complete: function (results) {
                console.log("papaparse worked", results);

                setfirst(results.data);

                //Callback function passed from the parent component 
                onTableDataChange(results.data);
            }
        });
    }

    return (
        <div className='flex justify-center flex-col items-center'>
            
            {
                
                first? <>
                {/* Label for the file input */}
                <label className="text-center text-lg font-medium mb-5 text-gray-300 " htmlFor="file_input">Upload a CSV file</label>
                {/* Disabled the input if already table has data*/}
                <input disabled onChange={handleFileUpload} className=" w-1/4 mb-10 text-center border border-gray-900 rounded-l-full cursor-pointer text-black" id="file_input" type="file" />
                </> 
                :
                <>
                <label className="text-center text-lg font-medium mb-5 text-gray-900 " htmlFor="file_input">Upload a CSV file</label>
                <input onChange={handleFileUpload} className="bg-black w-1/4 mb-10 text-center border border-gray-900 rounded-l cursor-pointer text-white" id="file_input" type="file" />
                </>
            }
        </div>
    )
}

export default FilePicker
