import { useState } from "react"
import TagInput from "../../components/Input/TagInput"
import { MdClose } from "react-icons/md";
import axoisInstance from "../../utils/axoisInstance";


const AddEditNotes = ({onClose , type , noteData , getAllNotes , handleOpenToast}) => {

    const [title, setTitle] = useState( noteData?.title ||"");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || [])
    const [error , setError] = useState("");

    const handleAddNote = () => {
        if(!title) {
            setError("Please enter title")
            return
        }
        else if(!content) {
            setError("Please enter content")
            return
        }
        else if(!tags) {
            setError("Please enter tags")
            return
        }
        setError("");

        if(type == 'edit'){
            editNotes();
        }
        else{
            addNewNotes();
        }
    }

    const addNewNotes = async () => {
        try{
            const response = await axoisInstance.post("/addNotes" ,{
                title,
                content,
                tags
            })

            if(response.data && response.data.note) {
                handleOpenToast("Note Added Successfully")
                getAllNotes();
                onClose();
            }
        } catch (error) {
            if(
                error.response && 
                error.response.data && 
                error.response.data.message
            ) {
                setError(error.response.data.message);
            }
        }
    }
    const editNotes = async () => {
        const noteId = noteData._id;
        try{
            const response = await axoisInstance.put("/editNotes/" + noteId ,{
                title,
                content,
                tags
            })

            if(response.data && response.data.note) {
                handleOpenToast("Note Updated Successfully")
                getAllNotes();
                onClose();
            }
        } catch (error) {
            if(
                error.response && 
                error.response.data && 
                error.response.data.message
            ) {
                setError(error.response.data.message);
            }
        }
    }

    return (
        <div className="relative">

            <button
                className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover: bg-slate-50"
                onClick={onClose}
            >
                <MdClose className="text-xl text-slate-400" />
            </button>
            <div className="flex flex-col gap-2">
                <label className="input-label">Title</label>
                <input
                    type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="Go to gym at 5"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                />
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">CONTENT</label>
                <textarea
                    type="text"
                    className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                    placeholder="content"
                    rows={10}
                    value={content}
                    onChange={(e) => { setContent(e.target.value) }}
                />
            </div>

            <div className="mt-3">
                <label className="input-label">Tags</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && (
                <div className="text-red-500 text-xs pt-4">{error}</div>
            )}

            <button className="btn-primary font-medium p-3 mt-5" onClick={() => { handleAddNote()}}>
                {type === 'edit' ? "UPDATE" : "ADD"} 
            </button>
        </div>
    )
}

export default AddEditNotes