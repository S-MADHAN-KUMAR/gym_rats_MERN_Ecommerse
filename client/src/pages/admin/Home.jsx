import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Import jsPDF autoTable plugin
import * as XLSX from 'xlsx'; // Import SheetJS for Excel export

const Home = () => {
  const [filters, setFilters] = useState({ day: '', month: '', week: '', year: '', startDate: '', endDate: '' });
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState();


console.log(statistics);


  const fetchStatistics = async(req,res)=>{
    try {
      const res = await axios.get('http://localhost:3000/admin/get_sales_statistics')
      if(res.status === 200){
    setStatistics(res?.data?.statistics)
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(()=>{
    fetchStatistics()
  },[])


  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedFilters = { ...filters, [name]: value };

    if (name === 'day') {
      updatedFilters.startDate = value;
      updatedFilters.endDate = value;
    } else if (name === 'month') {
      const [year, month] = value.split('-');
      updatedFilters.startDate = `${year}-${month}-01`;
      updatedFilters.endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of the month
    } else if (name === 'week') {
      const weekStart = new Date(value);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // Adding 6 days to get the week's end date
      updatedFilters.startDate = weekStart.toISOString().split('T')[0];
      updatedFilters.endDate = weekEnd.toISOString().split('T')[0];
    } else if (name === 'year') {
      updatedFilters.startDate = `${value}-01-01`;
      updatedFilters.endDate = `${value}-12-31`;
    }

    setFilters(updatedFilters);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // If only startDate is selected and endDate is empty, copy startDate to endDate
    if (filters.startDate && !filters.endDate) {
      setFilters({ ...filters, endDate: filters.startDate });
    }

    try {
      console.log(filters);

      // Send filters as query parameters using params
      const response = await axios.post('http://localhost:3000/admin/sales_report', null, {
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate
        }
      });
      setReport(response.data);
      console.log(response?.data);
      
    } catch (error) {
      console.error('Error fetching sales report:', error);
      setError('Failed to fetch sales report. Please try again.');
    }
  };

  // Function to generate PDF report
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Sales Report', 14, 20);

    // Add table header
    const headers = ['Date', 'Order ID', 'Total Amount', 'Payment Method','Coupon ID','Discount Amount'];
    const rows = report.orders.map(sale => [
      sale.date, 
      sale.orderId, 
      sale.totalAmt, 
      sale.payMethod,
      sale.coupon || '-',
      sale.discount || '-'
    ]);

    // Add table to PDF
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 30, // Start below the title
    });

    // Add grand total
    doc.text(`Total Sales: ${report.grandTotal}`, 14, doc.lastAutoTable.finalY + 10);

    // Save the PDF
    doc.save('sales_report.pdf');
  };

  // Function to download Excel file
  const downloadExcel = () => {
    const salesData = report.orders.map(sale => ({
      'Date': sale.date,
      'Order ID': sale.orderId,
      'Total Amount': sale.totalAmt,
      'Payment Method': sale.payMethod,
    }));

    // Create a worksheet from the sales data
    const ws = XLSX.utils.json_to_sheet(salesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');

    // Save the Excel file
    XLSX.writeFile(wb, 'sales_report.xlsx');
  };

  return (
    <div className="p-6 mx-auto">

<div className="w-full flex justify-between mb-40">
<div className="border p-4 rounded-lg ">
  <h1 className='h1 text-3xl tracking-wider mb-6'>Total Revenue</h1>
  <p className='h2 text-6xl text-green-600'>₹ {statistics?.overallRevenue}</p>
</div>
<div className="border p-4 rounded-lg ">
  <h1 className='h1 text-3xl tracking-wider mb-6'>Total Orders</h1>
  <p className='h2 text-6xl text-blue-600'>{statistics?.overallSalesCount}</p>
</div>

<div className="border p-4 rounded-lg ">
  <h1 className='h1 text-3xl tracking-wider mb-6'>This Month sales</h1>
  <p className='h2 text-6xl text-green-600'>₹ {statistics?.
monthlyRevenue
}</p>
</div>
<div className="border p-4 rounded-lg ">
  <h1 className='h1 text-3xl tracking-wider mb-6'>Monthly Earning</h1>
  <p className='h2 text-6xl text-red-600'> {statistics?.monthlySalesCount}</p>
</div>
</div>


      <h1 className="text-4xl tracking-wider mb-6 h1">Sales Report</h1>
<div className="">
<form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md space-y-4 text-black">
        {/* Day */}
        <div className="form-group">
          <label htmlFor="day" className="block text-sm font-medium text-gray-700">Select Day</label>
          <input
            type="date"
            id="day"
            name="day"
            value={filters.day}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Month */}
        <div className="form-group">
          <label htmlFor="month" className="block text-sm font-medium text-gray-700">Select Month</label>
          <input
            type="month"
            id="month"
            name="month"
            value={filters.month}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Week */}
        <div className="form-group">
          <label htmlFor="week" className="block text-sm font-medium text-gray-700">Select Week</label>
          <input
            type="week"
            id="week"
            name="week"
            value={filters.week}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Year */}
        <div className="form-group">
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Select Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={filters.year}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Start Date */}
        <div className="form-group">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* End Date */}
        <div className="form-group">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generate Report
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {report && (
        <div className="mt-8 bg-white p-6 shadow-md rounded-md text-black">
          <h2 className="text-2xl font-semibold mb-4">Report Summary</h2>
          <p className="text-lg">Total Sales: <span className="font-bold">{report.grandTotal}</span></p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Sales Details</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-2 px-4 text-left text-sm font-semibold">Date</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold">Order ID</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold">Total Amount</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold">Payment Method</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold">Coupon ID</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold">Discount Amount</th>
                </tr>
              </thead>
              <tbody>
                {report.orders.map((sale) => (
                  <tr key={sale._id} className="border-b">
                    <td className="py-2 px-4 text-sm">{sale.date}</td>
                    <td className="py-2 px-4 text-sm">{sale.orderId}</td>
                    <td className="py-2 px-4 text-sm">{sale.totalAmt}</td>
                    <td className="py-2 px-4 text-sm">{sale.payMethod}</td>
                    <td className="py-2 px-4 text-sm">{sale.coupon || '-'}</td>
                    <td className="py-2 px-4 text-sm">{sale.discount || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={downloadPDF}
            className="mt-4 py-2 px-4 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Download PDF
          </button>
          <button
            onClick={downloadExcel}
            className="mt-4 py-2 px-4 bg-yellow-600 text-white font-medium rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Download Excel
          </button>
        </div>
      )}
</div>
    </div>
  );
};

export default Home;
