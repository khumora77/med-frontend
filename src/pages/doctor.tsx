
import DoctorSidebar from '../components/navigation/doctorSidebar'

const Doctor = () => {
  return (
   <div className="w-[90%] mx-auto h-full grid grid-cols-4">
        <div className="w-full h-full col-span-1">
          <DoctorSidebar />
          <div className="text-black">Doctor Panel</div>
        </div>
      </div>
  )
}

export default Doctor