import { ProfileInfo } from "../Cards/ProfileInfo"
import { useNavigate } from "react-router-dom"
import { SearchBar } from "../SearchBar/SearchBar"
import { useState } from "react"

export const Navbar = () => {

  const navigate = useNavigate()
  const onLogout = () => {
    navigate("/login")
  }

  const [searchQuery, setSearchQuery] = useState();

  const handleSearch = () => {

  }

  const onClearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="bg-white flex justify-between px-4 py-2 drop-shadow h-[3.75rem]">
      <h2 className="text-xl font-medium py-2">Notes</h2>

      <SearchBar
        value={searchQuery}
        onChange={(e) => { setSearchQuery(e.target.value) }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo onLogout={onLogout} />
    </div>
  )
}
