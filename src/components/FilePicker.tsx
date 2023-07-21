import React, { useState, FC } from 'react'
import papaparse from 'papaparse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Tabledata {
    [key: string]: string | number;
}

interface FilePickerProps {
    onTableDataChange: (data: Tabledata[]) => void;
}

const FilePicker: FC<FilePickerProps> = ({ onTableDataChange }: FilePickerProps) => {

    const [first, setfirst] = useState<string | number>('')

    // Event handler for file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file.type === 'text/csv') {

            // Convert CSV to JSON Using Papaparse Library
            papaparse.parse(file, {
                header: true,
                complete: function (results: any | null): void {
                    console.log("papaparse worked", results);

                    setfirst(results.data);

                    //Callback function passed from the parent component 
                    onTableDataChange(results.data);
                }
            });

        } else {

            toast.error("Please upload CSV file");
        }

    }

    return (
        <div className='flex justify-center flex-col items-center'>

            {

                first ? <>
                    {/* Label for the file input */}
                    <label className="text-center lg:text-lg mobile:text-sm lg:mb-5 mobile:mb-2 text-gray-300 " htmlFor="file_input">Upload a CSV file</label>
                    {/* Disabled the input if already table has data*/}
                    <input disabled onChange={handleFileUpload} className=" lg:w-1/4 mobile:w-54 mb-10 text-center border border-gray-900 rounded-l-full cursor-pointer text-black" id="file_input" type="file" />
                    <ToastContainer />
                </>
                    :
                    <>
                        <label className="text-center lg:text-lg mobile:text-sm font-medium lg:mb-5 mobile:mb-2 text-gray-900 hover:bg-gray-300 cursor-pointer" htmlFor="file_input">Upload a CSV file</label>
                        <input onChange={handleFileUpload} className="bg-black lg:w-1/4 mobile:w-54 mb-10 text-center border border-gray-900 rounded-l cursor-pointer text-white" id="file_input" type="file" />
                        <ToastContainer
                            position='bottom-center'
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="dark" />
                    </>
            }
        </div>
    )
}

export default FilePicker;
function getStaticPath() {
    throw new Error('Function not implemented.');
}

