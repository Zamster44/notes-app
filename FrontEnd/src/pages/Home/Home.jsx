import NoteCards from "../../components/Cards/NoteCards"
import { Navbar } from "../../components/Navbar/Navbar"
import { MdAdd } from "react-icons/md"
import AddEditNotes from "./AddEditNotes"
import { useState } from "react"
import Modal from "react-modal"

export const Home = () => {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShow: false,
    type: "add",
    data: null
  });

  return (
    <div className="">
      <Navbar />

      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          <NoteCards
            title="Meeting at 10th of april"
            date="2nd april 2024"
            content="Have to attend an important meeting at 10th of april"
            tags="#Meeting"
            isPinned={true}
            onEdit={() => { }}
            onDelete={() => { }}
            onPinNote={() => { }}
          />

        </div>
      </div>

      <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10" onClick={() => {
        setOpenAddEditModel({
          isShow: true,
          type: "add",
          data: null
        })
      }}>
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModel.isShow}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          }
        }}
        contentLabel=" "
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-hidden"
      >
        <AddEditNotes
          onClose={() => {
            setOpenAddEditModel({
              isShow: false,
              type: "add",
              data: null
            })
          }}
          type={openAddEditModel.type}
          noteData={openAddEditModel.data}
          />
      </Modal>
    </div>
  )
}
