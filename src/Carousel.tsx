import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import { DotButton, useDotButton } from './CarouselDotButtons'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './CarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import styles from "../styles/carousel.module.css"
import styled from "styled-components";
import Image from "next/image";









const CarouselItemBox = styled.div`
    position: relative;
    max-width: 100%;
    background-color: rgb(25,25,25);
    border: 2px solid #111111;
    border-radius: 20px;

`;

const CarouselBackgroundLayerOne = styled.div`
    padding: 0% 45% 0% 45%;
    position: absolute;
    height: 20px;
    // max-width: 100%;
    background-color: rgba(25, 25, 25, 0.6);
    
    left: 5%;
    bottom: -20px;
    border-radius: 0px 0px 20px 20px;


    
`;

const CarouselText = styled.div`
    padding: 3rem;


    @media (min-width: 280px) {
        /* Extra Small devices (phones) */
        padding: 2rem;
        b {
            color: #FFDB5A;
            font-size: 1em;
        }
      }
    
      @media (min-width: 576px) {
        /* Small devices (phones) */
        padding: 2rem;
        b {
            color: #FFDB5A;
            font-size: 1.0em;
        }
      }
    
      @media (min-width: 768px) {
        /* Medium devices (tablets) */
        padding: 2rem;
        b {
            color: #FFDB5A;
            font-size: 1.1em;
        }
        
      }
    
      @media (min-width: 992px) {
        /* Large devices (desktops) */
        padding: 3rem;
        b {
            color: #FFDB5A;
            font-size: 1.2em;
        }
    
        
      }
    
      @media (min-width: 1200px) {
        /* Extra large devices (large desktops) */
          padding: 3rem;
          b {
            color: #FFDB5A;
            font-size: 1.2rem;
        }

      }
`;

const CarouselImageIcon = styled.div`

    position: absolute;
    top: -20px;
    left: 47%;
`;












type PropType = {
    slides: number[]
    options?: EmblaOptionsType
}

const Carousel: React.FC<PropType> = (props) => {
    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)

    const { selectedIndex, scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)


    const crouselBoldTextList = [
        "Putting the Platform into Operation",
        "Launching an Airdrop",
        "Making as Many Partnerships as Possible",
        "Collecting as Many Funds as Possible"
    ];

    const crouselTextList = [
        "The primary focus is on launching the platform, ensuring all technical aspects are functional.",
        "Initiating an airdrop aims to distribute tokens widely, fostering community engagement.",
        "Establishing numerous partnerships is vital for project growth and success.",
        "Fundraising efforts are crucial for project sustainability and expansion."
    ];


    return (
        <section className={styles.embla}>
            <div className={styles.embla__viewport} ref={emblaRef}>
                <div className={styles.embla__container}>
                    {slides.map((index) => (
                        <div className={styles.embla__slide} key={index}>
                            <CarouselItemBox >
                                <CarouselBackgroundLayerOne></CarouselBackgroundLayerOne>
                                {/* <CarouselImageIcon>
                                    <Image src="/hex.png" alt="Your Image" width={45} height={40} />
                                </CarouselImageIcon> */}
                                <CarouselText><b>{crouselBoldTextList[index]}: </b><br /><br />{crouselTextList[index]}</CarouselText>

                            </CarouselItemBox>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.embla__controls}>
                <div className={styles.embla__buttons}>
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>

                <div className={styles.embla__dots}>
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={`${styles.embla__dot}`.concat(
                                index === selectedIndex ? `${styles.embla__dot__selected}` : ''
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Carousel;
