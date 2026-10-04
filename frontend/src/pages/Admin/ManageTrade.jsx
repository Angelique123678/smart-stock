import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import moment from "moment"; // Import moment for date formatting
import {
  EditIcon,
  HardDriveUpload,
  PlusCircle,
  Search,
  Trash2Icon,
} from "lucide-react";

// Dummy colors component import
import Colors from "../../components/ReactColors";

import toast from "react-hot-toast";
import TradeServices from "../../services/TradeServices";
import AddTradeModel from "../../components/admin/trades/AddTradeModel";
import EditTradeModel from "../../components/admin/trades/EditTradeModel";
import DeleteTradeModal from "../../components/admin/trades/DeleteTradeModal";
import { renderTableLoader } from "../../components/loader/MaterialLoader";
import { TradeCardsLoading } from "../../components/loader/TradeLoader";

const ManageTrade = () => {
  // === STATES ===
  const [isModalOpen, setIsModalOpen] = useState({
    createTrade: false,
    editTrade: false,
    tradeId: null,
  });
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    tradeIds: []
  });
  const [selectedTrade, setSelectedTrade] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState(""); // From date for filter
  const [toDate, setToDate] = useState(""); // To date for filter
  const [TradePerPage, setTradePerPage] = useState(10); // Trade per page
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [isLoading, setIsLoading] = useState(1); // Pagination


  // === SAMPLE Trade ===
  const [Trade, setTrade] = useState([]);

  // === FETCHING DATA ===
  // Fetching data from of trade from API 
  useEffect(() => {
    const fetchTrade = async () => {
      setIsLoading(true)
      try {
        const response = await TradeServices.getAllTrades();
        const result = response.trades
        setTrade(result);
      } catch (error) {
        console.error("Error fetching trades:", error);
      }finally{
        setIsLoading(false)
      }
    };
    fetchTrade();
  }, [])

  // === DROPDOWN OPTIONS ===
  const types = ["Consumables", "Non-Consumables", "Equipment"];

  // === FUNCTIONS ===
  const handleCreateTrade = async (newItem) => {
    toast.loading("Creating Trade...", { id: "create-trade" });
    try {
      const response = await TradeServices.createTrade(newItem);

      if (response) {
        toast.success("Trade created successfully", { id: "create-trade" });
        setTrade((prev) => [...prev, response.trade]);
        setIsModalOpen((pre) => (
          { createTrade: false }
        ))
      } else {
        console.error("Failed to create trade:", response.message);
      }
    } catch (error) {
      toast.error("Failed to create trade", { id: "create-trade" });
      console.error("Error creating trade:", error);
    }
  };
  
  const handleEditTrade = async (newItem) => {
    toast.loading("updating Trade...", { id: "update-trade" });
    try {
      const response = await TradeServices.updateTrade(Number(isModalOpen.tradeId), newItem);

      if (response) {
        toast.success("Trade updated successfully", { id: "update-trade" });
        setTrade((prev) => prev?.map(trade => trade.trade_id == response.trade ? response.trade : trade));
        setIsModalOpen((pre) => (
          { tradeId: null, editTrade: false }
        ))
      } else {
        console.error("Failed to update trade:", response.message);
      }
    } catch (error) {
      toast.error("Failed to update trade", { id: "update-trade" });
      console.error("Error updating trade:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // reset to first page when search
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageItemIds = currentTrade.map((item) => item.trade_id);
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
    // If id is provided, delete single trade, otherwise use selected trades
    setDeleteModalState({
      isOpen: true,
      tradeIds: id ? [id] : selectedTrade
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalState({
      isOpen: false,
      tradeIds: []
    });
  };

  const handleEdit = (id) => {
    setIsModalOpen(pre => (
      {
        ...pre, editTrade: true, tradeId: id
      }
    ));
  };

  // === FILTERING LOGIC ===
  const filteredTrade = Trade
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
      { createTrade: true }
    ))
  }

  // === RENDERING - COMPONENTS ===

  // Header with Add Trade button and search/filter options
  const renderHeader = () => {
    return (
      <div className="flex flex-col border border-gray-200 overflow-auto rounded-xl">
        <div className="flex px-5 py-5 flex-row items-center justify-between bg-white">
          <h1 className="text-xl text-gray-400 font-medium">Trade</h1>
          <div className="flex flex-row-reverse gap-3">
            {/* Add Trade Button */}
            <button
              className="flex items-center gap-1 text-sm py-2 px-3 text-black border rounded-xl hover:border-yellow-dark hover:shadow-lg hover:border bg-yellow-main transition duration-200 ease-in-out"
              to=""
              onClick={handleOpenTradeModel}
            >
              <PlusCircle size={17} />
              Add Trade
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
        <AddTradeModel
          isOpen={isModalOpen.createTrade}
          onClose={() => setIsModalOpen((pre) => (
            { ...pre, createTrade: false }
          ))}
          onSubmit={handleCreateTrade}
        />
        
        {/* Edit ITEM MODAL */}
        <EditTradeModel
          isOpen={isModalOpen.editTrade}
          onClose={() => setIsModalOpen((pre) => (
            { ...pre, editTrade: false }
          ))}
          onSubmit={handleEditTrade}
          initialData={isModalOpen.tradeId && Trade.find(trade => trade.trade_id == isModalOpen.tradeId)}
          tradeId={isModalOpen.tradeId}
        />

        {/* DELETE TRADE MODAL */}
        <DeleteTradeModal
  isOpen={deleteModalState.isOpen}
  onClose={handleCloseDeleteModal}
  tradeIds={deleteModalState.tradeIds}
  trades={Trade}
  onDeleteSuccess={(deletedIds) => {
    // Filter out the deleted trades from your Trade state
    const updatedTrades = Trade.filter(trade => !deletedIds.includes(trade.trade_id));
    setSelectedTrade(pre=>( 
      []
    ))
    setTrade(pre=>updatedTrades);
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
                placeholder="Search Trade..."
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
  const renderTradeCards = (Trade) => {
    const spanStyles = 'capitalize font-semibold'


    if(isLoading){
      return <TradeCardsLoading />
    }

    if(Trade.length == 0){
      return <div className="  flex justify-center items-center min-h-56 md:min-h-40">
        <p>No trades yet , so you can add some</p>
      </div>
    }

    return (
      <div className="flex flex-col p-1 gap-3 lg:hidden w-full">
        {
          Trade?.map((trade, key) => (
            <div key={key} className="flex flex-col p-5 gap-1 rounded-md border border-gray-200 bg-gray-50 ">
              <p > <span className={spanStyles}>Id : </span>{key + 1}</p>
              <p > <span className={spanStyles}>Trade Short Name : </span>{trade.trade_short_name}</p>
              <p > <span className={spanStyles}>Trade Long Name : </span> {trade.trade_long_name}</p>
              <p > <span className={spanStyles}> Total Material of Trade : </span>{trade?.materials?.length || 0} material </p>
              <p > <span className={spanStyles}>date : </span>{moment(trade.createdAt).format('lll')}</p>
              <p > <span className={spanStyles}>Action : </span>
                <button
                  className="text-blue-600 hover:text-blue-900 mr-3"
                  onClick={() => handleEdit(trade.trade_id)}
                >
                  <EditIcon size={17} />
                </button>
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => handleDelete(trade.trade_id)}
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

    if(isLoading){
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
                Trade Short Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trade Long Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Material of Trade
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
              <tr key={item.trade_id}>
                <td className="px-2 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedTrade.includes(item.trade_id)}
                    onChange={() => handleSelectItem(item.trade_id)}
                    className="checkbox checkbox-warning bg-yellow-50"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.trade_short_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.trade_long_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item?.materials?.length || 0} material</td>
                <td className="px-6 py-4 whitespace-nowrap">{moment(item.createdAt).format('lll')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleEdit(item.trade_id)}
                  >
                    <EditIcon size={17} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(item.trade_id)}
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
        {/* Trade TABLE */}
        {renderTradeTable(currentTrade)}
        {/* TRADE CARDS */}
        {renderTradeCards(currentTrade)}

        {/* PAGINATION CONTROLS */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
          <div className="flex items-center gap-2">
            <label className="text-sm">Trade per page:</label>
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