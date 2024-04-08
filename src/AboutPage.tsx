import React, { useState } from "react";
import styled from "styled-components";
import ParticleCanvas from "./ParticleAnimation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the path as needed


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
    padding: 20px 20px 20px 20px;
    text-align: center;
    // background: #212121;
    background: #09090B;
    border-bottom: 2px solid #151518;

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
        setTimeout(()=>{
          setMessage("");
        }, 3000)
      } catch (error) {
        console.error('Error adding entry: ', error);
        setInput("");
        setMessage("Submission Failed!")
        setTimeout(()=>{
          setMessage("");
        }, 3000)

      }
    }
  };

  
  return (
    <Wrapper>
      <Header>
        <h1>Miura<BetaTag>Beta</BetaTag></h1>
        <Link href="/dapp">
        <NavButton>Launch Dapp</NavButton>
        </Link>
      </Header>

      <Main>
        <HeroSection>

          <div>
            {/* Image can also be used instead of Particle Animation */}
            {/* <HeroImage
                            src="https://nftstorage.link/ipfs/bafybeibnie63fmcgor2gptiowailq5sgbv6hkmwxeahfhhy4evadbhlhji/0.jpg"
                            alt="Team Image"
                        /> */}
            <ParticleCanvas backgroundColor="#09090B" animate={true} />
            <Overlay />
          </div>
          <HeroText>

            <LogoImage
              src="https://nftstorage.link/ipfs/bafybeigpp7tctarhny5v6h4t3g67v5ch4o5hguaypvyp6rffdhoh46qn3i/10.png"
              alt="Team Image"
            />
            <h2>Miura Protocol</h2>
            <p>
              Miura is a cutting-edge platform built on Solana blockchain,
              revolutionizing the way you experience DeFi. Our mission is to
              provide seamless, secure, and decentralized financial solutions
              for everyone.
            </p>
            <Link href="/dapp">
            <HeroButton>Claim Now!</HeroButton>
            </Link>
          </HeroText>
        </HeroSection>

        <NewsSection id="eventSection">

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
        </NewsSection>
        <FaqsSection>

          <h2>FAQs</h2>
          <AccordionWrapper>
            <Accordion
              title="What is the significance of purchasing this NFT?"
              content="Purchasing this NFT holds significance as it grants participation in the AIRDROP event linked to the pioneering lending and borrowing protocol designed specifically for NFT assets. This implies that by acquiring this NFT, you become eligible for benefits and rewards within the framework of this unique financial ecosystem."
            />
            <Accordion
              title="What benefit do NFT owners receive?"
              content="NFT owners stand to gain a distinct advantage as they receive a portion of the interest accrued from loans taken against NFT assets. This means that by being a holder of this NFT, you become entitled to a share of the interest earnings generated from funds borrowed by others against their NFT holdings."
            />
            <Accordion
              title="How can MIURA NFT be utilized on the platform?"
              content="MIURA NFT serves as a versatile asset within the platform's ecosystem, primarily functioning as collateral for borrowing funds. This means that holders of MIURA NFTs can leverage their ownership to obtain loans, utilizing their NFTs as security against the borrowed funds, thereby unlocking liquidity without having to sell their NFT holdings."
            />
            <Accordion
              title="How can this NFT be used for non-payment of interest?"
              content="This NFT offers a unique utility wherein it can be utilized to offset interest payments under specific circumstances. If you choose to pledge your NFT as collateral and borrow funds against another NFT asset, you have the option to use this NFT to waive the interest payments on the borrowed funds. This feature provides flexibility and additional value to the ownership of this NFT, allowing strategic financial management within the platform's ecosystem."
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
  );
};

export default AboutComponent;
