import Datatable from '@/components/Datatable';
import FilePicker from '@/components/FilePicker';
import React,{ useState } from 'react';

export default function Home() {

  const [tableData, setTableData] = useState([]);

  //Receive the parsed table data from the child component and update the state.
  const handleTableDataChange = (data) => {
    setTableData(data);
  };

  return (
    <React.Fragment >
      <div className='pt-24 flex justify-center align-middle flex-col'>
        <h3 className='text-center mb-12 lg:text-4xl  font-serif text-gray-900 font-bold '>CSV <span className='text-red-500'>VALIDATOR</span></h3>

      {/* Render the FilePicker component with the 'handleTableDataChange' callback passed as a prop */}
      <FilePicker onTableDataChange={handleTableDataChange}/>

      {/* Conditional rendering: Display the DataTable component if 'tableData' is not empty */}
      {tableData.length > 0 && <Datatable tableData={tableData}/>}
      </div>
    </React.Fragment>
  )
}
