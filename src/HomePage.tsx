import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the path as needed
import Head from "next/head";
import Image from "next/image";
import NewsSlider from "./NewsSlider";
import Carousel from "./Carousel";
import { EmblaOptionsType } from 'embla-carousel'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { GatewayProvider } from "@civic/solana-gateway-react";
import { DefaultCandyGuardRouteSettings, Nft } from "@metaplex-foundation/js";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  BackpackWalletAdapter,
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SafePalWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { useMemo } from "react";

import Mintingdapp from "./Mintingdapp";
import { rpcHost, candyMachineId, network } from "./config";

import AOS from 'aos';
import 'aos/dist/aos.css';



const Wrapper = styled.div`
  font-family: Arial, sans-serif;
  margin: 0px;
  padding: 0px;
  height: 100%;
  background-color: #111111;
  background: #111111;
  position: absolute;
`;
const GrayOverlay = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;

  /* Allow pointer events to pass through */
  pointer-events: none;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    width: 0%;
    height: 0%;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    width: 0%;
    height: 0%;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    width: 100%;
    height: 120%;
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    width: 100%;
    height: 160%;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    width: 100%;
    height: 180%;
  }
`;




// ===================== HEADER ========================


const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
  background-color: #111111;
  color: #fff;
  padding: 40px 100px; /* Adjust padding as needed */
  text-align: center;
  z-index: 9999;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    padding: 5px 30px; /* Adjust padding as needed */

  }

    @media (min-width: 576px) {
    /* Small devices (phones) */
    padding: 5px 30px; /* Adjust padding as needed */

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    padding: 40px 30px; /* Adjust padding as needed */
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 40px 50px; /* Adjust padding as needed */

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 40px 100px; /* Adjust padding as needed */

  }



`;

const ToggleButton = styled.button`
  z-index: 10;
  margin-right: 10px;
`;

const NavOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: ${props => props.visible ? 'block' : 'none'};
  z-index: 9;

`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;


`;


const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;


const Logo = styled.h1`
  margin-right: 20px;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    margin-right: 10px;
    font-size: 1rem;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    margin-right: 10px;
    font-size: 1.6rem;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    margin-right: 20px;
    font-size: 1.8rem;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
   
    margin-right: 20px;
    font-size: 1.8rem;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    margin-right: 20px;
    font-size: 2rem;


  }
`;

const NavLinksContainer = styled.div`
  display: flex;
  align-items: center;
`;

const NavLinksContainerMobile = styled.div`
  background-color: #111111;
  height: 100vh;
  position: fixed;  
  width: 100%;      
  top: 0;           
  left: 0;          
  z-index: 9999;    
  display: flex;
  flex-direction: column;
  justify-content: center;

  * {
    padding: 10% 0px 10% 0px;
  }
`;


const NavLink = styled.a`
  color: #fff;
  margin-left: 60px; 
  text-decoration: none;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    margin-left: 10px; 
    font-size: 0.6rem;


  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    margin-left: 10px; 
    font-size: 0.6rem;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    margin-left: 30px; 
    font-size: 0.7rem;
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    margin-left: 40px; 
    font-size: 0.9rem;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    margin-left: 60px; 
    font-size: 1.2rem;

  }
`;


const NavLinkMobile = styled.a`
  color: #fff;
  margin-left: 60px; 
  text-decoration: none;
  font-weight: bold;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    margin-left: 10px; 
    font-size: 1rem;


  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    margin-left: 10px; 
    font-size: 1rem;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    margin-left: 30px; 
    font-size: 1rem;
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    margin-left: 40px; 
    font-size: 0.9rem;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    margin-left: 60px; 
    font-size: 1.2rem;

  }
`;

const GearIcon = styled.button`
  border: none;
  margin-left: 15px; /* Adjust margin as needed */
  border-left: 1px solid #fff;
  padding-left: 15px; /* Adjust padding as needed */
  font-size: 25px; /* Adjust the size as needed */
  background-color: transparent;
  color: #ffffff;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    padding-left: 15px; /* Adjust padding as needed */
    font-size: 13px; /* Adjust the size as needed */

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    padding-left: 15px; /* Adjust padding as needed */
    font-size: 13px; /* Adjust the size as needed */

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    padding-left: 15px; /* Adjust padding as needed */
    font-size: 18px; /* Adjust the size as needed */

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding-left: 15px; /* Adjust padding as needed */
    font-size: 18px; /* Adjust the size as needed */


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding-left: 15px; /* Adjust padding as needed */
    font-size: 25px; /* Adjust the size as needed */

  }
`;

const NavButtonContainer = styled.div`
  display: flex;
  align-items: center;
  button {

    @media (min-width: 280px) {
      /* Extra Small devices (phones) */
      margin-right: 0px;

    }
  
    @media (min-width: 576px) {
      /* Small devices (phones) */
      margin-right: 2px;

    }
  
    @media (min-width: 768px) {
      /* Medium devices (tablets) */
      margin-right: 5px;

      
    }
  
    @media (min-width: 992px) {
      /* Large devices (desktops) */
      margin-right: 20px;

  
      
    }
  
    @media (min-width: 1200px) {
      /* Extra large devices (large desktops) */
      margin-right: 20px;

    }


  }


`;

const NavButton = styled.button`
  padding: 10px 20px;
  background-color: #ffffff;
  color: black;
  border: 1px solid lightgray; 
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 200ms ease-in-out;

  &:hover {
    background-color: lightgray;
  }
  
  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    padding: 3px 12px;
    font-size: 0.4rem;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    padding: 2px 12px;
    font-size: 0.5rem;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    padding: 6px 16px;
    font-size: 0.6rem;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 8px 18px;
    font-size: 0.8rem;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 10px 20px;
    font-size: 1.0rem;
  }
  
`;

const WalletContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: right;
  align-items: center; // Keeps items vertically aligned
  margin: 30px;
  z-index: 999;
  position: relative;

  .wallet-adapter-dropdown-list {
    background: #ffffff;
    max-width: 100%; // Ensure it does not overflow the container
  }
  .wallet-adapter-dropdown-list-item {
    background: #000000;
  }
  .wallet-adapter-dropdown-list {
    grid-row-gap: 5px;
  }
`;

const Wallet = styled.ul`
  flex: 1 1 auto; // Allows the Wallet to grow and shrink
  margin: 0;
  padding: 0;
  list-style-type: none; // No list marker
  
`;

const WalletAmount = styled.div`
  color: #111111;
  min-width: 48px;
  height: 30px; // Fixed height to avoid height changes
  border-radius: 5px;
  background-color: #D3D3D3;
  box-sizing: border-box;
  transition: background-color 250ms, box-shadow 250ms, border 250ms;
  font-weight: 600;
  text-transform: uppercase;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  white-space: nowrap; // Prevents text wrapping
  padding: 20px 10px; // Maintaining padding to keep it visually pleasing

`;


const ConnectButton = styled(WalletMultiButton)`
  line-height: 14px;
  border-radius: 5px !important;
  background-color: #fff;
  color: #000;
  margin-right: 0px !important;
  font-size: 1em;
  padding: 6px 16px;
  white-space: nowrap; // Prevents text wrapping
  height: 30px; // Fixed height to match WalletAmount
`;

// Media queries in your WalletAmount and ConnectButton components look fine,
// but ensure that you test these in different devices to validate their effectiveness.



// =============================================================

const Main = styled.main`
  padding: 0px;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color:#111111;
`;


const HeroBoxCol = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    display: grid;
    text-align: left;
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    display: grid;
    text-align: left;

  }

`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  padding: 0 120px; /* Add padding to both sides */
  margin-right: 20px; /* Add margin to the right */

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    padding: 0 20px; /* Add padding to both sides */

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    padding: 0 40px; /* Add padding to both sides */

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    padding: 0 60px; /* Add padding to both sides */

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 0 80px; /* Add padding to both sides */


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 0 120px; /* Add padding to both sides */

  }


