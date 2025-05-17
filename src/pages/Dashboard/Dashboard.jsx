// f4351b7636ef9a5a55d0b3a4af4f752ccf90fbf525b5cf8048e8ccaab752e699

// eslint-disable-next-line
import React, { useState, useEffect, useContext } from "react";
// import AssetCarousel from "@/components/AssetCarousel/AssetCarousel";
import "./Dashboard.css";
import AssetForm from "@/components/AssetForm/AssetForm";
import { WalletContext } from "@/context/WalletContext";
import DashboardLabel from "@/components/DashboardLabel/DashboardLabel";
import { CONTRACT_ABI } from "@/blockchain/contractABI";
import { CONTRACT_ADDRESS } from "@/blockchain/contractAddress";
import { useNavigate } from "react-router-dom";
import CardSlider2 from "@/components/CardSlider2/CardSlider2";
import CardSliderDesktop from "@/components/CardSliderDesktop/CardSliderDesktop";
import AssetDetail from "../AssetDetail/AssetDetail";
import AssetDetailDesktop from "../AssetDetail/AssetDetailDesktop";
import { useSelector } from "react-redux";

function Dashboard() {

  const assetId = useSelector((state) => state.asset.id);

  const [assets, setAssets] = useState([]);
  const { web3, account, privateKey } = useContext(WalletContext);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleOnclick = (event) => {
    console.log(event)
  }


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

  const fetchAssets = async () => {
    try {
      if (!web3 || !account) return;
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const userAssets = await contract.methods
        .getUserAssets()
        .call({ from: account.address });

      const fullAssets = await Promise.all(
        userAssets.map(async (_, index) => {
          let asset = await contract.methods
            .getAssetDetails(index)
            .call({ from: account.address });
          asset = serializeBigInt(asset);
          return {
            id: index,
            name: asset.name,
            value: parseInt(asset.value),
            currentValue: parseInt(asset.value),
            description: asset.description,
            imageURL: asset.imageURL,
            note: asset.note,
            purchaseDate: new Date(
              asset.purchaseDate * 1000
            ).toLocaleDateString(),
          };
        })
      );

      console.log(fullAssets);

      setAssets(fullAssets);
    } catch (err) {
      console.error("Lỗi khi load danh sách tài sản:", err);
    }
  };

  useEffect(() => {
    if (web3 && account && privateKey) {
      console.log(web3 + account + privateKey);
      fetchAssets();
    } else {
      navigate("/dashboard");
    }
  }, [web3, account, privateKey]);

  const calculateCurrentPercentage = () => {
    if (assets.length === 0) return 0;

    const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
    const totalCurrent = assets.reduce((sum, a) => sum + a.currentValue, 0);

    return ((totalCurrent * 100) / totalValue).toFixed(1); // ✅ đúng theo yêu cầu
  };

  return (
    <div className="">
      {/* mobile */}
      <div className="lock md:hidden ">
        <div className="dashboard-header">
          <p className="title-sub gradient-text">WELCOM!</p>
          <h2 className="title-main gradient-text">YOUR ASSET LIST</h2>
        </div>

        <div className="action-buttons">
          <button className="try-button">LET'S TRY</button>
          <button className="now-button">NOT NOW</button>
        </div>

        {/* Asset carousel */}
        <div className="carousel-wrapper">
          <CardSlider2 data={assets} reloadAssets={fetchAssets} />
        </div>

        <div className="dashboard-footer-wrapper">
          <div className="dashboard-footer">
            <div className="footer-left">
              <DashboardLabel onAddClick={() => setShowForm(true)} />
            </div>

            <div
              className="footer-card analysed-card"
              style={{
                background: `url("src/assets/avatar.png") no-repeat center center`,
                backgroundSize: "160%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                border: "1px solid #ccc",
              }}
            ></div>

            <div
              className="footer-card analysed-card"
              style={{
                background: `linear-gradient(to top,
                #7f7fd5 0%,
              #91eae4 ${calculateCurrentPercentage()}%,
              rgb(10, 10, 10) ${calculateCurrentPercentage()}%
            )`,
                border: "1px solid #ccc",
              }}
            >
              <p className="value">{calculateCurrentPercentage()}%</p>
              <p className="label">CURRENT VALUE</p>
            </div>
          </div>
        </div>
        {showForm && (
          <AssetForm
            onClose={() => setShowForm(false)}
            reloadAssets={fetchAssets}
          />
        )}
      </div>

      {/* desktop */}
      <div className="hidden md:block w-[1180px] mx-auto ">
        <div className="grid grid-cols-2 gap-2 px-4 py-3  ">
          <div className="w-full h-[470px] bg-gray-300 rounded-xl">
            <AssetDetailDesktop id={assetId} />
          </div>
          <div className="w-full h-[470px] bg-gray-300 rounded-xl"></div>
        </div>
        <div className=" grid grid-rows-1 px-4">
          <div className="w-full h-[350px] bg-gray-300 rounded-xl">
            <CardSliderDesktop
              data={assets}
              reloadAssets={fetchAssets}
              onClick={(asset) => handleOnclick(asset)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
