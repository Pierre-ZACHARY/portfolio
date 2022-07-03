import styles from "./blogslider.module.css"
import cardbg from "../../../../../public/cardbg.jpg"
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation, Pagination, Scrollbar, A11y, Keyboard} from 'swiper';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {Blogcard} from "../BlogCard/blogcard";


interface BlogsliderProps {
    content: string
}

export const Blogslider = ({content}: BlogsliderProps) => {
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
                onSlideChange={() => console.log('slide change')}
                className={styles.swiper}
            >
                <SwiperSlide className={styles.swiperslides}><Blogcard cardtitle="Slide 1" datestringiso="2000-01-01" description="Description" imagesrc={cardbg.src} lastupdated={false} mostviewed={true}/></SwiperSlide>
                <SwiperSlide className={styles.swiperslides}><Blogcard cardtitle="Slide 2" datestringiso="2000-01-01" description="Description" imagesrc={cardbg.src} lastupdated={false} mostviewed={false}/></SwiperSlide>
                <SwiperSlide className={styles.swiperslides}><Blogcard cardtitle="Slide 3" datestringiso="2000-01-01" description="Description" imagesrc={cardbg.src} lastupdated={true} mostviewed={false}/></SwiperSlide>
                <SwiperSlide className={styles.swiperslides}><Blogcard cardtitle="Slide 4" datestringiso="2000-01-01" description="Description" imagesrc={cardbg.src} lastupdated={false} mostviewed={false}/></SwiperSlide>
                <SwiperSlide className={styles.swiperslides}><Blogcard cardtitle="Slide 5" datestringiso="2000-01-01" description="Description" imagesrc={cardbg.src} lastupdated={false} mostviewed={false}/></SwiperSlide>
            </Swiper>
        </>
    );
}