`;

const RightColumn = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  img {
    max-width: 900px !important;
    max-height: 450px !important;
  }

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    img {
      max-width: 400px !important;
      max-height: 200px !important; /* Maintain 2:1 aspect ratio */
    }

    margin-top: 60px;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    img {
      max-width: 400px !important;
      max-height: 200px !important; /* Maintain 2:1 aspect ratio */
    }

    margin-top: 60px;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    img {
      max-width: 400px !important;
      max-height: 200px !important; /* Maintain 2:1 aspect ratio */
    }

    margin-top: 60px;
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    img {
      max-width: 900px !important;
      max-height: 450px !important;
    }

    margin-top: 0px;
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    img {
      max-width: 900px !important;
      max-height: 450px !important;
    }

    margin-top: 0px;
  }
`;


const HeroHeader = styled.h1`
  font-size: 2.5rem; 
  margin-bottom: 20px;
  color: #FFDB5A;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 1.1rem; 

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.2rem; 
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.5rem; 
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 2.0rem; 


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 2.5rem; 

  }



`;

const HeroParagraph = styled.p`
  font-size: 1.6rem;
  margin-bottom: 20px;


  
  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 0.8rem;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.0rem;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.0rem;
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.2rem;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 1.6rem;

  }

`;

const WhiteButton = styled.button`
  padding: 10px 20px;
  background-color: #ffffff;
  color: black;
  border: 1px solid lightgray; 
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 10px;
  font-size: 0.8rem;

  a {
    text-decoration: none;
    color: black;
  }


  transition: all 200ms ease-in-out;

  &:hover {
    background-color: lightgray;
  }
  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 0.7rem;
    padding: 5px 10px;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 0.7rem;
    padding: 5px 10px;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 0.7rem;
    padding: 5px 10px;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 0.8rem;
    padding: 10px 20px;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 0.8rem;
    padding: 10px 20px;

  }
`;

const TransparentButton = styled.button`
  padding: 10px 20px;
  background-color: transparent;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 10px;
  a {
    text-decoration: none;
    color: #fff;
    &:hover {
      color: black;
    }
  }


  transition: all 200ms ease-in-out;

  &:hover {
    background-color: lightgray;
  }
  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 0.7rem;
    padding: 5px 10px;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 0.7rem;
    padding: 5px 10px;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 0.7rem;
    padding: 5px 10px;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 0.8rem;
    padding: 10px 20px;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 0.8rem;
    padding: 10px 20px;

  }
`;

const HIWBoxCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const HIWBox = styled.div`
margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 120px; /* Add padding to both sides */

  * {
    padding: 15px 0px 0px 0px;
  }

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    padding: 0 20px;


  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    padding: 0 40px;


  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    padding: 0 80px;


    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 0 100px;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 0 280px;

  }

`;


const HIWHeader = styled.h2`
  font-size: 2.5rem; 
  margin-bottom: 20px;
  color: #fff;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 1.0rem; 

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.2rem; 

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.8rem; 

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 2.0rem; 

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 2.5rem; 

  }


`;

const HIWParagraph = styled.p`
  font-size: 1.6rem; /* Increase font size */


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 0.8rem;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.0rem;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.2rem;
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.4rem;
    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 1.6rem;
  }

`;


const HeroBoxColThree = styled.div`
    // padding: 100px 0px;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr; /* Divide into three equal columns */
    column-gap: 10px; /* Add column gap */

    @media (min-width: 280px) {
      /* Extra Small devices (phones) */


      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      text-align: left;
      width: 90%;
      margin: 30px 0px;

    }

    @media (min-width: 576px) {
      /* Small devices (phones) */


      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      text-align: left;
      margin: 30px 0px;
    }

    @media (min-width: 768px) {
      /* Medium devices (tablets) */


      display: grid;
      margin: 100px 0px;
      
    }

    @media (min-width: 992px) {
      /* Large devices (desktops) */
      display: grid;
      margin: 100px 0px;

      
    }

    @media (min-width: 1200px) {
      /* Extra large devices (large desktops) */
      display: grid;
      margin: 100px 0px;

    }
`;

const Col1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 80px; /* Add padding to both sides */
  

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    width: 100%;
    padding: 20px 12px 12px 12px; /* Add padding to both sides */
    background-color: rgb(66, 66, 66, 0.5);
    border: 2px solid #424242;
    border-radius: 8px 8px 8px 8px;
    margin-bottom: 20px;


  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    width: 100%;
    padding: 20px 12px 12px 12px; /* Add padding to both sides */
    background-color: rgb(66, 66, 66, 0.5);
    border: 2px solid #424242;
    border-radius: 8px 8px 8px 8px;
    margin-bottom: 20px;


  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
  
    padding: 0 0px; /* Add padding to both sides */
    width: 100%;
    background-color: transparent;
    border: none;
    border-radius: 0px;

    margin-bottom: 0px;

  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 0 40px; /* Add padding to both sides */
  
    width: auto;
    background-color: transparent;
    border: none;
    border-radius: 0px;
    margin-bottom: 0px;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 0 80px; /* Add padding to both sides */
    width: auto;
    background-color: transparent;
    border: none;
    border-radius: 0px;
    margin-bottom: 0px;


  }

`;

const Col2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-left: 2px solid white;
  border-right: 2px solid white;
  padding: 0 80px; /* Add padding to both sides */

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    width: 100%;
    padding: 20px 12px 12px 12px; /* Add padding to both sides */
    background-color: rgb(66, 66, 66, 0.5);
    border: 2px solid #424242;
    border-radius: 8px 8px 8px 8px;
    margin-bottom: 20px;


  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    width: 100%;
    padding: 20px 12px 12px 12px; /* Add padding to both sides */
    background-color: rgb(66, 66, 66, 0.5);
    border: 2px solid #424242;
    border-radius: 8px 8px 8px 8px;
    margin-bottom: 20px;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
  
    padding: 0 0px; /* Add padding to both sides */
    width: 100%;
    background-color: transparent;
    border: none;
    border-radius: 0px;
    margin-bottom: 0px;

  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 0 40px; /* Add padding to both sides */
  
    width: auto;
    background-color: transparent;
    border-left: 2px solid white;
    border-right: 2px solid white;
    border-radius: 0px;
    margin-bottom: 0px;
    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 0 80px; /* Add padding to both sides */
    width: auto;
    background-color: transparent;
    border-left: 2px solid white;
    border-right: 2px solid white;
    border-radius: 0px;
    margin-bottom: 0px;
  }


`;

const Col3 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 80px; /* Add padding to both sides */

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    width: 100%;
    padding: 20px 12px 12px 12px; /* Add padding to both sides */
    background-color: rgb(66, 66, 66, 0.5);
    border: 2px solid #424242;
    border-radius: 8px 8px 8px 8px;


  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    width: 100%;
    padding: 20px 12px 12px 12px; /* Add padding to both sides */
    background-color: rgb(66, 66, 66, 0.5);
    border: 2px solid #424242;
    border-radius: 8px 8px 8px 8px;


  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
  
    padding: 0 0px; /* Add padding to both sides */
    width: 100%;
    background-color: transparent;
    border: none;
    border-radius: 0px;


  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 0 40px; /* Add padding to both sides */
  
    width: auto;
    background-color: transparent;
    border: none;
    border-radius: 0px;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 0 80px; /* Add padding to both sides */
    width: auto;
    background-color: transparent;
    border: none;
    border-radius: 0px;

  }


`;

const ColHeading = styled.h2`
  font-size: 1.6rem; 
  margin-bottom: 20px;
  color: #fff;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 0.8rem; 

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 0.9rem; 

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.0rem; 
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.2rem; 

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 1.6rem; 
  }

