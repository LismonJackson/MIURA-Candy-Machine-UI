import React, { useCallback, useEffect, useState } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import styles from '../styles/slider.module.css';
import styled from "styled-components";
import Image from 'next/image';

import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './CrouselArrowButtons'

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}



const Card = styled.div`
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    text-align: left;
    background-color: rgb(66, 66, 66, 0.5);
    border: 2px solid #424242;
    border-radius: 20px;

    @media (min-width: 280px) {
      /* Extra Small devices (phones) */
      padding: 1rem;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  
    @media (min-width: 576px) {
      /* Small devices (phones) */
      padding: 1.5rem;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  
    @media (min-width: 768px) {
      /* Medium devices (tablets) */
      padding: 2rem;
    justify-content: flex-start;
    align-items: flex-start;
    text-align: left;
      
    }
  
    @media (min-width: 992px) {
      /* Large devices (desktops) */
      padding: 2.5rem;
      justify-content: flex-start;
      align-items: flex-start;
      text-align: left;
  
      
    }
  
    @media (min-width: 1200px) {
      /* Extra large devices (large desktops) */
      padding: 3rem;
      justify-content: flex-start;
      align-items: flex-start;
      text-align: left;
    }
`;


const CardHeading = styled.h2`
  font-size: 0.8em;
  color: #fff;
  margin: 20px 0px 20px 0px;
  
  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    font-size: 0.5em;

  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    font-size: 0.6em;

  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
  
    font-size: 0.7em;

  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
    font-size: 0.7em;


    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
    font-size: 0.8em;

  }



`;

const CardText = styled.p`
  font-size: 0.3em;
  font-weight: 200;
  color: #fff;
  margin: 0px 0px 15px 0px;

  @media (min-width: 280px) {
    /* Extra Small devices (phones) */
    
  }

  @media (min-width: 576px) {
    /* Small devices (phones) */
    
  }

  @media (min-width: 768px) {
    /* Medium devices (tablets) */
  
    
  }

  @media (min-width: 992px) {
    /* Large devices (desktops) */
   

    
  }

  @media (min-width: 1200px) {
    /* Extra large devices (large desktops) */
  
  }

`;



const SliderButton = styled.button`
padding: 10px 20px;
background-color: transparent;
color: #fff;
border: 1px solid #fff;
border-radius: 4px;
font-weight: bold;
cursor: pointer;
margin-right: 10px;
transition: all 200ms ease-in-out;

&:hover {
  background-color: lightgray;
  color: rgba(0,0,0,0.7);
}

@media (min-width: 280px) {
  /* Extra Small devices (phones) */
  padding: 6px 16px;
  font-size: 0.2em;

}

@media (min-width: 576px) {
  /* Small devices (phones) */
  padding: 7px 17px;
  font-size: 0.2em;

}

@media (min-width: 768px) {
  /* Medium devices (tablets) */
  padding: 8px 18px;
  font-size: 0.2em;

  
}

@media (min-width: 992px) {
  /* Large devices (desktops) */
  padding: 9px 19px;
  font-size: 0.3em;


  
}

@media (min-width: 1200px) {
  /* Extra large devices (large desktops) */
  padding: 10px 20px;
  font-size: 0.3em;
}



`;


const NewsSlider: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    AutoScroll({ playOnInit: true })
  ])
  const [isPlaying, setIsPlaying] = useState(false)

  const headings = ["Airdrop", "DAO Reserve", "Promoters" , "Partners", "Gradual release"];
  const text = [
    "For the Airdrop, we allocate 20% of MIURA tokens to reward early supporters and community members.",
    "With 19% allocated to the DAO Reserve, MIURA ensures community governance and future development funding.", 
    "1% of MIURA tokens is reserved for project promoters who contribute to spreading awareness and adoption.", 
    "MIURA allocates 10% of tokens to project partners, fostering strategic collaborations and ecosystem growth.", 
    "50% of MIURA tokens will be gradually released over three years, ensuring steady growth and stability."
  ];
  

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const onButtonAutoplayClick = useCallback(
    (callback: () => void) => {
      const autoScroll = emblaApi?.plugins()?.autoScroll
      if (!autoScroll) return

      const resetOrStop =
        autoScroll.options.stopOnInteraction === false
          ? autoScroll.reset
          : autoScroll.stop

      resetOrStop()
      callback()
    },
    [emblaApi]
  )

  const toggleAutoplay = useCallback(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll
    if (!autoScroll) return

    const playOrStop = autoScroll.isPlaying()
      ? autoScroll.stop
      : autoScroll.play
    playOrStop()
  }, [emblaApi])

  useEffect(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll
    if (!autoScroll) return

    setIsPlaying(autoScroll.isPlaying())
    emblaApi
      .on('autoScroll:play', () => setIsPlaying(true))
      .on('autoScroll:stop', () => setIsPlaying(false))
      .on('reInit', () => setIsPlaying(autoScroll.isPlaying()))
  }, [emblaApi])

  return (
    <div className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {slides.map((index) => (
            <div className={styles.embla__slide} key={index}>
              <div className={styles.embla__slide__number}>
                <Card>
                    <Image src={`/crousel_${index + 1}.png`} alt="Your Image" width={100} height={100} />
                    <CardHeading>{headings[index]}</CardHeading>
                    <CardText>{text[index]}</CardText>

                    <SliderButton>Learn More</SliderButton>
                    

                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.embla__controls}>
        <div className={styles.embla__buttons}>
          <PrevButton
            onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
            disabled={prevBtnDisabled}
          />
          <NextButton
            onClick={() => onButtonAutoplayClick(onNextButtonClick)}
            disabled={nextBtnDisabled}
          />
        </div>

        <button className={styles.embla__play} onClick={toggleAutoplay} type="button">
          {isPlaying ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  )
}

export default NewsSlider;
