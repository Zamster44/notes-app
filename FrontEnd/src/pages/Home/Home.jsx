import NoteCards from "../../components/Cards/NoteCards"
import { Navbar } from "../../components/Navbar/Navbar"
import { MdAdd } from "react-icons/md"
import AddEditNotes from "./AddEditNotes"
import { useEffect, useState } from "react"
import Modal from "react-modal"
import { useNavigate } from "react-router-dom"
import axoisInstance from "../../utils/axoisInstance"
import Toast from "../../components/ToastMessage/Toast"
import EmptyCard from "../../components/EmptyCard/EmptyCard"

export const Home = () => {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShow: false,
    type: "add",
    data: null
  });

  const [toastMeassage, setToastMessage] = useState({
    isShow: false,
    type: "add",
    message: ""
  })

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleCloseToast = () => {
    setToastMessage({
      isShow: false,
      message: "",
    })
  }

  const handleOpenToast = (message, type) => {
    setToastMessage({
      isShow: true,
      message,
      type
    })
  }

  const handleEdit = (noteDetails) => {
    setOpenAddEditModel({
      isShow: true,
      data: noteDetails,
      type: "edit"
    })
  }

  const getUserInfo = async () => {
    try {
      const response = await axoisInstance.get("/getUser");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //get all user
  const getAllNotes = async () => {
    try {
      const response = await axoisInstance.get("/getAllNote");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occured.")
    }
  }

  //delete a note
  const deleteNote = async (note) => {
    const noteId = note._id;
    try {
      const response = await axoisInstance.delete("/deleteNotes/" + noteId,)

      if (response.data && response.data.note) {
        handleOpenToast("Note Deleted Successfully", 'delete')
        getAllNotes();
      }
    } catch (error) {
      handleOpenToast("Someting went wrong")
      console.log(error)
    }
  }

  const updatePin = async (data) => {
    const noteId = data._id;
    const isPinned = !(data.isPinned)
    try {
      const response = await axoisInstance.put("/updateNotesPinned/" + noteId, {
        isPinned
      })

      if (response.data && response.data.note) {
        handleOpenToast("Note Updated Successfully")
        getAllNotes();
      }
    } catch (error) {
      handleOpenToast("Someting went wrong")
      console.log(error)
    }
  }

  //search for a note
  const onSearchNote = async (query) => {
    try {
      const response = await axoisInstance.get("/searchNotes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleClearNotes = () => {
    setIsSearch(false);
    getAllNotes();
  }

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    return () => { }
  }, [])

  return (
    <div className="">
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearNotes={handleClearNotes} />

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allNotes.map((item) => (
              <NoteCards
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updatePin(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard message={isSearch ? "No Notes found" : "Start Making Notes"} />
        )}
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
          getAllNotes={getAllNotes}
          handleOpenToast={handleOpenToast}
        />
      </Modal>

      <Toast
        isShown={toastMeassage.isShow}
        message={toastMeassage.message}
        type={toastMeassage.type}
        onClose={handleCloseToast}
      />
    </div>
  )
}
