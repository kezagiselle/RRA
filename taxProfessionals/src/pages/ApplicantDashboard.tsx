import React from 'react';
import { FileText, Bell, LogOut, Menu, X } from 'lucide-react';
import rra from "../imgs/rra.png";

export default function ApplicantDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  const statusCards = [
    { label: 'Payment Pending', count: 0, highlighted: true },
    { label: 'Under review', count: 1 },
    { label: 'Approved', count: 0 },
    { label: 'Rejected', count: 0 },
    { label: 'Missing information', count: 0 },
    { label: 'Failed', count: 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={rra} 
            alt="RRA Logo" 
            className="h-10 object-contain" 
          />
          <span className="text-lg font-semibold text-gray-800">Dashboard</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-200"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex mt-4">
      
        <aside className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white min-h-screen border-r border-gray-200 flex flex-col
          transition-transform duration-300 ease-in-out lg:transition-none
        `}>
          
          <div className="p-4 border-b border-gray-200">
            <img 
              src={rra} 
              alt="RRA Logo" 
              className="h-16 lg:h-20 object-contain mx-auto lg:mx-0" 
            />
          </div>

          
          <nav className="p-4 space-y-2 flex-1">
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-amber-200 rounded-lg text-gray-800">
              <FileText size={20} />
              <span className="text-sm lg:text-base">Overview</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              <FileText size={20} />
              <span className="text-sm lg:text-base">Draft Applications</span>
            </button>
        
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              <span className="text-sm lg:text-base">Notifications</span>
            </button>
          </nav>

        
          <div className="p-4 border-t border-gray-200 mt-auto">
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition duration-200">
              <LogOut size={20} />
              <span className="text-sm lg:text-base">Log Out</span>
            </button>
          </div>
        </aside>

        
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        
        <main className="flex-1 p-4 lg:p-8 w-full">
        
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4 mb-6 lg:mb-8">
            {statusCards.map((card, index) => (
              <div
                key={index}
                className={`${
                  card.highlighted
                    ? 'bg-amber-200 text-gray-800' 
                    : 'bg-white text-gray-800'
                } rounded-lg p-4 lg:p-6 shadow-sm text-center border border-gray-200 hover:bg-amber-100 hover:border-amber-300 transition duration-200 cursor-pointer`}
              >
                <div className="text-2xl lg:text-3xl font-bold mb-1 lg:mb-2">{card.count}</div>
                <div className={`text-xs lg:text-sm ${card.highlighted ? 'text-gray-800' : 'text-gray-600'}`}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[
                      'Reference Number',
                      'Service Name',
                      'Service Price',
                      'Amount Paid',
                      'Applied at',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-gray-600 border-l border-gray-200 last:border-r-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center py-8 lg:py-12 text-gray-500 border-t border-gray-200">
                      No records found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-t border-gray-200 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2 lg:space-x-4 order-2 sm:order-1">
                <span className="text-xs lg:text-sm text-gray-600">Rows per page:</span>
                <select className="border rounded px-2 py-1 text-xs lg:text-sm">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="order-1 sm:order-2">
                <span className="text-xs lg:text-sm text-gray-600">0-0 of 0</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}