`;

const ColParagraph = styled.p`
  font-size: 1.2rem; /* Increase font size */
  margin-bottom: 20px;
  color: #fff;


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 0.8rem; 

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 0.9rem; 

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 0.8rem; 
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.1rem; 

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 1.2rem; 
  }

`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 50%;
  
  background-color: rgba(0, 0, 0, 1); /* Adjust the opacity as needed */

`;


const InfoSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 0px 80px 0px;
  background: #111111;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    padding: 0 20px;


  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    padding: 0 40px;


  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    padding: 0 80px;


    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 80px 0px 80px 0px;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 80px 0px 80px 0px;

  }


`;


const InfoBoxCol = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  column-gap: 0px;
  padding: 50px 0px 50px 0px;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 
    text-align: center;
    
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 
    text-align: center;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 
    text-align: center;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    display: grid;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    display: grid;

  }


`;


const InfoBoxCol2 = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  column-gap: 0px;
  padding: 50px 0px 50px 0px;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center; 
    text-align: center;
    
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center; 
    text-align: center;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center; 
    text-align: center;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    display: grid;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    display: grid;

  }


`;

const InfoLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 120px; /* Add padding to both sides */

  * {
    padding: 15px 0px 0px 0px;
  }


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    padding: 0 20px;
    align-items: center;
    text-align: center;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    padding: 0 20px;
    align-items: center;  
    text-align: center;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    padding: 0 20px;
    align-items: center;
    text-align: center;

  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 0 120px;
    align-items: flex-start;
    text-align: left;

  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 0 120px;
    align-items: flex-start;
    text-align: left;
  }

`;


// Info
const InfoRightColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    margin: 0px 20px;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    margin: 0px 20px;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    margin: 0px 20;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    margin: 0px;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    margin: 0px;

  }
`;

const InfoHeader = styled.h2`
  font-size: 2.5rem; 
  margin-bottom: 20px;
  color: #FFDB5A;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 1.0rem; 

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.2rem; 

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.8rem; 

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 2.0rem; 

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 2.5rem; 

  }


`;

const InfoParagraph = styled.p`
  font-size: 1.6rem; /* Increase font size */
  margin-bottom: 20px;


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 0.8rem;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.0rem;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.2rem;
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.4rem;
    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 1.6rem;
  }


`;

const MarketStatsSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh; 
  width: 100%;
  background-image: linear-gradient(to bottom, rgb(22, 22, 22) 0%, #111111 82%, #09090B 100%);
  padding: 30px 0px;


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    padding: 30px 0px;
    min-height: auto; 

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    padding: 30px 0px;
    min-height: auto; 

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    padding: 30px 0px;
    min-height: auto; 
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 30px 0px;
    min-height: 100vh; 

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 30px 0px;
    min-height: 100vh; 


  }
`;



const Hexagon1 = styled.img`

  position: absolute;
  width: 15%;
  height: auto;
  top: 40%;
  left: 10%;


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    opacity: 0%;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    opacity: 0%;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    opacity: 0%;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    opacity: 80%;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    opacity: 80%;

  }


`;


const Hexagon2 = styled.img`

  position: absolute;
  width: 15%;
  height: auto;
  top: 6%;
  left: 30%;
  opacity: 80%;

 



`;

const Hexagon3 = styled.img`

  position: absolute;
  width: 5%;
  height: auto;
  top: 10%;
  left: 20%;
  opacity: 70%;

  


`;




const MarketStatsBox = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 60%;

  * {
    margin: 20px 0px 20px 0px;
  }

  img {
    border: 2px solid white;
  }



  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    width: 85%;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    width: 85%;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    width: 90%;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    width: 60%;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    width: 60%;

  }

`;

const MarketStatsHeader = styled.h2`
  font-size: 2.5rem; 
  margin-bottom: 20px;
  color: #FFDB5A;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 1.0rem; 

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.2rem; 

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.8rem; 

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 2.0rem; 

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 2.5rem; 

  }
  
`;

const MarketStatsParagraph = styled.p`
  font-size: 1.6rem; /* Increase font size */
  margin-bottom: 50px;


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 0.8rem;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.0rem;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.2rem;
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.4rem;
    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 1.6rem;
  }
`;


const TotalCirculationWidget = styled.div`
    display: flex;
    flex-direction: row;
    padding: 10px 30px;
    background-color: #292929;
    border: 2px solid #424242;
    border-radius: 14px;
    justify-content: space-around;
    align-items: center;
    flex-wrap: now-wrap;


`;


const CirlceFrameImg = styled.img`
    border-radius: 50%;
    max-width: 30%;
    height: 30%;
    flex: 1;



`;


const SupplyBox = styled.div`
    display: flex;
    flex-direction: column;
    // padding: 15px 20px;
    justify-content: flex-start;
    align-items: flex-start;
    flex: 2;
    margin-left: 20px;


`;


const SupplyHeading = styled.h3`
    color: #fff;
    margin: 0px;
    font-weight: bold;
    font-size: 2em;

    @media (min-width: 280px) {
      /* Extra Small devices (phones) */
      font-size: 1.3rem;
    }
  
    @media (min-width: 576px) {
      /* Small devices (phones) */
      font-size: 1.5rem;
    }
  
    @media (min-width: 768px) {
      /* Medium devices (tablets) */
      font-size: 1.7rem;    
    }
  
    @media (min-width: 992px) {
      /* Large devices (desktops) */
      font-size: 1.8rem;    
    }
  
    @media (min-width: 1200px) {
      /* Extra large devices (large desktops) */
      font-size: 2rem;  }
  

`;


const SupplyText = styled.p`
    color: #fff;
    font-size: 1.4em;
    margin-left: 10px;
    text-align: left;

    @media (min-width: 280px) {
      /* Extra Small devices (phones) */
      font-size: 1.0rem;
    }
  
    @media (min-width: 576px) {
      /* Small devices (phones) */
      font-size: 1.1rem;
    }
  
    @media (min-width: 768px) {
      /* Medium devices (tablets) */
      font-size: 1.2rem;    
    }
  
    @media (min-width: 992px) {
      /* Large devices (desktops) */
      font-size: 1.3rem;    
    }
  
    @media (min-width: 1200px) {
      /* Extra large devices (large desktops) */
      font-size: 1.4rem;  }
  

`;


const SliderSection = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 180px 0px 180px 0px;
  background-color: #111111;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    padding: 30px 0px;
    min-height: auto; 

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    padding: 30px 0px;
    min-height: auto; 

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    padding: 30px 0px;
    min-height: auto; 
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 100px 0px 100px 0px;
    min-height: 100vh; 

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 120px 0px 120px 0px;
    min-height: 100vh; 


  }

`;


const SliderBox = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;

`;

const SliderHeader = styled.h2`
  font-size: 2.5rem; /* Increase font size */
  margin: 40px 0px 20px 0px;
  color: #fff;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 1.3rem;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.5rem;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.7rem;    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.8rem;    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 2rem;  
  }

`;

const SliderParagraph = styled.p`
  font-size: 1.6rem; /* Increase font size */
  margin-bottom: 20px;
  margin: 0px 0px 40px 0px;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 0.8rem;
    padding: 0 20px;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.0rem;
    padding: 0 20px;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.2rem;
    padding: 0 20px;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.4rem;
    padding: 0 120px;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 1.6rem;
    padding: 0 120px;

  }
`;

const CarouselSection = styled.section`

  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 60px 0px 100px 0px;
  // background-image: radial-gradient(circle, #333333, #111111);
  // background-image: #292929;
  background-color: #101010;
  border: 1px solid #151518;


`;


const CarouselHeader = styled.h2`
font-size: 2.5rem; /* Increase font size */
margin: 40px 0px 20px 0px;
color: #fff;

@media (min-width: 280px) {
  /* Extra Small devices (phones) */
  font-size: 1.3rem;
}

