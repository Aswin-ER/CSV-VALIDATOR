import Datatable from '@/components/Datatable';
import FilePicker from '@/components/FilePicker';
import React, { useState,FC } from 'react';

interface Tabledata {
  [key: string]: string | number;
}

const Home: FC = ()=> {
  const [tableData, setTableData] = useState<Tabledata>();

  // Receive the parsed table data from the child component and update the state.
  const handleTableDataChange = (data: Tabledata | undefined) => {
    setTableData(data);
  };

  return (
    <React.Fragment>
      <div className="w-full lg:pt-20 mobile:pt-14 tablet:pt-18 flex justify-center align-middle flex-col">
        <h3 className="text-center lg:mb-6 mobile:mb-4 lg:text-4xl mobile:text-2xl tablet:text-4xl font-serif text-gray-900 font-bold">
          CSV <span className="text-red-500">VALIDATOR</span>
        </h3>

        {/* Render the FilePicker component with the handleTableDataChange callback passed as a prop */}
        <FilePicker onTableDataChange={handleTableDataChange} />

        {/* Use conditional rendering to show content based on tableData */}
        {tableData ? (
           <div className="w-full lg:w-8/12" style={{ margin: '0 auto' }}>
            <Datatable tableData={tableData} />
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            <p className="text-center text-gray-600">Upload a CSV file to see the table data</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Home;
