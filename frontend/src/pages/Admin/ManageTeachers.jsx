import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import moment from "moment"; // Import moment for date formatting
import {
  BanIcon,
  CheckSquare,
  EditIcon,
  HardDriveUpload,
  PlusCircle,
  Search,
  Trash2Icon,
  UserCheck,
  UserX,
} from "lucide-react";

// Dummy colors component import
import Colors from "../../components/ReactColors";

import toast from "react-hot-toast";





import { renderTableLoader } from "../../components/loader/MaterialLoader";
import { TradeCardsLoading } from "../../components/loader/TradeLoader";

import TeacherServices from "../../services/TeacherServices";
import AddTeacherModal from "../../components/admin/teachers/AddTeacherModel";
import EditTeacherModal from "../../components/admin/teachers/EditTeacherModal";
import DeleteTeacherModal from "../../components/admin/teachers/DeleteTeacherModal";
import BanTeacherModal from "../../components/admin/teachers/BanTeacherModal";
import UnbanTeacherModal from "../../components/admin/teachers/UnBanTeacherModel";

const ManageTrade = () => {
  // === STATES ===
  const [isModalOpen, setIsModalOpen] = useState({
    createTeacher: false,
    editTeacher: false,
    teacherId: null,
  });
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    teacherIds: []
  });
  const [banModalState, setBanModalState] = useState({
    isOpen: false,
    teacherId: null,
  });
  const [unbanModalState, setUnbanModalState] = useState({
    isOpen: false,
    teacherId: null
  });
  const [selectedTrade, setSelectedTrade] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState(""); // From date for filter
  const [toDate, setToDate] = useState(""); // To date for filter
  const [TradePerPage, setTradePerPage] = useState(10); // Teacher per page
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [isLoading, setIsLoading] = useState(1); // Pagination


  // === SAMPLE Teacher ===
  const [Teacher, setTeacher] = useState([]);

  // === FETCHING DATA ===
  // Fetching data from of teacher from API 
  useEffect(() => {
    const fetchTrade = async () => {
      setIsLoading(true)
      try {
        const response = await TeacherServices.getAllTeachers();
        const result = response.teachers

        setTeacher(result);
      } catch (error) {
        console.error("Error fetching trades:", error);
      } finally {
        setIsLoading(false)
      }
    };
    fetchTrade();
  }, [])

  // === DROPDOWN OPTIONS ===
  const types = ["Consumables", "Non-Consumables", "Equipment"];
  // === FUNCTIONS ===
  const handleCreateTeacher = async (newItem) => {
    toast.loading("Creating Teacher...", { id: "create-teacher" });
    try {
      const response = await TeacherServices.addTeacher(newItem);

      if (response) {
        toast.success("Teacher created successfully", { id: "create-teacher" });
        setTeacher((prev) => [...prev, response.teacher]);
        setIsModalOpen((pre) => (
          { createTeacher: false }
        ))
      } else {
        console.error("Failed to create teacher:", response.message);
      }
    } catch (error) {
      toast.error("Failed to create teacher", { id: "create-teacher" });
      console.error("Error creating teacher:", error);
    }
  };

  const handleEditTeacher = async (newItem) => {
    toast.loading("updating Teacher...", { id: "update-teacher" });
    alert(Number(isModalOpen.teacherId));

    try {
      const response = await TeacherServices.editTeacher(Number(isModalOpen.teacherId), newItem);

      if (response) {
        toast.success("Teacher updated successfully", { id: "update-teacher" });
        setTeacher((prev) => prev?.map(teacher => teacher.user_id == response.teacher.user_id ? response.teacher : teacher));
        setIsModalOpen((pre) => (
          { teacherId: null, editTeacher: false }
        ))
      } else {
        console.error("Failed to update teacher:", response.message);
      }
    } catch (error) {
      toast.error("Failed to update teacher", { id: "update-teacher" });
      console.error("Error updating teacher:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // reset to first page when search
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageItemIds = currentTrade.map((item) => item.user_id);
      setSelectedTrade(currentPageItemIds);
    } else {
      setSelectedTrade([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedTrade((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDelete = (id) => {
    // If id is provided, delete single teacher, otherwise use selected trades
    setDeleteModalState({
      isOpen: true,
      teacherIds: id ? [id] : selectedTrade
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalState({
      isOpen: false,
      teacherIds: []
    });
  };

  const handleEdit = (id) => {

    setIsModalOpen(pre => (
      {
        ...pre, editTeacher: true, teacherId: id
      }
    ));
  };

  // Add this function to your component
  const handleBan = (id) => {
    setBanModalState({
      isOpen: true,
      teacherId: id
    });
  };

  const handleCloseBanModal = () => {
    setBanModalState({
      isOpen: false,
      teacherId: null
    });
  };

  const handleUnban = (id) => {
    setUnbanModalState({
      isOpen: true,
      teacherId: id
    });
  };

  const handleCloseUnbanModal = () => {
    setUnbanModalState({
      isOpen: false,
      teacherId: null
    });
  };
  // === FILTERING LOGIC ===
  const filteredTrade = Teacher
  // === PAGINATION LOGIC ===
  const indexOfLastItem = currentPage * TradePerPage;
  const indexOfFirstItem = indexOfLastItem - TradePerPage;
  const currentTrade = filteredTrade.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTrade.length / TradePerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleOpenTradeModel = () => {
    setIsModalOpen(pre => (
      { createTeacher: true }
    ))
  }


  // === RENDERING - COMPONENTS ===

  // Header with Add Teacher button and search/filter options
  const renderHeader = () => {
    return (
      <div className="flex flex-col border border-gray-200 overflow-auto rounded-xl">
        <div className="flex px-5 py-5 flex-row items-center justify-between bg-white">
          <h1 className="text-xl text-gray-400 font-medium">Teacher</h1>
          <div className="flex flex-row-reverse gap-3">
            {/* Add Teacher Button */}
            <button
              className="flex items-center gap-1 text-sm py-2 px-3 text-black border rounded-xl hover:border-yellow-dark hover:shadow-lg hover:border bg-yellow-main transition duration-200 ease-in-out"
              to=""
              onClick={handleOpenTradeModel}
            >
              <PlusCircle size={17} />
              Add Teacher
            </button>
            {/* Export Button */}
            <Link
              className="flex items-center gap-1 text-sm py-1.5 px-3 text-gray-600 border-2 rounded-xl bg-white hover:shadow-lg hover:border-yellow-dark hover:text-black-main transition duration-200 ease-in-out"
              to="/admin/dashboard/managestock/exportitem"
            >
              <HardDriveUpload size={17} />
              Export
            </Link>
          </div>
        </div>

        {/* ADD ITEM MODAL */}

        <AddTeacherModal
          isOpen={isModalOpen.createTeacher}
          onClose={() => setIsModalOpen((pre) => (
            { ...pre, createTeacher: false }
          ))}
          onSubmit={handleCreateTeacher}
        />

        {/* Edit ITEM MODAL */}

        <EditTeacherModal
          isOpen={isModalOpen.editTeacher}
          onClose={() => setIsModalOpen((pre) => (
            { ...pre, editTeacher: false }
          ))}
          onSubmit={handleEditTeacher}
          initialData={isModalOpen.teacherId && Teacher.find(teacher => teacher.user_id == isModalOpen.teacherId)}
          teacherId={isModalOpen.teacherId}
        />
        <BanTeacherModal
          isOpen={banModalState.isOpen}
          onClose={handleCloseBanModal}
          teacherId={banModalState.teacherId}
          teacherData={Teacher}
          onBanSuccess={(updatedTeacher) => {
            // Update the teacher in the state
            setTeacher(prevTeachers =>
              prevTeachers.map(teacher =>
                teacher.user_id === updatedTeacher.user_id
                  ? { ...teacher, isBanned: true }
                  : teacher
              )
            );
          }}
        />

        <UnbanTeacherModal
          isOpen={unbanModalState.isOpen}
          onClose={handleCloseUnbanModal}
          teacherId={unbanModalState.teacherId}
          teacherData={Teacher}
          onUnbanSuccess={(updatedTeacher) => {
            // Update the teacher in the state
            setTeacher(prevTeachers =>
              prevTeachers.map(teacher =>
                teacher.user_id === updatedTeacher.user_id
                  ? { ...teacher, isBanned: false }
                  : teacher
              )
            );
          }}
        />

        <DeleteTeacherModal
          isOpen={deleteModalState.isOpen}
          onClose={handleCloseDeleteModal}
          teacherIds={deleteModalState.teacherIds}
          teachers={Teacher}
          onDeleteSuccess={(deletedIds) => {
            // Filter out the deleted teachers from your Teacher state
            const updatedTeachers = Teacher.filter(teacher => !deletedIds.includes(teacher.user_id));
            setSelectedTrade([]); // Clear selection
            setTeacher(updatedTeachers); // Update state with remaining teachers
          }}
        />
        {/* SEARCH / FILTERS */}
        <form onSubmit={handleSearch}>
          <div className="flex flex-wrap gap-2 p-4 items-center">
            {/* Search Text Input */}
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-gray-100 hover:border-yellow-main">
              <Search size={17} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Teacher..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border-none focus:outline-none bg-gray-100 text-gray-700 placeholder-gray-400 w-full"
              />
            </div>

            {/* Type Dropdown */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block rounded-xl border border-gray-300 bg-gray-100 py-2 px-4 shadow-sm hover:border-yellow-main focus:border-yellow-dark focus:outline-none text-gray-700"
            >
              <option value="">Select Type</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <span>From</span>
            {/* Date From */}
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-xl border border-gray-300 bg-gray-100 py-2 px-4 shadow-sm hover:border-yellow-main focus:border-yellow-dark focus:outline-none text-gray-700"
            />
            <span>To</span>
            {/* Date To */}
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-xl border border-gray-300 bg-gray-100 py-2 px-4 shadow-sm hover:border-yellow-main focus:border-yellow-dark focus:outline-none text-gray-700"
            />

            {/* Search Button */}
            <button
              type="submit"
              className="bg-yellow-main text-black hover:shadow-xl rounded-xl flex items-center gap-1 py-2 px-3"
            >
              <Search size={17} />
            </button>
          </div>
        </form>
      </div>
    )
  }

  // === RENDERS TRADE CARDS ===
  const renderTradeCards = (Teacher) => {
    const spanStyles = 'capitalize font-semibold'


    if (isLoading) {
      return <TradeCardsLoading />
    }

    if (Teacher.length == 0) {
      return <div className="  flex justify-center items-center min-h-56 md:min-h-40">
        <p>No trades yet , so you can add some</p>
      </div>
    }

    return (
      <div className="flex flex-col p-1 gap-3 lg:hidden w-full">
        {
          Teacher?.map((teacher, key) => (
            <div key={key} className="flex flex-col p-5 gap-1 rounded-md border border-gray-200 bg-gray-50 ">
              <p > <span className={spanStyles}>Id : </span>{key + 1}</p>
              <p > <span className={spanStyles}>Name : </span>{teacher.name}</p>
              <p > <span className={spanStyles}>Email : </span> {teacher.email}</p>
              <p > <span className={spanStyles}>Phone : </span> {teacher.phone || '-----'}</p>
              <p > <span className={spanStyles}>date : </span>{moment(teacher.createdAt).format('lll')}</p>
              <p > <span className={spanStyles}>Action : </span>
                {teacher.isBanned ? (
                  <button
                    className="text-green-600 hover:text-green-900  mr-3"
                    onClick={() => handleUnban(teacher.user_id)}
                  >
                    <CheckSquare size={17} />
                  </button>
                ) : (
                  <button
                    className="text-yellow-600 hover:text-yellow-900  mr-3"
                    onClick={() => handleBan(teacher.user_id)}
                  >
                    <BanIcon size={17} />
                  </button>
                )}
                <button
                  className="text-blue-600 hover:text-blue-900 mr-3"
                  onClick={() => handleEdit(teacher.user_id)}
                >
                  <EditIcon size={17} />
                </button>
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => handleDelete(teacher.user_id)}
                >
                  <Trash2Icon size={17} />
                </button>
              </p>
            </div>
          ))
        }
      </div>
    )
  }

  // === RENDERS TRADE TABLE ===
  const renderTradeTable = (currentTrade) => {

    if (isLoading) {
      return renderTableLoader()
    }

    return (
      <div className="overflow-x-auto hidden lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <input
                  type="checkbox"
                  checked={
                    currentTrade.length > 0 &&
                    selectedTrade.length === currentTrade.length
                  }
                  onChange={handleSelectAll}
                  className="checkbox checkbox-warning bg-gray-100"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Teacher  Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Teacher Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Teacher Phone number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTrade.map((item) => (
              <tr key={item.user_id}>
                <td className="px-2 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedTrade.includes(item.user_id)}
                    onChange={() => handleSelectItem(item.user_id)}
                    className="checkbox checkbox-warning bg-yellow-50"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.name ?? '--------'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.email ?? '--------'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.phone ?? '--------'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{moment(item.createdAt).format('lll')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.isBanned ? (
                    <button
                      className="text-green-600 hover:text-green-900  mr-3"
                      onClick={() => handleUnban(item.user_id)}
                    >
                      <CheckSquare size={17} />
                    </button>
                  ) : (
                    <button
                      className="text-yellow-600 hover:text-yellow-900 mr-3"
                      onClick={() => handleBan(item.user_id)}
                    >
                      <BanIcon size={17} />
                    </button>
                  )}
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleEdit(item.user_id)}
                  >
                    <EditIcon size={17} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(item.user_id)}
                  >
                    <Trash2Icon size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      {/* HEADER SECTION */}
      {renderHeader()}

      <div className="overflow-hidden lg:border lg:border-gray-200 rounded-lg mt-5">
        {/* Teacher TABLE */}
        {renderTradeTable(currentTrade)}
        {/* TRADE CARDS */}
        {renderTradeCards(currentTrade)}

        {/* PAGINATION CONTROLS */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
          <div className="flex items-center gap-2">
            <label className="text-sm">Teacher per page:</label>
            <select
              value={TradePerPage}
              onChange={(e) => {
                setTradePerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page
              }}
              className="rounded-xl border border-gray-300 bg-gray-100 py-2 px-4 shadow-sm hover:border-yellow-main focus:border-yellow-dark focus:outline-none text-gray-700"
            >
              {[10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            {selectedTrade.length > 0 && (
              <button
                onClick={() => handleDelete()}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                <Trash2Icon size={17} /> ({selectedTrade.length})
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              disabled={currentPage === 1}
              onClick={goToPrevPage}
              className="bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 border border-gray-300"
            >
              Prev
            </Button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={goToNextPage}
              className="bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 border border-gray-300"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageTrade;