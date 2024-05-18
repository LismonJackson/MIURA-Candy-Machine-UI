import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ParticleCanvas from "./ParticleAnimation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import Link from 'next/link';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useMemo } from "react";
import { db } from './firebase'; // Adjust the path as needed
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
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { rpcHost, candyMachineId, network } from "./config";




const Wrapper = styled.div`
  font-family: Arial, sans-serif;
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;   
    max-width: 100%;
    margin: 0 auto;
    background-color: #09090B;
    color: #fff;
    padding: 0px 20px 0px 20px;
    text-align: center;
    // background: #212121;
    background: #09090B;
    border-bottom: 2px solid #151518;

    @media (min-width: 280px) {
      /* Extra Small devices (phones) */
      padding: 0px 5px 0px 5px;
    }
  
      @media (min-width: 576px) {
      /* Small devices (phones) */
      padding: 0px 5px 0px 5px;
    }
  
    @media (min-width: 768px) {
      /* Medium devices (tablets) */
      padding: 0px 10px 0px 10px;
    }
  
    @media (min-width: 992px) {
      /* Large devices (desktops) */
      padding: 0px 20px 0px 20px;
    }
  
    @media (min-width: 1200px) {
      /* Extra large devices (large desktops) */
      padding: 0px 20px 0px 20px;
    }

`;

const Main = styled.main`
  padding: 0px;
`;

const HeroSection = styled.section`
  position: relative;
`;

const HeroImage = styled.img`
  min-width: 100%;
  height: 100vh;
  border-radius: 6px;
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

const LogoImage = styled.img`
 
  border-radius: 50%;
  filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 1));

  
  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    max-width: 70%;
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
    max-width: 50%;
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
      font-size: 1.8rem;
    }
    p {
      font-size: 1rem;
      margin-top: 30px;
    }
  }

    @media (min-width: 576px) {
    /* Small devices (phones) */
    left: 10%;
    top: 40%;
    transform: translate(-5%, -50%);
    h2 {
      font-size: 2.5rem;
    }
    p {
      font-size: 1rem;
      margin-top: 30px;
    }
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
    left: 10%;
    top: 40%;
    transform: translate(-5%, -50%);
    h2 {
      font-size: 3.5rem;
    }
    p {
      font-size: 1.2rem;
      margin-top: 30px;
    }
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    h2 {
      font-size: 4rem;
    }
    p {
      font-size: 1.4rem;
      margin-top: 30px;
    }
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    h2 {
      font-size: 3.5rem;
    }
    p {
      font-size: 1.6rem;
      margin-top: 30px;
    }
  }
`;

const BetaTag = styled.sup`
  font-size: 0.8rem;
`;



const NewsSection = styled.section`
  padding-top: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background: #09090B;
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




const Image = styled.img`
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
  color: #fffff;
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
    font-size: 1.8rem;
    margin-bottom: 30px;

  }

`



const NewsletterForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  background: #151518;
  padding: 8px;
  border: 1px solid #27272A;
  border-radius: 6px;

  @media (max-width: 400px) {
    /* Small devices (phones) */
        flex-direction: column;
        width: 80%;
        padding: 10px;
  }

`;

const EmailInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    outline: none; 
  }

  @media (max-width: 400px) {
    /* Small devices (phones) */
        
        width: 90%;
        margin-bottom: 10px;
        
  }

`;


const SubscribeButton = styled.button`
  padding: 12px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 12px;

  @media (max-width: 400px) {
    /* Small devices (phones) */
        background-color: #27272A;
        color: #fff;
        width: 98%;
        
  }

`;


const NavButton = styled.button`
  padding: 10px 20px;
  background-color: #fffff;
  color: black;
  border: 1px solid lightgray; 
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 200ms ease-in-out;

  &:hover {
    background-color: lightgray;
  }
  @media (max-width: 400px) {
    /* Small devices (phones) */
      padding: 10px 10px;
        
  }
`;

const HeroButton = styled.button`
  display: inline-block;
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #fffff;
  border: 1px solid transparent; 
  color: black;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1em;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  box-shadow: 0 0px 0px rgba(255, 255, 255, 0); 

  &:hover {
    background-color: gray;
    border-color: white; 
    box-shadow: 0 0px 4px rgba(255, 255, 255, 1); 
    color: white;
  }
`;


const LearnMoreButton = styled.button`
    padding: 10px 20px;
    background-color: ${props => props.color || '#ffffff'};
    color: ${props => props.fontColor || '#000'};
    border: 1px solid #27272A; 
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: all 200ms ease-in-out;

    &:hover {
        background-color: lightgray;
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

const NewsLetterSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  padding-top: 40px;
  width: 100%;
  background: #09090B;
  border: 1px solid #151518;

  h2 {
    font-size: 1.8rem;
  }
  
  

`


const NewsLetterBox = styled.div`

display: flex;
justify-content: center;
align-items: center;
text-align: center;
flex-direction: column;
padding-bottom: 40px;
width: 100%;
background: #09090B;

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

`

const Alert = styled.p`
  background: #09090B;
  padding: 10px 20px;
  color: #fff;
  transition: all 0.5s ease-in-out;

`


const Footer = styled.footer`
  background-color: #09090B;
  color: #fff;
  padding: 20px;
  text-align: center;
`;