@media (min-width: 576px) {
  /* Small devices (phones) */
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  /* Medium devices (tablets) */
  font-size: 1.7rem;    
}

@media (min-width: 992px) {
  /* Large devices (desktops) */
  font-size: 1.8rem;    
}

@media (min-width: 1200px) {
  /* Extra large devices (large desktops) */
  font-size: 2rem;  
}



`;

const CarouselParagraph = styled.p`
font-size: 1.6rem; /* Increase font size */
margin-bottom: 20px;
margin: 0px 0px 40px 0px;

@media (min-width: 280px) {
  /* Extra Small devices (phones) */
  font-size: 0.8rem;
  padding: 0 20px;

}

@media (min-width: 576px) {
  /* Small devices (phones) */
  font-size: 1.0rem;
  padding: 0 20px;

}

@media (min-width: 768px) {
  /* Medium devices (tablets) */
  font-size: 1.2rem;
  padding: 0 20px;

  
}

@media (min-width: 992px) {
  /* Large devices (desktops) */
  font-size: 1.4rem;
  padding: 0 120px;

  
}

@media (min-width: 1200px) {
  /* Extra large devices (large desktops) */
  font-size: 1.6rem;
  padding: 0 120px;

}
`;

const LogoImage = styled.img`
 
  border-radius: 50%;
  filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 1));

  
  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    max-width: 60%;
  }

    @media (min-width: 576px) {
    /* Small devices (phones) */
    max-width: 70%;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    max-width: 60%;
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    max-width: 50%;
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    max-width: 30%;
  }

`;



const HeroText = styled.div`
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  text-align: center;
  align-items: center;
  padding: 0px;


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    left: 10%;
    top: 40%;
    transform: translate(-5%, -50%);
    h2 {
      font-size: 1.8rrem;
    }
    p {
      font-size: 1rrem;
      margin-top: 30px;
    }
  }

    @media (min-width: 576px) {
    /* Small devices (phones) */
    left: 10%;
    top: 40%;
    transform: translate(-5%, -50%);
    h2 {
      font-size: 2.5rrem;
    }
    p {
      font-size: 1rrem;
      margin-top: 30px;
    }
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    left: 10%;
    top: 40%;
    transform: translate(-5%, -50%);
    h2 {
      font-size: 3.5rrem;
    }
    p {
      font-size: 1.2rrem;
      margin-top: 30px;
    }
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    h2 {
      font-size: 4rrem;
    }
    p {
      font-size: 1.4rrem;
      margin-top: 30px;
    }
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    h2 {
      font-size: 3.5rrem;
    }
    p {
      font-size: 1.6rrem;
      margin-top: 30px;
    }
  }
`;

const BetaTag = styled.sup`
  font-size: 0.8rrem;
`;



// const NewsSection = styled.section`
//   padding-top: 40px;
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: space-evenly;
//   background: #09090B;
//   border: 1px solid #151518;
// `;

const NewsSection = styled.section`
  width: 100%;

`;
const Row = styled.div`
  padding-top: 40px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  background: #09090B;
  margin-bottom: 50px;


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    flex-wrap: wrap;
  }

    @media (min-width: 576px) {
    /* Small devices (phones) */
    flex-wrap: wrap;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    flex-wrap: no-wrap;
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    flex-wrap: no-wrap;
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    flex-wrap: no-wrap;
}
  
`

const Column = styled.div`
  width: 380px; /* Set a fixed width for each column */
  border: 2px solid #27272A;
  border-radius: 8px;
  margin-bottom: 20px;



  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
        width: 80%;
  }

    @media (min-width: 576px) {
    /* Small devices (phones) */
        width: 80%;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    width: 200px;
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    width: 250px;
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    width: 300px;
  }
`;




const ImageMax = styled.img`
  width: 100%;
  border-radius: 6px;
`;


const Text = styled.div`
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    
    // background: #000F11;
    border-top: 1px solid #27272A;
    padding: 20px;
    
`;

const Heading = styled.h2`
  color: #ffffff;
  margin-bottom: 10px;
`;

const Paragraph = styled.p`
  color: #fff;
  margin-bottom: 20px;

`;


const FaqsSection = styled.section`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  padding-top: 40px;
  width: 100%;
  background: #09090B;
  border: 1px solid #151518;

  h2 {
    font-size: 1.8rrem;
    margin-bottom: 30px;

  }

`
const NewsLetterSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
  flex-direction: column;
  padding-top: 40px;
  width: 100%;
  background: rgba(17, 17, 17, 1);
  
  
  border: 1px solid #151518;

  h2 {
    font-size: 1.8rrem;
  }
  
  

`

const NewsLetterSectionColBox = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  column-gap: 0px;
  padding: 50px 40px 50px 40px;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    display: flex;
    flex-direction: column;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    display: grid;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    display: grid;

  }


`

const NewsLetterSectionColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;


  padding: 0 20px;

  * {
    padding: 15px 0px 0px 0px;
  }

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    justify-content: center;
    align-items: center;
    text-align: center;
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    justify-content: center;
    align-items: flex-start;
    text-align: left;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    justify-content: center;
    align-items: flex-start;
    text-align: left;
  }

`;

const NewsLetterImageColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NewsLetterHeadeing = styled.h2`
  font-size: 2.5rem; /* Increase font size */
  margin-bottom: 70px;
  color: rgb(255, 219, 90);


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 1.8rem;
    margin-bottom: 10px;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.8rem;
    margin-bottom: 10px;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.8rem;
    margin-bottom: 70px;
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 2.0rem;
    margin-bottom: 70px;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 2.5rem;
    margin-bottom: 70px;

  }


`;

const NewsLetterParagraph = styled.p`
  font-size: 1.2rem; /* Increase font size */
  margin-bottom: 20px;


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 1.0rem; 
    margin-bottom: 5px;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.0rem; 
    margin-bottom: 5px;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.0rem; 
    margin-bottom: 20px;

  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.0rem; 
    margin-bottom: 20px;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 1.2rem; 
    margin-bottom: 20px;

  }

`;


const NewsLetterTopText = styled.p`
  font-size: 0.8rem; /* Increase font size */
  opacity: 80%;
  margin-bottom: 20px;

`;
const NewsLetterBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  padding-bottom: 40px;
  width: 100%;
  background-color: rgb(66, 66, 66, 0.2);
  box-shadow: 0 0 15px 5px rgba(66, 66, 66, 0.8);
  border-radius: 20px;
  margin: 60px 0px 100px 0px;
  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    max-width: 80%;
  }

    @media (min-width: 576px) {
    /* Small devices (phones) */

    max-width: 80%;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    max-width: 80%;
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    max-width: 70%;
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    max-width: 50%;
  }

`;

const DottedSquare1 = styled.img`
  position: absolute;
  right: -90px;
  top: -65px;
  width: 25%;
  opacity: 50%;

`;


const DottedSquare2 = styled.img`
  position: absolute;
  left: -140px;
  bottom: -20px;
  width: 25%;
  transform: rotate(90deg);
  opacity: 50%;


`;

const Alert = styled.p`
  background: transparent;
  padding: 10px 20px;
  color: green;
  filter: drop-shadow(0px 0px 1px rgba(0, 255, 0, 0.3));
  transition: all 0.5s ease-in-out;

`;


const NewsletterForm = styled.form`

  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid #27272A;
  border-radius: 6px;
  background-color: #FFDB58;


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    background-color: transparent;
    flex-direction: column;
    width: 80%;
    padding: 10px;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    background-color: transparent;
    flex-direction: column;
    width: 80%;
    padding: 10px;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    background-color: transparent;
    flex-direction: column;
    width: 80%;
    padding: 10px;
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    background-color: #FFDB58;
    width: 90%;
    padding: 0px;
    flex-direction: row;
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    background-color: #FFDB58;
    width: 90%;
    padding: 0px;
    flex-direction: row;
  }
`;

