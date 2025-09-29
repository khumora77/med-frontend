import React from 'react'
import Sidebar from '../components/navigation/sidebar'

const Admin = () => {
  return (
       <div className="w-[90%] mx-auto h-full grid grid-cols-4">
      <div className="w-full h-full col-span-1">
        <Sidebar />
      </div>
   
    </div>
  )
}

export default Admin