const AboutComponent = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [balance, setBalance] = useState<number>();

  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const inputHandler = (e) => {
    setInput(e.target.value);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (input) {
      // console.log(input);
      try {
        await addDoc(collection(db, 'emails'), {
          email: input,
          time: serverTimestamp()
        });
        // console.log('Document successfully written!');
        setInput("");
        setMessage("Thank you for subscribing to our newsletter!")
        setTimeout(() => {
          setMessage("");
        }, 3000)
      } catch (error) {
        console.error('Error adding entry: ', error);
        setInput("");
        setMessage("Submission Failed!")
        setTimeout(() => {
          setMessage("");
        }, 3000)

      }
    }
  };


  useEffect(() => {
    (async () => {
      if (wallet?.publicKey) {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, connection]);

  useEffect(() => {
    document.title = "Miura Protocol - Home";
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

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        
        <WalletProvider wallets={wallets} autoConnect={true}>
          <WalletModalProvider>


            <Wrapper>
              <Header>
                <h1>Miura<BetaTag>Beta</BetaTag></h1>
                {/* <Link href="/dapp">
                <NavButton>
                  Home </NavButton>
              </Link> */}
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

                  <div>
                    {/* Image can also be used instead of Particle Animation */}
                    {/* <HeroImage
                            src="https://nftstorage.link/ipfs/bafybeibnie63fmcgor2gptiowailq5sgbv6hkmwxeahfhhy4evadbhlhji/0.jpg"
                            alt="Team Image"
                        /> */}
                    <ParticleCanvas backgroundColor="#010101" animate={true} />
                    <Overlay />
                  </div>
                  <HeroText>

                    <LogoImage
                      src="/miuragif.gif"
                      alt="Team Image"
                    />
                    <h2>Miura NFT</h2>
                    <p>
                      A MIURA NFT is a digital asset that grants its owner the right to receive part of the interest charged on borrowed funds and can be used as collateral for borrowing funds.


                    </p>
                    <Link href="/dapp">
                      <HeroButton>Claim Now!</HeroButton>
                    </Link>
                  </HeroText>
                </HeroSection>

                {/* <NewsSection id="eventSection">

            <h2>Upcoming Events</h2>
            <Row>
              <Column>
                <Image src="https://bafkreihnvhki3qi7yreh5zhwn5cwuf4xqgc2qq7cegsgjedblp24inyq24.ipfs.nftstorage.link/" alt="Image 1" />
                <Text>
                  <Heading>Miura Airdrop</Heading>
                  <Paragraph>
                    AIRDROP of the first and only lending and borrowing protocol
                  </Paragraph>

                  <LearnMoreButton color="#27272A" fontColor="#fff">Coming Soon!</LearnMoreButton>
                </Text>
              </Column>

              <Column>
                <Image src="https://nftstorage.link/ipfs/bafybeigpp7tctarhny5v6h4t3g67v5ch4o5hguaypvyp6rffdhoh46qn3i/3.gif" alt="Image 2" />
                <Text>
                  <Heading>Miura NFT</Heading>
                  <Paragraph>
                    Smart NFT for smart community
                  </Paragraph>
                  <Link href="/dapp">
                    <LearnMoreButton color="#fff" fontColor="#000">Minting Live Now!</LearnMoreButton>
                  </Link>
                </Text>
              </Column>

              <Column>
                <Image src="https://bafkreihnvhki3qi7yreh5zhwn5cwuf4xqgc2qq7cegsgjedblp24inyq24.ipfs.nftstorage.link/" alt="Image 3" />
                <Text>
                  <Heading>Discord Server</Heading>
                  <Paragraph>
                    Official Discord server launch
                  </Paragraph>

                  <LearnMoreButton color="#27272A" fontColor="#fff">Coming Soon!</LearnMoreButton>

                </Text>
              </Column>
            </Row>
          </NewsSection> */}
                <FaqsSection>

                  <h2>FAQs</h2>
                  <AccordionWrapper>
                    <Accordion
                      title="What is MIURA NFT?"
                      content="MIURA NFT represents a single condition for the AIRDROP of the MIURA token."
                    />
                    <Accordion
                      title="What benefits do owners of MIURA NFT receive?"
                      content="Owners of MIURA NFT will receive part of the interest that will be charged for borrowing funds."
                    />
                    <Accordion
                      title="Can MIURA NFT be used like other NFTs for borrowing funds?"
                      content="MIURA NFT will be able to be used like any other NFT for borrowing funds."
                    />
                    <Accordion
                      title="How can MIURA NFT help with interest payments on borrowed funds?"
                      content="MIURA NFT will be able to be used for non-payment of interest on borrowed funds on the basis of another NFT."
                    />
                  </AccordionWrapper>

                </FaqsSection>


                <NewsLetterSection>
                  <NewsLetterBox>
                    <Heading>Newsletter</Heading>
                    <p>
                      Stay updated with our latest news and developments by subscribing
                      to our newsletter.
                    </p>
                    <NewsletterForm onSubmit={submitHandler}>
                      <EmailInput
                        type="email"
                        onChange={inputHandler}
                        name="email"
                        placeholder="Your email"
                        value={input}
                        required
                      />
                      <SubscribeButton type="submit">Subscribe</SubscribeButton>
                    </NewsletterForm>
                    <Alert>{message}</Alert>
                  </NewsLetterBox>
                </NewsLetterSection>
              </Main>

              <Footer>&copy; 2024 Miura. All rights reserved.</Footer>
            </Wrapper>

          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
};

export default AboutComponent;