const NoticeMessage = styled.p`
  font-size: 1.0rem;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 0.7rem;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 0.7rem;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 0.8rem;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 0.9rem;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 1.0rem;

  }

`;

const EmailInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  &:focus {
    outline: none; 
  }

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    margin-bottom: 10px;
    width: 95%;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    margin-bottom: 10px;
    width: 95%;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    margin-bottom: 10px;
    width: 95%;

  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    margin-bottom: 0px;

    width: 100%;    
    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    margin-bottom: 0px;

    width: 100%;

  }

`;


const SubscribeButton = styled.button`
  width: 30%;
  background-color: #FFDB58;
  color: #1B1B1B;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 0px 4px 4px 0px;
  cursor: pointer;
  padding: 12px;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    background-color: #FFDB58;
    color: #111111;
    width: 100%;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    background-color: #FFDB58;
    color: #111111;
    width: 100%;
    
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    background-color: #FFDB58;
    color: #111111;
    width: 99%;
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    width: 30%;
    background-color: #FFDB58;
    color: #1B1B1B;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    width: 30%;
    background-color: #FFDB58;
    color: #1B1B1B;
  }
`;



const PartnersSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  background-color:#111111;


`;

const PartnersHeading = styled.h3`
  font-size: 1.0em;
  margin-top: 100px;
  color: #ffffffcc;

`

const PartnersBox = styled.section`
    // padding: 100px 0px;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr; /* Divide into three equal columns */
    column-gap: 10px; /* Add column gap */

    @media (min-width: 280px) {
      /* Extra Small devices (phones) */


      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      text-align: left;
      width: 90%;
      margin: 30px 0px;

    }

    @media (min-width: 576px) {
      /* Small devices (phones) */


      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      text-align: left;
      margin: 30px 0px;
    }

    @media (min-width: 768px) {
      /* Medium devices (tablets) */


      display: grid;
      margin: 100px 0px;
      
    }

    @media (min-width: 992px) {
      /* Large devices (desktops) */
      display: grid;
      margin: 100px 0px;
      width: 90%;
      
    }

    @media (min-width: 1200px) {
      /* Extra large devices (large desktops) */
      display: grid;
      margin: 100px 0px;
      width: 90%;
    }
`;


const PartnerCol1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 80px; /* Add padding to both sides */
  

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    width: 100%;
    padding: 20px 12px 12px 12px; /* Add padding to both sides */
    background-color: rgb(66, 66, 66, 0.5);
    border: 2px solid #424242;
    border-radius: 8px 8px 8px 8px;
    margin-bottom: 20px;
    display: none;


  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    width: 100%;
    padding: 20px 12px 12px 12px; /* Add padding to both sides */
    background-color: rgb(66, 66, 66, 0.5);
    border: 2px solid #424242;
    border-radius: 8px 8px 8px 8px;
    margin-bottom: 20px;
    display: none;


  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
  
    padding: 0 0px; /* Add padding to both sides */
    width: 100%;
    background-color: transparent;
    border: none;
    border-radius: 0px;

    margin-bottom: 0px;
    display: block;

  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 0 40px; /* Add padding to both sides */
  
    width: auto;
    background-color: transparent;
    border: none;
    border-radius: 0px;
    margin-bottom: 0px;
    display: block;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 0 80px; /* Add padding to both sides */
    width: auto;
    background-color: transparent;
    border: none;
    border-radius: 0px;
    margin-bottom: 0px;
    display: block;



  }

`;
const PartnerCol2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 80px; /* Add padding to both sides */
  border-left: 1px solid rgba(24, 24, 24, 1);
  border-right: 1px solid rgba(24, 24, 24, 1);
 
  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    width: 80%;
    padding: 20px 12px 12px 12px; /* Add padding to both sides */
    background-color: rgb(66, 66, 66, 0.5);
    border: 2px solid #424242;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    width: 80%;
    padding: 20px 12px 12px 12px; /* Add padding to both sides */
    background-color: rgb(66, 66, 66, 0.5);
    border: 2px solid #424242;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    padding: 0; /* Remove padding */
    width: 100%;
    background-color: transparent;
    border: none;
    border-radius: 0;
    margin-bottom: 0;
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 0; /* Remove padding */
    width: auto;
    background-color: transparent;
    border-left: 1px solid rgba(24, 24, 24, 1);
    border-right: 1px solid rgba(24, 24, 24, 1);
   
    margin-bottom: 0;
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 0; /* Remove padding */
    width: auto;
    background-color: transparent;
    border-left: 1px solid rgba(24, 24, 24, 1);
    border-right: 1px solid rgba(24, 24, 24, 1);
 
    margin-bottom: 0;
  }
`;



const PartnerCol3 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 80px; /* Add padding to both sides */

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    width: 100%;
    padding: 20px 12px 12px 12px; /* Add padding to both sides */
    background-color: rgb(66, 66, 66, 0.5);
    border: 2px solid #424242;
    border-radius: 8px 8px 8px 8px;
    display: none;



  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    width: 100%;
    padding: 20px 12px 12px 12px; /* Add padding to both sides */
    background-color: rgb(66, 66, 66, 0.5);
    border: 2px solid #424242;
    border-radius: 8px 8px 8px 8px;
    display: none;



  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
  
    padding: 0 0px; /* Add padding to both sides */
    width: 100%;
    background-color: transparent;
    border: none;
    border-radius: 0px;
    display: block;


  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    padding: 0 40px; /* Add padding to both sides */
  
    width: auto;
    background-color: transparent;
    border: none;
    border-radius: 0px;
    display: block;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    padding: 0 80px; /* Add padding to both sides */
    width: auto;
    background-color: transparent;
    border: none;
    border-radius: 0px;
    display: block;


  }


`;

const LearnMoreButton = styled.button`
    padding: 10px 20px;
    background-color: ${props => props.color || '#ffffff'};
    background-color: #5B5B5B;
    color: ${props => props.fontColor || '#000'};
    border: 1px solid #fff; 
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    transition: all 200ms ease-in-out;

    &:hover {
        background-color: lightgray;
        color: black;
    }
`;


const AccordionWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 50px;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    max-width: 80%;
  }

    @media (min-width: 576px) {
    /* Small devices (phones) */

    max-width: 80%;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    max-width: 80%;
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    max-width: 70%;
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    max-width: 50%;
  }
`;

const AccordionItem = styled.div`
  border: 2px solid #27272A;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  

`;

const AccordionHeader = styled.div`
  background-color: #151518;
  color: #fff;
  padding: 15px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AccordionContent = styled.div`
  background-color: #09090B;
  color: #fff;
  padding: 15px;
  max-height: ${({ isOpen }) => (isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease-in-out; /* Add transition property */
  ${({ isOpen }) => !isOpen && "padding: 0;"} 
  ${({ isOpen }) => !isOpen && "color: #09090B;"} 
`;



const Accordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AccordionItem>
      <AccordionHeader onClick={toggleAccordion}>
        <span>{title}</span>
        <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} />
      </AccordionHeader>
      <AccordionContent isOpen={isOpen}>{content}</AccordionContent>
    </AccordionItem>
  );
};




const Footer = styled.footer`
  position: relative;
  // background-color: #09090B;
  background-color: #111111;

  color: #fff;
  padding: 100px 10% 100px 10%;
  text-align: center;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    display: grid;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    display: grid;

  }
  
`;


const LightGrayOverlay = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 9999;

  /* Allow pointer events to pass through */
  pointer-events: none;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    width: 0%;
    height: 0%;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    width: 0%;
    height: 0%;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    width: 100%;
    height: 120%;
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    width: 100%;
    height: 160%;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    width: 100%;
    height: 180%;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    justify-content: center;
    align-items: center;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    justify-content: center;
    align-items: center;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    justify-content: center;
    align-items: center;
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    justify-content: flex-start;
    align-items: flex-start;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    justify-content: flex-start;
    align-items: flex-start;
  }

`;

const LogoText = styled.h2`
  font-size: 2rrem;
  margin-bottom: 30px;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 2rrem;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 2rrem;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 2rrem;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.6rrem;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 2rrem;

  }


`;

const Description = styled.p`
  margin-bottom: 20px;
  line-height: 1.8rem;
  opacity: 60%;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 1.2rrem;
    text-align: center;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.2rrem;
    text-align: center;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.2rrem;
    text-align: center;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.1rrem;
    text-align: left;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 1.2rrem;
    text-align: left;

  }

`;

const SectionTitle = styled.h3`
  margin-bottom: 10px;
  margin-left: 20%;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 2rrem;
    margin-left: 0%;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 2rrem;
    margin-left: 0%;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 2rrem;
    margin-left: 0%;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.1rrem;
    margin-left: 20%;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 1.2rrem;
    margin-left: 20%;

  }


`;

const LinkList = styled.ul`
  list-style: none;
  padding: 10px 0px;
  margin-left: 20%;
  text-align: center;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    margin-left: 0%;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    margin-left: 0%;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    margin-left: 0%;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    margin-left: 20%;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    margin-left: 20%;

  }

`;

const LinkItem = styled.li`
  margin-bottom: 20px;
  text-align: left;


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    text-align: center;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    text-align: center;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
  
    text-align: center;

  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
   
    text-align: left;
    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    text-align: left;
  }


  a {
    color: #ffffff;
    font-weight: 50;
    text-decoration: none;

    @media (min-width: 280px) {
      /* Extra Small devices (phones) */
      font-size: 1.4rrem;  
    }
  
    @media (min-width: 576px) {
      /* Small devices (phones) */
      font-size: 1.4rrem;  
    }
  
    @media (min-width: 768px) {
      /* Medium devices (tablets) */
      font-size: 1.4rrem;
  
      
    }
  
    @media (min-width: 992px) {
      /* Large devices (desktops) */
      font-size: 1.0rrem;
  
  
      
    }
  
    @media (min-width: 1200px) {
      /* Extra large devices (large desktops) */
      font-size: 1.0rrem;
  
    }


  }
  
`;

const LinkA = styled.a`
  color: #ffffff;
  text-decoration: none;
  &:hover {
    
  }
`;

const SocialMediaRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  a {
    padding-right: 20px;
  }
`;

const LanguageSelect = styled.select`
  padding: 8px;
  width: 40%;
  background: #121214;
  color: #fff;
  border: 1px solid #333;
  border-radius: 4px;
  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    width: 100%;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    width: 100%;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    width: 100%;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    width: 40%;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    width: 40%;

  }
`;




const MoreInfoSection = styled.section`
  padding-top: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background-image: linear-gradient(to bottom, rgb(22, 22, 22) 0%, #111111 82%, #09090B 100%);
  border: 1px solid #151518;


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    flex-wrap: wrap;
  }

    @media (min-width: 576px) {
    /* Small devices (phones) */
    flex-wrap: wrap;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    flex-wrap: no-wrap;
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    flex-wrap: no-wrap;
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    flex-wrap: no-wrap;
  }
`;

const MoreInfoSectionHeading = styled.h2`
  font-size: 2.5rem; /* Increase font size */
  margin: 40px 0px 20px 0px;
  color: #fff;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 1.3rem;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.5rem;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.7rem;    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.8rem;    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 2rem;  
  }

`;

const MoreInfoMainParagraph = styled.p`
  font-size: 1.6rem; /* Increase font size */
  text-align: center;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 0.8rem;
    padding: 0 20px;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.0rem;
    padding: 0 20px;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.2rem;
    padding: 0 20px;

    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.4rem;
    padding: 0 120px;

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 1.6rem;
    padding: 0 120px;

  }


`;

const MoreInfoSectionBoxHeading = styled.h2`

  font-size: 2.5rem; /* Increase font size */
  margin-bottom: 20px;
  color: #fff;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 1.3rem;
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 1.5rem;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    font-size: 1.7rem;    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 1.8rem;    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 2rem;  
  }

`;



const MoreInfoSectionRow = styled.div`
  padding-top: 40px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  background: transparent;
  margin-bottom: 50px;


  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    flex-wrap: wrap;
  }

    @media (min-width: 576px) {
    /* Small devices (phones) */
    flex-wrap: wrap;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    flex-wrap: no-wrap;
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    flex-wrap: no-wrap;
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    flex-wrap: no-wrap;
}
  
`

const MoreInfoSectionColumn = styled.div`
  width: 380px; /* Set a fixed width for each column */
  border: 1px solid #FAF0E6;
  border-radius: 24px;
  margin-bottom: 40px;
  background-color: #292929;



  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
        width: 65%;
  }

    @media (min-width: 576px) {
    /* Small devices (phones) */
        width: 65%;
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    width: 250px;
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    width: 250px;
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    width: 300px;
  }
`;





const MoreInfoSectionImage = styled.img`
  width: 100%;
  border-radius: 24px 24px 0px 0px;
`;


const MoreInfoSectionText = styled.div`
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    
    // background: #000F11;
    border-top: 1px solid #27272A;
    padding: 20px;
    
`;


const MoreInfoSectionParagraph = styled.p`
  color: rgba(255, 255, 255, 0.8) !important;
  margin-top: 0px;
  padding-left: 10px;
  padding-right: 10px; 
  margin-bottom: 30px;
  font-size: 0.9em;
