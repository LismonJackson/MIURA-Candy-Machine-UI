import React, { useState } from "react";
import styled from "styled-components";
import ParticleCanvas from "./ParticleAnimation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";



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
`;

const EmailInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
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
`;

const HeroButton = styled.button`
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #fffff;
  color: black;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1em;
  cursor: pointer;
  // box-shadow: 0 2px 4px rgba(255, 255, 255, 0.5); /* Drop shadow */
  transition: all 200ms ease-in-out;
  

  &:hover {
    background-color: gray;
    border: 2px double white; 
    box-shadow: 0 2px 4px rgba(255, 255, 255, 1); /* Drop shadow */
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


const SubscribeButton = styled.button`
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Footer = styled.footer`
  background-color: #09090B;
  color: #fff;
  padding: 20px;
  text-align: center;
`;

const AboutComponent = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    // Submit email to Firebase or your preferred backend for newsletter subscription
    console.log("Email submitted:", email);
  };

  return (
    <Wrapper>
      <Header>
        <h1>Miura<BetaTag>Beta</BetaTag></h1>
        <NavButton>Launch Dapp</NavButton>
      </Header>

      <Main>
        <HeroSection>

          <div>
            {/* Image can also be used instead of Particle Animation */}
            {/* <HeroImage
                            src="https://nftstorage.link/ipfs/bafybeibnie63fmcgor2gptiowailq5sgbv6hkmwxeahfhhy4evadbhlhji/0.jpg"
                            alt="Team Image"
                        /> */}
            <ParticleCanvas backgroundColor="#212121" animate={true} />
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
            <HeroButton>Learn More</HeroButton>
          </HeroText>
        </HeroSection>
        <NewsSection>

          <Column>
            <Image src="https://nftstorage.link/ipfs/bafybeigpp7tctarhny5v6h4t3g67v5ch4o5hguaypvyp6rffdhoh46qn3i/6.png" alt="Image 1" />
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
              <LearnMoreButton color="#fff" fontColor="#000">Claim Now</LearnMoreButton>
            </Text>
          </Column>

          <Column>
            <Image src="https://nftstorage.link/ipfs/bafybeigpp7tctarhny5v6h4t3g67v5ch4o5hguaypvyp6rffdhoh46qn3i/8.png" alt="Image 3" />
            <Text>
              <Heading>Discord Server</Heading>
              <Paragraph>
                Official Discord server launch
              </Paragraph>
              <LearnMoreButton color="#27272A" fontColor="#fff">Coming Soon!</LearnMoreButton>
            </Text>
          </Column>
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

        {/* <Section>
                    <Heading>Meet the Team</Heading>
                    <Paragraph>
                        Our team comprises dedicated professionals with extensive
                        experience in blockchain technology, finance, and software
                        development. Together, we are committed to realizing the full
                        potential of decentralized finance.
                    </Paragraph>
                </Section> */}

        {/* <Section>
                    <Heading>Newsletter</Heading>
                    <Paragraph>
                        Stay updated with our latest news and developments by subscribing
                        to our newsletter.
                    </Paragraph>
                    <NewsletterForm onSubmit={handleSubmit}>
                        <EmailInput
                            type="email"
                            name="email"
                            placeholder="Your email"
                            required
                        />
                        <SubscribeButton type="submit">Subscribe</SubscribeButton>
                    </NewsletterForm>
                </Section> */}
      </Main>

      <Footer>&copy; 2024 Miura. All rights reserved.</Footer>
    </Wrapper>
  );
};

export default AboutComponent;
