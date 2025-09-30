import React from 'react'
import Sidebar from '../components/navigation/adminSidebar'


const Admin = () => {
  return (
       <div className="w-[90%] mx-auto h-full grid grid-cols-4">
      <div className="w-full h-full col-span-1">
        <Sidebar />
      <div className='text-black'>Admin Panel</div>
      </div>
    </div>
  )
}

export default Admin