import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import AddMaterialModel from "../../components/admin/materials/AddMaterialModel";
import moment from "moment"; // Import moment for date formatting
import {
  EditIcon,
  HardDriveUpload,
  PlusCircle,
  Search,
  Trash2Icon,
} from "lucide-react";

// Import the DeleteMaterialModal component
import DeleteMaterialModal from "../../components/admin/materials/DeleteMaterialModal";
import Colors from "../../components/ReactColors";
import MaterialServices from "../../services/MaterialServices";
import toast from "react-hot-toast";
import TradeServices from "../../services/TradeServices";
import EditMaterialModal from "../../components/admin/materials/EditMaterialModel";
import { MaterialCardsLoading, renderTableLoader } from "../../components/loader/MaterialLoader";

const ManageStock = () => {
  // === STATES ===
  const [isModalOpen, setIsModalOpen] = useState({
    createMaterial: false,
    editMateial: false,
    materialId: null,
  });
  const [selectedTrade, setSelectedTrade] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState(""); // From date for filter
  const [toDate, setToDate] = useState(""); // To date for filter
  const [MaterialPerPage, setMaterialPerPage] = useState(10); // Material per page
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [trades, setTrades] = useState([]);
  const [isLoading,setIsLoading] = useState(false)

  // === SAMPLE Material ===
  const [Material, setMaterial] = useState([]);

  // State for the delete modal
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    materialIds: []
  });

  // Function to open delete modal
  const handleOpenDeleteModal = (materialIds) => {
    setDeleteModalState({
      isOpen: true,
      materialIds: Array.isArray(materialIds) ? materialIds : [materialIds]
    });
  };

  // Function to close delete modal
  const handleCloseDeleteModal = () => {
    setDeleteModalState({
      isOpen: false,
      materialIds: []
    });
  };

  // Function to handle successful deletion
  const handleDeleteSuccess = (deletedIds) => {
    // Filter out deleted materials from state
    setMaterial(Material.filter(
      material => !deletedIds.includes(material.material_id)
    ));
    // Clear selected materials after deletion
    setSelectedMaterial(prevSelected => 
      prevSelected.filter(id => !deletedIds.includes(id))
    );
    toast.success(
      deletedIds.length === 1 
        ? "Material deleted successfully" 
        : `${deletedIds.length} materials deleted successfully`
    );
  }

  // === FETCHING DATA ===
  useEffect(() => {
    const fetchMaterial = async () => {
      setIsLoading(true)
      try {
        const response = await MaterialServices.getAllMaterials();
        const result = response.materials;
        setMaterial(result);
      } catch (error) {
        console.error("Error fetching materials:", error);
        toast.error("Failed to load materials");
      }
      finally{
        setIsLoading(false)
      }
    };
    fetchMaterial();
  }, []);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await TradeServices.getAllTrades();
        const trades = response.trades;
        setTrades(trades);
      } catch (error) {
        console.error("Error fetching trades:", error);
      }
    };

    fetchTrades();
  }, []);

  // === DROPDOWN OPTIONS ===
  const types = ["Consumables", "Non-Consumables", "Equipment"];

  // === FUNCTIONS ===
  const handleCreateMaterial = async (newItem) => {
    toast.loading("Creating Material...", { id: "create-material" });
    try {
      const response = await MaterialServices.createMaterial(newItem);

      if (response) {
        toast.success("Material created successfully", { id: "create-material" });
        setMaterial((prev) => [...prev, response.material]);
        setIsModalOpen((pre) => (
          { createMaterial: false }
        ));
      } else {
        console.error("Failed to create material:", response.message);
      }
    } catch (error) {
      toast.error("Failed to create material", { id: "create-material" });
      console.error("Error creating material:", error);
    }
  };

  const handleEditMaterial = async (newItem) => {
    toast.loading("Updating Material...", { id: "update-Material" });
    try {
      const response = await MaterialServices.updateMaterial(Number(isModalOpen.materialId), newItem);

      if (response) {
        toast.success("Material updated successfully", { id: "update-Material" });
        setMaterial((prev) => prev?.map(material => 
          material.material_id === response.material.material_id ? response.material : material
        ));
        setIsModalOpen((pre) => (
          { materialId: null, editMaterial: false }
        ));
      } else {
        console.error("Failed to update Material:", response.message);
      }
    } catch (error) {
      toast.error("Failed to update Material", { id: "update-Material" });
      console.error("Error updating Material:", error);
    }
  };

  function turnArrayIntoList(trades) {
    if (!Array.isArray(trades) || trades.length === 0) return '';
    
    const trade_short_names = trades.map(trade => trade.trade_short_name);

    if (trade_short_names.length === 1) {
      return trade_short_names[0];
    }

    return trade_short_names.join(', ');
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // reset to first page when search
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageItemIds = currentMaterial.map((item) => item.material_id);
      setSelectedMaterial(currentPageItemIds);
    } else {
      setSelectedMaterial([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedMaterial((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const handleEdit = (id) => {
    setIsModalOpen((pre) => (
      {...pre, editMateial: true, materialId: id}
    ));
  };

  const handleDelete = (id) => {
    handleOpenDeleteModal(id);
  };

  // === FILTERING LOGIC ===
  const filteredMaterial = Material.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesType = selectedType ? item.type === selectedType : true;
    const matchesDate =
      (!fromDate || new Date(item.date) >= new Date(fromDate)) &&
      (!toDate || new Date(item.date) <= new Date(toDate));
    return matchesSearch && matchesType && matchesDate;
  });

  // === PAGINATION LOGIC ===
  const indexOfLastItem = currentPage * MaterialPerPage;
  const indexOfFirstItem = indexOfLastItem - MaterialPerPage;
  const currentMaterial = filteredMaterial.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMaterial.length / MaterialPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleOpenMaterialModel = () => {
    setIsModalOpen(pre => (
      { createMaterial: true }
    ));
  };

  // === RENDERING - COMPONENTS ===
  const renderHeader = () => {
    return (
      <div className="flex flex-col border border-gray-200 overflow-auto rounded-xl">
        <div className="flex px-5 py-5 flex-row items-center justify-between bg-white">
          <h1 className="text-xl text-gray-400 font-medium">Material</h1>
          <div className="flex flex-row-reverse gap-3">
            {/* Add Material Button */}
            <button
              className="flex items-center gap-1 text-sm py-2 px-3 text-black border rounded-xl hover:border-yellow-dark hover:shadow-lg hover:border bg-yellow-main transition duration-200 ease-in-out"
              onClick={handleOpenMaterialModel}
            >
              <PlusCircle size={17} />
              Add Material
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
        <AddMaterialModel
          isOpen={isModalOpen.createMaterial}
          onClose={() => setIsModalOpen((pre) => (
            { createMaterial: false }
          ))}
          onSubmit={handleCreateMaterial}
        />
        
        {/* EDIT ITEM MODAL */}
        <EditMaterialModal
          isOpen={isModalOpen.editMateial}
          onClose={() => setIsModalOpen((pre) => (
            { editMateial: false }
          ))}
          onSubmit={handleEditMaterial}
          initialData={isModalOpen.materialId && Material.find((material) => material?.material_id === isModalOpen.materialId)}
          materialId={isModalOpen.materialId}
        />

        {/* DELETE MATERIAL MODAL */}
        <DeleteMaterialModal
          isOpen={deleteModalState.isOpen}
          onClose={handleCloseDeleteModal}
          materialIds={deleteModalState.materialIds}
          materials={Material}
          onDeleteSuccess={handleDeleteSuccess}
        />

        {/* SEARCH / FILTERS */}
        <form onSubmit={handleSearch}>
          <div className="flex flex-wrap gap-2 p-4 items-center">
            {/* Search Text Input */}
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-gray-100 hover:border-yellow-main">
              <Search size={17} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Material..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border-none focus:outline-none bg-gray-100 text-gray-700 placeholder-gray-400 w-full"
              />
            </div>

            {/* Trade Dropdown */}
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="block rounded-xl border border-gray-300 bg-gray-100 py-2 px-4 shadow-sm hover:border-yellow-main focus:border-yellow-dark focus:outline-none text-gray-700"
            >
              <option value="">Select Trade</option>
              {trades.map((trade) => (
                <option className="uppercase" key={trade.trade_id} value={trade.trade_short_name}>
                  {trade.trade_short_name}
                </option>
              ))}
            </select>

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
    );
  };

  // === RENDERS MATERIAL CARDS ===
  const renderMaterialCards = (materials) => {
    const spanStyles = 'capitalize font-semibold';
     if(isLoading){
         return <MaterialCardsLoading />
       }

       if(materials.length == 0){
        return <div className="  flex justify-center items-center min-h-56 md:min-h-40">
          <p>No materials yet , so you can add some</p>
        </div>
      }
    
    return (
      <div className="flex flex-col p-1 gap-3 lg:hidden w-full">
        {materials?.map((material, key) => (
          <div key={key} className="flex flex-col p-5 gap-1 rounded-md border border-gray-200 bg-gray-50">
            <p><span className={spanStyles}>Id : </span>{key + 1}</p>
            <p><span className={spanStyles}>Name : </span>{material.name}</p>
            <p><span className={spanStyles}>Trade : </span>{turnArrayIntoList(material.trades)}</p>
            <p><span className={spanStyles}>Category : </span>{material.category}</p>
            <p><span className={spanStyles}>Quantity : </span>{material.quantity}</p>
            <p><span className={spanStyles}>Status : </span>
              <span
                className={`px-2 inline-flex text-xs font-semibold rounded-full ${material.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                  }`}
              >
                {material.isAvailable ? 'Available' : 'Stockout'}
              </span>
            </p>
            <p><span className={spanStyles}>Date : </span>{moment(material.createdAt).format('lll')}</p>
            <p><span className={spanStyles}>Action : </span>
              <button
                className="text-blue-600 hover:text-blue-900 mr-3"
                onClick={() => handleEdit(material.material_id)}
              >
                <EditIcon size={17} />
              </button>
              <button
                className="text-red-600 hover:text-red-900"
                onClick={() => handleDelete(material.material_id)}
              >
                <Trash2Icon size={17} />
              </button>
            </p>
          </div>
        ))}
      </div>
    );
  };

  // === RENDERS MATERIAL TABLE ===
  const renderMaterialTable = (currentMaterial) => {
    if(isLoading) return renderTableLoader() 
    return (
      <div className="overflow-x-auto hidden lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <input
                  type="checkbox"
                  checked={
                    currentMaterial.length > 0 &&
                    selectedMaterial.length === currentMaterial.length
                  }
                  onChange={handleSelectAll}
                  className="checkbox checkbox-warning bg-gray-100"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Material Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
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
            {currentMaterial.map((item) => (
              <tr key={item.material_id}>
                <td className="px-2 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedMaterial.includes(item.material_id)}
                    onChange={() => handleSelectItem(item.material_id)}
                    className="checkbox checkbox-warning bg-yellow-50"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{turnArrayIntoList(item.trades)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs font-semibold rounded-full ${item.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {item.isAvailable ? 'Available' : 'Stockout'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{moment(item.createdAt).format('lll')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleEdit(item.material_id)}
                  >
                    <EditIcon size={17} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(item.material_id)}
                  >
                    <Trash2Icon size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      {/* HEADER SECTION */}
      {renderHeader()}

      <div className="overflow-hidden lg:border lg:border-gray-200 rounded-lg mt-5">
        {/* Material TABLE */}
        {renderMaterialTable(currentMaterial)}
        {/* MATERIAL CARDS */}
        {renderMaterialCards(currentMaterial)}

        {/* PAGINATION CONTROLS */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
          <div className="flex items-center gap-2">
            <label className="text-sm">Material per page:</label>
            <select
              value={MaterialPerPage}
              onChange={(e) => {
                setMaterialPerPage(Number(e.target.value));
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
            {selectedMaterial.length > 0 && (
              <button
                onClick={() => handleOpenDeleteModal(selectedMaterial)}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                <Trash2Icon size={17} /> ({selectedMaterial.length})
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
};

export default ManageStock;