import { useEffect, useState, memo, useCallback, SetStateAction } from "react";
import { Link } from "umi";
import {
  useStatus,
  useAccount,
  useChainId,
  useBalance,
  connect,
  addChain,
  switchChain,
} from "@cfxjs/use-wallet-react/ethereum";

import styles from "./../../../../layouts/index.less";
import style from "./index.less";

import logo from "./../../../../assets/logo.svg";
import logotxt from "./../../../../assets/logotxt.png";

import "./../../../../locales/config"; // 引用配置文件
import { useTranslation } from "react-i18next";
import { Button, Col, Row, Carousel, Modal } from "antd";

let myacc: any;
let tmpAccount = localStorage.getItem("acc");
const AddChainParameter = {
  chainId: "0x47", // A 0x-prefixed hexadecimal string   0x47   0x406
  chainName: "conflux espace testnet",
  nativeCurrency: {
    name: "CFX",
    symbol: "CFX", // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ["https://evm.confluxrpc.com"], // https://evmtestnet.confluxrpc.com  https://evm.confluxrpc.com
  //blockExplorerUrls: ['aaaa'],
  //iconUrls: ['https://'], // Currently ignored.
};

// web3 钱包登录
const WalletInfo: React.FC = memo(() => {
  const account = useAccount();
  const chainId = useChainId()!;
  const balance = useBalance()!;

  //const balanceT = balance?.toDecimalStandardUnit();
  //setStaketotal(balanceT);
  //init(balanceT);

  const handleClickSendTransaction = useCallback(async () => {
    if (!account) return;
    setTimeout(() => {
      // 加载隐藏
      (document.getElementById("spinner") as any).style.display = "none";
    }, 2000);
  }, [account]);
  if (tmpAccount != account) {
    localStorage.setItem("acc", account + "");
    location.reload();
  }
  return (
    <div onClick={handleClickSendTransaction}>
      {account?.slice(0, 7) +
        "..." +
        account?.slice(account.length - 5, account.length)}
    </div>
  );
});

const url = window.location.hash;

let reloadTimer: any;
function reload() {
  reloadTimer = setTimeout(() => {
    if (!myacc || myacc == undefined) {
      //console.log(myacc);
      reload();
    } else {
      location.reload();
    }
  }, 4000);
  return () => clearTimeout(reloadTimer);
}

const warning = () => {
  Modal.warning({
    wrapClassName: styles.zzzz,
    bodyStyle: { backgroundColor: "#393942", color: "#ffffff" },
    content: "Fluent Or MetaMask Not Install",
  });
};

// Function 切换网络--------------------------------------------
const onSwitchNetwork = async () => {
  try {
  } catch (error) {
    console.log(error);
  }
    const mess = await switchChain("0x47"); // 切换网络
    console.log(mess);
    if(null) {
      window.location.reload();
    } else {
      await addChain(AddChainParameter); // 添加网络
    }
    //window.location.reload();
 
};

function Header() {
  // web3 钱包登录状态
  const status = useStatus();
  myacc = useAccount();
  

  const [active, setActive] = useState(0);
  const [showSwitch, setShowSwitch] = useState(false);

  window.onhashchange = function () {
    switch (location.hash) {
      case "#/data/stake":
        setActive(0);
        break;
      case "#/data/unstake":
        setActive(0);
        break;
      case "#/data/pools":
        setActive(2);
        break;
      case "#/data/nut":
        setActive(3);
        break;
      case "#/data/rewards":
        setActive(4);
        break;
      case "#/data/analytics":
        setActive(5);
        break;

      default:
        break;
    }
  };

  const handleClickActvie = (index: SetStateAction<number>) => {
    setActive(index);
  };
  const { t, i18n } = useTranslation();

  
  const chainId = useChainId()!; // 正式网 测试网
  console.log(chainId);

  useEffect(() => {
    switch (url) {
      case "#/data/stake":
        setActive(0);
        break;
      case "#/data/unstake":
        setActive(0);
        break;
      case "#/data/pools":
        setActive(2);
        break;
      case "#/data/nut":
        setActive(3);
        break;
      case "#/data/rewards":
        setActive(4);
        break;
      case "#/data/analytics":
        setActive(5);
        break;

      default:
        break;
    }

    // 网路判断
    setTimeout(() => {
      if (chainId != "71") {
        setShowSwitch(true);
      }
    }, 20);

    setTimeout(() => {
      if (!myacc || myacc == undefined) {
        reload();
      }
    }, 5000);
  }, []);

  return (
    <div className={style.nav0}>
      <div className={style.sub_nav}>
        <Link to="/" style={{ color: "#FFF" }}>
          <img className={styles.logoimg} src={logo} height="30px" />
          <img className={styles.logotxt} src={logotxt} height="16px" />
        </Link>
        <div className={style.sub_nav_sub}>
          <Link
            to="/data/stake"
            onClick={() => {
              handleClickActvie(0);
            }}
            style={{ color: active === 0 ? "#EAB764" : "#FFF" }}
          >
            {t("stake.nav_stake")}
          </Link>
          <Link
            to="/data/pools"
            onClick={() => {
              handleClickActvie(2);
            }}
            style={{ color: active === 2 ? "#EAB764" : "#FFF" }}
          >
            {t("stake.nav_pools")}
          </Link>
          <Link
            to="/data/nut"
            onClick={() => {
              handleClickActvie(3);
            }}
            style={{ color: active === 3 ? "#EAB764" : "#FFF" }}
          >
            {t("stake.nav_nut")}
          </Link>
          <Link
            to="/data/rewards"
            onClick={() => {
              handleClickActvie(4);
            }}
            style={{
              color: active === 4 ? "#EAB764" : "#FFF",
              display: "none",
            }}
          >
            {t("stake.nav_rewards")}
          </Link>
        </div>
        <div className={style.account_box}>
          <Link
            to="/data/analytics"
            onClick={() => {
              handleClickActvie(5);
            }}
            style={{
              color: active === 5 ? "#EAB764" : "#FFF",
              fontSize: "18px",
              marginRight: "25px",
            }}
          >
            {t("stake.nav_analytics")}
          </Link>
          {status !== "in-detecting" && status !== "active" && (
            <div style={{ display: "inline-block" }}>
              <div
                style={{
                  color: "rgb(234, 185, 102)",
                  display: "inline-block",
                  lineHeight: "52px",
                  fontSize: "18px",
                  fontFamily: "Univa Nova",
                  cursor: "pointer",
                }}
                onClick={connect}
              >
                {status === "in-activating" && "connecting..."}
              </div>
              <div
                style={{
                  color: "rgb(234, 185, 102)",
                  display: "inline-block",
                  lineHeight: "52px",
                  fontSize: "18px",
                  fontFamily: "Univa Nova",
                  cursor: "pointer",
                }}
                onClick={warning}
              >
                {status === "not-installed" && "Connect Wallet"}
              </div>
              <div
                style={{
                  color: "rgb(234, 185, 102)",
                  display: "inline-block",
                  lineHeight: "52px",
                  fontSize: "18px",
                  fontFamily: "Univa Nova",
                  cursor: "pointer",
                }}
                onClick={connect}
              >
                {status === "not-active" && "Connect Wallet"}
              </div>
            </div>
          )}
          <div
            style={{ display: showSwitch === true ? "none" : "inline-block" }}
          >
            <div
              style={{ display: status === "active" ? "inline-block" : "none" }}
              className={style.account}
            >
              {status === "active" && <WalletInfo />}
              <div className={style.yuan}></div>
            </div>
          </div>
          <div
            style={{ display: showSwitch === true ? "inline-block" : "none" }}
          >
            <div
              style={{
                display: "inline-block",
                textAlign: "center",
                cursor: "pointer",
              }}
              className={style.account}
              onClick={() => {
                onSwitchNetwork();
              }}
            >
              Switch Network
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
