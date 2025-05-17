"use client";

import { useState, useEffect, useContext } from "react";
import "./AssetForm.css";
import { WalletContext } from "@/context/WalletContext";
import { CONTRACT_ABI } from "@/blockchain/contractABI";
import { CONTRACT_ADDRESS } from "@/blockchain/contractAddress";

function AssetForm({ id, onClose, reloadAssets }) {
  const [name, setName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [notes, setNotes] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { web3, account, privateKey } = useContext(WalletContext);

  const cloudinaryUrl =
    "https://api.cloudinary.com/v1_1/dta5lkfxr/image/upload";
  const cloudinaryUploadPreset = "imageurl";

    const serializeBigInt = (obj) => {
      const result = {};
      for (const key in obj) {
        if (typeof obj[key] === "bigint") {
          result[key] = obj[key].toString();
        } else {
          result[key] = obj[key];
        }
      }
      return result;
    };

    useEffect(() => {
      if (id != null && web3 && account) {
        const loadAsset = async () => {
          try {
            const contract = new web3.eth.Contract(
              CONTRACT_ABI,
              CONTRACT_ADDRESS
            );
            const assetData = await contract.methods
              .getAssetDetails(id)
              .call({ from: account.address });

            let asset = serializeBigInt(assetData);

            setName(asset.name);
            setPurchaseDate(
              new Date(asset.purchaseDate * 1000).toISOString().split("T")[0] // đúng format YYYY-MM-DD
            );
            setValue(asset.value);
            setDescription(asset.description);
            setImage(asset.imageURL);
            setNotes(asset.note);
          } catch (error) {
            console.error("Lỗi khi lấy dữ liệu tài sản:", error);
          }
        };
        loadAsset();
      }
    }, [id, web3, account]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setLoading(true)
        let imageURL = image;

        if (image instanceof File) {
          const formData = new FormData();
          formData.append("file", image);
          formData.append("upload_preset", cloudinaryUploadPreset);

          const response = await fetch(cloudinaryUrl, {
            method: "POST",
            body: formData,
          });

          const cloudinaryResponse = await response.json();
          imageURL = cloudinaryResponse.secure_url;
        }

        const timestamp = Math.floor(new Date(purchaseDate).getTime() / 1000);
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        const gasPrice = await web3.eth.getGasPrice();

        let txData;
        if (id != null) {
          txData = contract.methods
            .editAsset(id, name, timestamp, value, description, imageURL, notes)
            .encodeABI();

          var gas = await contract.methods
            .editAsset(id, name, timestamp, value, description, imageURL, notes)
            .estimateGas({ from: account.address });
        } else {
          txData = contract.methods
            .addAsset(name, timestamp, value, description, imageURL, notes)
            .encodeABI();

          // var gas = await contract.methods
          //   .addAsset(name, timestamp, value, description, imageURL, notes)
          //   .estimateGas({ from: account.address });
        }

        const tx = {
          to: CONTRACT_ADDRESS,
          data: txData,
          gas,
          gasPrice,
          from: account.address,
        };

        const signed = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(
          signed.rawTransaction
        );

        alert(
          id != null
            ? "Cập nhật tài sản thành công!"
            : "Tạo tài sản thành công!"
        );
        setLoading(false);

        console.log("Giao dịch:", receipt);
      } catch (err) {
        console.error(err);
        alert("Có lỗi xảy ra khi gửi giao dịch.");
      }

      reloadAssets?.();
      triggerClose();
    };

    const triggerClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 300);
    };
  return (
    <div className="asset-form-overlay">
      <form
        onSubmit={handleSubmit}
        className={`asset-form-container ${isClosing ? "slide-down" : ""}`}
      >
        <div className="form-drag-bar"></div>
        <h2 className="asset-form-title gradient-text">
          {id != null ? "Edit Asset" : "Add Asset"}
        </h2>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <label className="asset-form-label" htmlFor="asset-name">
          Asset Name
        </label>
        <input
          id="asset-name"
          type="text"
          placeholder="Asset name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="asset-form-input"
          disabled={loading}
          required
        />

        <label className="asset-form-label" htmlFor="purchase-date">
          Purchase Date
        </label>
        <input
          id="purchase-date"
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          className="asset-form-input"
          disabled={loading}
          required
        />

        <label className="asset-form-label" htmlFor="asset-value">
          Value
        </label>
        <input
          id="asset-value"
          type="number"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="asset-form-input"
          disabled={loading}
          required
          min="1"
        />

        <label className="asset-form-label" htmlFor="asset-description">
          Description
        </label>
        <textarea
          id="asset-description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="asset-form-textarea"
          disabled={loading}
        />

        <label className="asset-form-label">Image</label>
        {id != null && image && typeof image === "string" && (
          <div className="image-preview">
            <img
              src={image || "/placeholder.svg"}
              alt="Asset Preview"
              className="preview-image"
            />
          </div>
        )}

        <div className="custom-file-wrapper">
          <label htmlFor="file-upload" className="custom-file-button">
            Choose File
          </label>
          <span className="custom-file-name">
            {image instanceof File ? image.name : "No file chosen"}
          </span>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="custom-file-input"
            disabled={loading}
          />
        </div>

        <label className="asset-form-label" htmlFor="asset-notes">
          Notes
        </label>
        <textarea
          id="asset-notes"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="asset-form-textarea"
          disabled={loading}
        />

        <div className="asset-form-actions">
          <button
            type="submit"
            className="asset-form-submit"
            disabled={loading}
          >
            {loading ? "Processing..." : id != null ? "Update" : "Add Asset"}
          </button>
        </div>

        <button
          type="button"
          onClick={triggerClose}
          className="asset-form-close"
          aria-label="Close form"
          disabled={loading}
        >
          ✖
        </button>
      </form>
    </div>
  );
}

export default AssetForm;
