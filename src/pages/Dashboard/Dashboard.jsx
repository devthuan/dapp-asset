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
import { useDispatch, useSelector } from "react-redux";
import DashboardLabelDesktop from "@/components/DashboardLabel/DashboardLabelDesktop";
import { LineChartCustom } from "@/components/Charts/LineChartCustom";
import { initData } from "@/redux/features/asset/assetSlice";
// import AssetFormDesktop from "@/components/AssetForm/AssetFormDesktop";

function Dashboard() {
  const dispatch = useDispatch();
  const assetId = useSelector((state) => state.asset.id) || 0;

  const [assets, setAssets] = useState([]);
  const { web3, account, privateKey } = useContext(WalletContext);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleOnclick = (event) => {
    console.log(event);
  };

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

      dispatch(initData(fullAssets));
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
        {/* Asset carousel */}
        <div className="carousel-wrapper">
          <CardSlider2 data={assets} reloadAssets={fetchAssets} />
        </div>
      </div>

     


    </div>
  );
}

export default Dashboard;
