import React from 'react';
import { FileText, Bell, LogOut } from 'lucide-react';
import rra from "../imgs/rra.png";

export default function ApplicantDashboard() {
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
      <div className="flex mt-4">
    
        <aside className="w-64 bg-white min-h-screen border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <img 
              src={rra} 
              alt="RRA Logo" 
              className="h-20 object-contain" 
            />
          </div>

          <nav className="p-4 space-y-2 flex-1">
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-amber-200 rounded-lg text-gray-800">
              <FileText size={20} />
              <span>Overview</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              <FileText size={20} />
              <span>Draft Applications</span>
            </button>
        
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              <span>Notifications</span>
            </button>
          </nav>

        
          <div className="p-4 border-t border-gray-200 mt-auto">
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition duration-200">
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

    
        <main className="flex-1 p-8">
          
          <div className="grid grid-cols-6 gap-4 mb-8">
            {statusCards.map((card, index) => (
              <div
                key={index}
                className={`${
                  card.highlighted
                    ? 'bg-amber-200 text-gray-800' 
                    : 'bg-white text-gray-800'
                } rounded-lg p-6 shadow-sm text-center border border-gray-200 hover:bg-amber-100 hover:border-amber-300 transition duration-200 cursor-pointer`}
              >
                <div className="text-3xl font-bold mb-2">{card.count}</div>
                <div className={`text-sm ${card.highlighted ? 'text-gray-800' : 'text-gray-600'}`}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

    
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
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
                        className="text-left px-6 py-4 text-sm font-medium text-gray-600 border-l border-gray-200 last:border-r-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500 border-t border-gray-200">
                      No records found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            
            <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select className="border rounded px-2 py-1 text-sm">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span className="text-sm text-gray-600">0-0 of 0</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}