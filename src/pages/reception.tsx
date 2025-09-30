import ReceptionSidebar from "../components/navigation/receptionSidebar"



const Admin = () => {
  return (
       <div className="w-[90%] mx-auto h-full grid grid-cols-4">
      <div className="w-full h-full col-span-1">
        <ReceptionSidebar />
      <div className='text-black'>Reception Panel</div>
      </div>
    </div>
  )
}

export default Admin