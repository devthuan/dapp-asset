import React, { useState, useEffect, useContext } from "react";
// import "./AssetDetail.css";
import { WalletContext } from "@/context/WalletContext";
import { CONTRACT_ABI } from "@/blockchain/contractABI";
import { CONTRACT_ADDRESS } from "@/blockchain/contractAddress";
import { ChevronDown } from "lucide-react";
import AssetForm from "@/components/AssetForm/AssetForm";
// import AssetFormDesktop from "@/components/AssetForm/AssetFormDesktop";
import { useDispatch, useSelector } from "react-redux";
import { deleteAsset } from "@/redux/features/asset/assetSlice";
function AssetDetailDesktop({ reloadAssets }) {
  const dispatch = useDispatch();
  const assetId = useSelector((state) => state.asset.id)?.id || 0;
  const dataAssetById = useSelector((state) => state.asset.data).find(
    (item) => item.id === assetId
  );
  const [asset, setAsset] = useState({});
  // const [isClosing, setIsClosing] = useState(false);
  // const [isCreate, setIsCreate] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { web3, account, privateKey } = useContext(WalletContext);

  useEffect(() => {
    const loadAsset = async () => {
      const serializeBigInt = (obj) => {
        for (const key in obj) {
          if (typeof obj[key] === "bigint") {
            obj[key] = obj[key].toString();
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            serializeBigInt(obj[key]);
          }
        }
        return obj;
      };
      try {
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        const assetData = await contract.methods
          .getAssetDetails(assetId)
          .call({ from: account.address });
        let assetFetch = serializeBigInt(assetData);
        assetFetch = {
          name: assetFetch.name,
          purchaseDate: new Date(
            assetFetch.purchaseDate * 1000
          ).toLocaleDateString(),
          value: assetFetch.value,
          description: assetFetch.description,
          image: assetFetch.imageURL, // Đảm bảo hợp lệ trong smart contract
          notes: assetFetch.note,
        };

        setAsset(assetFetch);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tài sản:", error);
      }
    };
    loadAsset();
  }, [assetId, web3, account]);

  const handleEdit = () => {
    console.log("Edit clicked");
    setShowForm(true);
  };

  const handleFormClose = () => {
    console.log("Form closing");
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài sản này?")) return;

    try {
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = await contract.methods
        .deleteAsset(assetId)
        .estimateGas({ from: account.address });

      const tx = {
        to: CONTRACT_ADDRESS,
        data: contract.methods.deleteAsset(assetId).encodeABI(),
        gas: gasLimit,
        gasPrice: gasPrice,
        from: account.address,
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      dispatch(deleteAsset(assetId));
      console.log("Asset deleted successfully:", receipt);
      alert("Tài sản đã được xóa!");
      // reloadAssets();
    } catch (error) {
      console.error("Lỗi khi xóa tài sản:", error);
      alert("Có lỗi xảy ra khi xóa tài sản.");
    }
  };

  return (
    <div className="relative h-full p-5 bg-white/80">
      <h2 className="py-5 text-[28px]">{dataAssetById?.name}</h2>
      <div className="asset-content">
        <div className="asset-info">
          <div className="asset-meta">
            <div className="meta-item">
              <div className="meta-label">Ngày mua</div>
              <div className="meta-value">{dataAssetById?.purchaseDate}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Giá trị</div>
              <div className="meta-value">
                {new Intl.NumberFormat("vi-VN").format(dataAssetById?.value)} đ
              </div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Mô tả</div>
              <div className="meta-value">{dataAssetById?.description}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Ghi chú</div>
              <div className="meta-value">{dataAssetById?.note}</div>
            </div>
          </div>

          <div
            className="w-full h-40 "
            style={{
              backgroundImage: "url(${dataAssetById?.image})",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>

        <div className="asset-image-wrapper">
          <img
            className="asset-image"
            src={dataAssetById?.imageURL}
            alt={dataAssetById?.name}
          />
        </div>
      </div>
      <div className="absolute bottom-2 action-buttons">
        <button className="edit-button" onClick={handleEdit}>
          Edit
        </button>
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
      </div>

      {showForm ? (
        <AssetForm
          id={assetId}
          onClose={handleFormClose}
          reloadAssets={reloadAssets}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default AssetDetailDesktop;