`;




const OPTIONS: EmblaOptionsType = { loop: true }
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

const CAROUSEL_OPTIONS: EmblaOptionsType = { axis: 'y' }
const CAROUSEL_COUNT = 4
const CAROUSEL_SLIDES = Array.from(Array(CAROUSEL_COUNT).keys())

const HomeComponent = () => {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const { connection } = useConnection();
  const wallet = useWallet();
  const [balance, setBalance] = useState<number>();
  const [isMobile, setIsMobile] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false); // Unified state for navigation visibility

  const handleNavToggle = () => {
    setIsNavVisible(!isNavVisible);
  };

  const handleNavClose = () => {
    setIsNavVisible(false);
  };

  const inputHandler = (e) => {
    setInput(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (input) {
      try {
        await addDoc(collection(db, "emails"), {
          email: input,
          time: serverTimestamp(),
        });
        setInput("");
        setMessage("Thank you for subscribing to our newsletter!");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } catch (error) {
        console.error("Error adding entry: ", error);
        setInput("");
        setMessage("Submission Failed!");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    }
  };

  useEffect(() => {
    document.title = "Miura Protocol - Home";
  }, []);

  useEffect(() => {
    (async () => {
      if (wallet?.publicKey) {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, connection]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile(); // Run initially to set the state based on current window size
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const endpoint = useMemo(() => rpcHost, []);

  const wallets = useMemo(
    () => [
      new BackpackWalletAdapter(),
      new GlowWalletAdapter(),
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),
      new SafePalWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new SolletExtensionWalletAdapter(),
      new SolletWalletAdapter(),
    ],
    []
  );


  useEffect(() => {
    AOS.init({
      // Global settings:
      disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
      startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
      initClassName: 'aos-init', // class applied after initialization
      animatedClassName: 'aos-animate', // class applied on animation
      useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
      disableMutationObserver: false, // disables automatic mutations' detections (advanced)
      debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
      throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)


      // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
      offset: 120, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 400, // values from 0 to 3000, with step 50ms
      easing: 'ease', // default easing for AOS animations
      once: false, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
      anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

    });
  }, []);


  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={true}>
          <WalletModalProvider>
            <GrayOverlay src="/mimage2.png" alt="Your Image">

            </GrayOverlay>
            <Wrapper>
              <Header>
                {isMobile ? (
                  <>
                    <LogoContainer>
                      {isMobile && (
                        <ToggleButton onClick={handleNavToggle}>&#9776;</ToggleButton>
                      )}
                      <Logo>Miura</Logo>
                    </LogoContainer>
                    <NavOverlay visible={isNavVisible}>
                      <NavLinksContainerMobile>
                        <NavLinkMobile href="/main#about" onClick={handleNavClose}>
                          About
                        </NavLinkMobile>
                        <NavLinkMobile href="/dapp" onClick={handleNavClose}>
                          Claim
                        </NavLinkMobile>
                        <NavLinkMobile href="/main#governance" onClick={handleNavClose}>
                          Governance
                        </NavLinkMobile>
                        <NavLinkMobile href="/main#roadmap" onClick={handleNavClose}>
                          Roadmap
                        </NavLinkMobile>
                        <NavLinkMobile href="/main#newsletter" onClick={handleNavClose}>
                          Newsletter
                        </NavLinkMobile>
                      </NavLinksContainerMobile>
                    </NavOverlay>
                  </>
                ) : (
                  <NavContainer>
                    <Logo>Miura Protocol</Logo>
                    <NavLinksContainer>
                      <NavLink href="/main#about">About</NavLink>
                      <NavLink href="/dapp">Claim</NavLink>
                      <NavLink href="/main#governance">Governance</NavLink>
                      <NavLink href="/main#roadmap">Roadmap</NavLink>
                      <NavLink href="/main#newsletter">Newsletter</NavLink>
                    </NavLinksContainer>
                  </NavContainer>
                )}
                <NavButtonContainer>
                  <WalletContainer>
                    <Wallet>
                      {wallet ? (
                        <WalletAmount>
                          {(balance || 0).toLocaleString()} SOL
                          <ConnectButton />
                        </WalletAmount>
                      ) : (
                        <ConnectButton>Connect Wallet</ConnectButton>
                      )}
                    </Wallet>
                  </WalletContainer>
                </NavButtonContainer>
              </Header>



              <Main>

                <HeroSection>
                  <HeroBoxCol data-aos="fade-down-left">
                    <LeftColumn>
                      <HeroHeader>Earn Interest & Borrow Assets Against NFTs, Seamlessly</HeroHeader>
                      <HeroParagraph>Unleash the full potential of your NFT and borrowing against your NFT as collateral.</HeroParagraph>
                      <div>
                      <Link href="/dapp"><WhiteButton>MINT NFT</WhiteButton></Link>
                        <Link href="/nft"><TransparentButton>NFT INFO</TransparentButton></Link>
                      </div>
                    </LeftColumn>
                    <RightColumn>
                      <Image src="/GIFMAIN.GIF" alt="Your Image" width={900} height={450} /> {/* Adjust image path and dimensions */}
                    </RightColumn>
                  </HeroBoxCol>
                  <HIWBoxCol>

                    <HIWBox >
                      <Image src="/plain.png" alt="Your Image" width={45} height={40} /> {/* Adjust image path and dimensions */}
                      <HIWHeader>
                        How it Works
                      </HIWHeader>
                      <HIWParagraph>
                        Section explains how everything works
                      </HIWParagraph>

                    </HIWBox>

                    <HeroBoxColThree>
                      <Col1 data-aos="flip-up">
                        <ColHeading>
                          1. Lend Collateral
                        </ColHeading>
                        <ColParagraph>
                          Unlock the full potential of your NFT
                        </ColParagraph>
                      </Col1>
                      <Col2 data-aos="flip-up">
                        <ColHeading>
                          2. Borrow & Bridge
                        </ColHeading>
                        <ColParagraph>
                          Use any NFT on any chain to borrow assets
                        </ColParagraph>
                      </Col2>
                      <Col3 data-aos="flip-up">
                        <ColHeading>
                          3. Earn Part of Interest
                        </ColHeading>
                        <ColParagraph>
                          Miura NFT Holders receive 2% from the total interest
                        </ColParagraph>
                      </Col3>
                    </HeroBoxColThree>
                  </HIWBoxCol>


                </HeroSection>


                <InfoSection id="about">
                  <InfoBoxCol>
                    <InfoLeftColumn data-aos="fade-right">
                      <Image src="/lock.png" alt="Your Image" width={45} height={40} /> {/* Adjust image path and dimensions */}
                      <InfoHeader>
                        What is Miura?
                      </InfoHeader>
                      <InfoParagraph>
                        Miura is a decentralized non-custodial liquidity market protocol where users can borrow assets based on any NFT on any chain.
                      </InfoParagraph>
                    </InfoLeftColumn>
                    <InfoRightColumn data-aos="fade-left">
                      <Image src="/mimage3.png" alt="Your Image" width={500} height={300} /> {/* Adjust image path and dimensions */}
                    </InfoRightColumn>
                  </InfoBoxCol>

                  <InfoBoxCol2>

                    <InfoRightColumn data-aos="fade-up-right">
                      <Image src="/mimage4.png" alt="Your Image" width={600} height={300} /> {/* Adjust image path and dimensions */}
                    </InfoRightColumn>
                    <InfoLeftColumn data-aos="fade-right">
                      <Image src="/wave.png" alt="Your Image" width={45} height={40} /> {/* Adjust image path and dimensions */}
                      <InfoHeader>
                        How to borrow?
                      </InfoHeader>
                      <InfoParagraph>
                        Utilize your NFTs as collateral for borrowing, ensuring to deposit the asset beforehand. Check borrowing availability and set your desired amount based on collateral balance in the Markets section, then confirm the transaction.
                      </InfoParagraph>
                    </InfoLeftColumn>
                  </InfoBoxCol2>
                </InfoSection>



                <MarketStatsSection>
                  <Hexagon1 src="/hex3.png" alt="Your Image"></Hexagon1>
                  <Hexagon3 src="/hex1.png" alt="Your Image"></Hexagon3>
                  <Hexagon2 src="/hex3.png" alt="Your Image"></Hexagon2>
                  <MarketStatsBox data-aos="fade-up"
                    data-aos-anchor-placement="center-bottom">
                    <Image src="/thunder.png" alt="Your Image" width={50} height={45} /> {/* Adjust image path and dimensions */}
                    <MarketStatsHeader>
                      Miura Token
                    </MarketStatsHeader>
                    <MarketStatsParagraph>
                      MIURA is used as the center of gravity for MIURA PROTOCOL governance. MIURA is employed to vote and decide on the outcome of MIURA improvement proposals. Apart from this, MIURA can be staked within the protocol to provide security/insurance to the protocol suppliers. Stakers earn staking rewards and fees from the protocol.
                    </MarketStatsParagraph>
                    <TotalCirculationWidget data-aos="flip-right" data-aos-duration="600">
                      <CirlceFrameImg src="/coins.png" alt="Your Image"></CirlceFrameImg>
                      <SupplyBox>
                        <SupplyHeading>Total Supply</SupplyHeading>
                        <SupplyText>Miura has a total supply of 5,000,000,000 tokens.</SupplyText>
                      </SupplyBox>

                    </TotalCirculationWidget>


                  </MarketStatsBox>
                </MarketStatsSection>




                <SliderSection id="governance">
                  <SliderBox data-aos="fade-up">
                    <Image src="/plain.png" alt="Your Image" width={45} height={40} /> {/* Adjust image path and dimensions */}
                    <SliderHeader>
                      Token Allocation
                    </SliderHeader>
                    <SliderParagraph>
                      Our token allocation strategy aims to maximize future gains and project success.
                    </SliderParagraph>
                    <NewsSlider slides={SLIDES} options={OPTIONS} />

                  </SliderBox>

                </SliderSection>

                <MoreInfoSection id="eventSection" >
                <Image src="/plain.png" alt="Your Image" width={45} height={40} /> {/* Adjust image path and dimensions */}
                  <MoreInfoSectionHeading>Loans & Interest</MoreInfoSectionHeading>
                  <MoreInfoMainParagraph>
                      Our token allocation strategy aims to maximize future gains and project success.
                    </MoreInfoMainParagraph>
                  <MoreInfoSectionRow>
                    <MoreInfoSectionColumn data-aos="flip-left">
                      <MoreInfoSectionImage src="/loan.png" alt="Image 1" />
                      <MoreInfoSectionText>
                        <MoreInfoSectionBoxHeading>Loan Repayment</MoreInfoSectionBoxHeading>
                        <MoreInfoSectionParagraph>
                          Understand your options for settling borrowed amounts.
                        </MoreInfoSectionParagraph>
                        <Link href="/loan#loanPage">
                          <LearnMoreButton color="#292929" fontColor="#fff">Learn More</LearnMoreButton>
                        </Link>
                      </MoreInfoSectionText>
                    </MoreInfoSectionColumn>

                    <MoreInfoSectionColumn data-aos="flip-down">
                      <MoreInfoSectionImage src="/info.png" alt="Image 2" />
                      <MoreInfoSectionText>
                        <MoreInfoSectionBoxHeading>Interest Payment</MoreInfoSectionBoxHeading>
                        <MoreInfoSectionParagraph>
                        Details on how interest is calculated and paid.
                        </MoreInfoSectionParagraph>
                        <Link href="/loan#loanterms">
                          <LearnMoreButton color="#292929" fontColor="#fff">Learn More</LearnMoreButton>
                        </Link>
                      </MoreInfoSectionText>
                    </MoreInfoSectionColumn>

                    <MoreInfoSectionColumn data-aos="flip-right">
                      <MoreInfoSectionImage src="/distribution.png" alt="Image 3" />
                      <MoreInfoSectionText>
                        <MoreInfoSectionBoxHeading>Interest Distribution</MoreInfoSectionBoxHeading>
                        <MoreInfoSectionParagraph>
                        Insight into how interest fees are allocated and used.
                        </MoreInfoSectionParagraph>
                        <Link href="/loan#loanPage">
                          <LearnMoreButton color="#292929" fontColor="#fff">Learn More</LearnMoreButton>
                        </Link>

                      </MoreInfoSectionText>
                    </MoreInfoSectionColumn>
                  </MoreInfoSectionRow>
                </MoreInfoSection>

                <CarouselSection id="roadmap">
                  <Image data-aos="flip-left" src="/plain.png" alt="Your Image" width={45} height={40} /> {/* Adjust image path and dimensions */}

                  <CarouselHeader data-aos="zoom-in">
                    Project Roadmap
                  </CarouselHeader>
                  <CarouselParagraph data-aos="flip-down">
                    The Miura roadmap is concise and offers insights into the project&apos;s objectives.
                  </CarouselParagraph>
                  <Carousel slides={CAROUSEL_SLIDES} options={CAROUSEL_OPTIONS} />
                </CarouselSection>

                <InfoSection>
                  <InfoBoxCol2>

                    <InfoRightColumn data-aos="flip-right">
                      <Image src="/hexgroup7.png" alt="myimag" width={700} height={700} /> {/* Adjust image path and dimensions */}
                    </InfoRightColumn>
                    <InfoLeftColumn data-aos="zoom-in">
                      <Image src="/lock.png" alt="Your Image" width={45} height={40} /> {/* Adjust image path and dimensions */}
                      <InfoHeader>
                        Security & Audits
                      </InfoHeader>
                      <InfoParagraph>
                        Miura has been implemented with security as priority. The system has been designed to be safe and secure, and we have spent all the necessary resources in the order to ensure that the protocol matches the higherest security standards.
                      </InfoParagraph>
                    </InfoLeftColumn>
                  </InfoBoxCol2>
                </InfoSection>
                <NewsLetterSection id="newsletter">

                  <NewsLetterBox data-aos="flip-down" data-aos-duration="2000">
                    <DottedSquare1 src="/dots.png" alt="Your Image"></DottedSquare1>
                    <DottedSquare2 src="/dots.png" alt="Your Image"></DottedSquare2>
                    <NewsLetterSectionColBox>

                      <NewsLetterImageColumn>
                        <Image src="/mimage7.png" alt="newsletter Image" width={500} height={400} /> {/* Adjust image path and dimensions */}
                      </NewsLetterImageColumn>
                      <NewsLetterSectionColumn>
                        <NewsLetterTopText>
                          GET OUR WEEKLY
                        </NewsLetterTopText>
                        <NewsLetterHeadeing>
                          NEWSLETTER
                        </NewsLetterHeadeing>
                        <NewsLetterParagraph>
                          Get weekly updates on the newest design stories, case studies and tips right in your mailbox.
                          <b> Subscribe now!</b>
                        </NewsLetterParagraph>
                      </NewsLetterSectionColumn>
                    </NewsLetterSectionColBox>

                    <NewsletterForm onSubmit={submitHandler}>
                      <EmailInput
                        type="email"
                        onChange={inputHandler}
                        name="email"
                        placeholder="Enter your email here"
                        value={input}
                        required
                      />
                      <SubscribeButton type="submit">Subscribe</SubscribeButton>
                    </NewsletterForm>
                    <NoticeMessage>
                      Your email is safe with us, we don&apos;t spam.
                    </NoticeMessage>
                    <Alert>{message}</Alert>
                  </NewsLetterBox>
                </NewsLetterSection>

                <PartnersSection>
                  <PartnersHeading>Our ecosystem:</PartnersHeading>
                  <PartnersBox>
                    <PartnerCol1>
                      {/* <Image src="/partner1.png" alt="Phantom Logo" width={200} height={50} />  */}
                    </PartnerCol1>
                    <PartnerCol2>
                      <Image src="/partner2.png" alt="Solana Logo" width={200} height={50} />
                    </PartnerCol2>
                    <PartnerCol3>
                      {/* <Image src="/partner3.png" alt="Metaplex Logo" width={200} height={50} />  */}
                    </PartnerCol3>

                  </PartnersBox>
                </PartnersSection>

              </Main>

              <Footer>
                <LightGrayOverlay src="/mimage8.png" alt="Your Image">

                </LightGrayOverlay>
                <FooterSection>
                  <LogoText>Miura Protocol</LogoText>
                  <Description>A decentralized non-custotia liquidity market protocol where users can borrow assets</Description>
                  <p>&copy; 2024 Miura Protocol</p>
                </FooterSection>

                <FooterSection>
                  <SectionTitle>Resources</SectionTitle>
                  <LinkList>
                    <LinkItem><a href="#">Docs</a></LinkItem>
                    <LinkItem><a href="#">Blog</a></LinkItem>
                    <LinkItem><a href="#">Support</a></LinkItem>
                  </LinkList>
                </FooterSection>

                <FooterSection>
                  <SectionTitle>Company</SectionTitle>
                  <LinkList>
                    <LinkItem><Link href="#">About Us</Link></LinkItem>
                    <LinkItem><Link href="#">Careers</Link></LinkItem>
                    <LinkItem><Link href="#">Contact</Link></LinkItem>
                  </LinkList>
                </FooterSection>

                <FooterSection>
                  <SocialMediaRow>
                    <a href=""><Image src="/icon1.png" alt="Your Image" width={50} height={50} /></a>
                    <a href=""><Image src="/icon2.png" alt="Your Image" width={50} height={50} /></a>
                    <a href=""><Image src="/icon3.png" alt="Your Image" width={50} height={50} /></a>
                    <a href=""><Image src="/icon4.png" alt="Your Image" width={50} height={50} /></a>
                  </SocialMediaRow>
                  <LanguageSelect>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </LanguageSelect>
                </FooterSection>
              </Footer>
            </Wrapper>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>

    </>
  );
};

export default HomeComponent;
