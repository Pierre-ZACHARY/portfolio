import styles from "./blogslider.module.css"
import cardbg from "../../../../../public/cardbg.jpg"
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation, Pagination, Scrollbar, A11y, Keyboard} from 'swiper';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {Blogcard} from "../BlogCard/blogcard";


interface BlogSlideI{
    title: string,
    id: string,
    date: string,
    descriptionHtml: string,
    lastupdated: boolean,
}

export interface BlogsliderProps {
    content: BlogSlideI[]
}

export const Blogslider = ({content = [{
        id: "dadza",
        title: "Bonjour",
        date: "2020-01-01",
    descriptionHtml: "La description :)",
        lastupdated: true,
    }]}: BlogsliderProps) => {
    console.log(content);
    return (
        <>
            <Swiper
                // install Swiper modules
                modules={[Keyboard, Navigation, Pagination, Scrollbar, A11y]}
                slidesPerView={1}
                spaceBetween={50}
                navigation
                keyboard={{
                    enabled: true,
                }}
                centeredSlides={true}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                    1440: {
                        slidesPerView: 5,
                    },
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                className={styles.swiper}
            >
                {content.map((slide, key) =>
                        (<SwiperSlide key={key}
                                     className={styles.swiperslides}>
                                <Blogcard cardtitle={slide.title}
                                          id={slide.id}
                                          datestringiso={slide.date}
                                          descriptionHtml={slide.descriptionHtml}
                                          lastupdated={slide.lastupdated}
                                          mostviewed={false}/>
                        </SwiperSlide>)
                    )
                }

            </Swiper>
        </>
    );
}