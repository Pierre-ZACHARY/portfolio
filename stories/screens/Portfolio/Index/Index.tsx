import styles from "./Index.module.css";
import sass from "./Index.module.sass";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import Image from "next/image";
import profile from "../../../../public/profile.jpg";

import {
  executeHeaderSectionAction,
  headerSectionAction,
} from "../../../components/Portfolio/Layout/Header/HeaderSection/headerSectionAction";
import { Scrolldown } from "../../../components/Portfolio/Index/ScollDown/scrolldown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClipboard,
  faCopy,
  faDownload,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  Blogslider,
  BlogsliderProps,
} from "../../../components/Portfolio/Index/BlogSlider/blogslider";
import { motion } from "framer-motion";
import { getDimensions } from "lib/utils";
import { DisplayShop } from "../../../components/Portfolio/Shop/DisplayShop/DisplayShop";
import { Application, SPEObject } from "@splinetool/runtime";
import {
  faDiscord,
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {VFile} from "vfile";
import {SkillsComponent} from "../Home/Skills/Skills";
import {JsonTree} from "../../../../pages";
import {Layout} from "../../../components/Portfolio/NewLayout/Layout";
import dynamic from "next/dynamic";
import { Suspense } from 'react'
import useIsVisible from "../../../../lib/useIsVisible";

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  suspense: true,
})


export interface IndexProps {
  skills: JsonTree[],
}

interface IndexState {
  mounted: boolean;
}

export const Index = ({
  skills = [],
}: IndexProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<boolean>(false);
  const [pageFullyLoaded, setPageFullyLoaded] = useState<boolean>(false);
  const skillsRef = useRef(null);
  const skillIsVisible = useIsVisible(skillsRef);
  const contactRef = useRef(null);
  const contactIsVisible = useIsVisible(contactRef);


  function handlePageLoad() {
    setTimeout(()=>setPageFullyLoaded(true), 1500);
  }
  useEffect(()=>{
    // console.log(pageFullyLoaded)
    if (document.readyState === "complete") {
    handlePageLoad();
  }else{
    window.addEventListener("load", handlePageLoad);
    return ()=>window.removeEventListener("load", handlePageLoad);
  }

  }, []);
  const splineRef = useRef<Application | undefined>(undefined);



  const setScreenHeight = () => {
    let elem = document.getElementById(styles["mobilePresentation"])!;
    elem.setAttribute("style", "height:" + (window.innerHeight) + "px;");
  };

  useEffect(() => {
    setScreenHeight();
    window.addEventListener("resize", setScreenHeight);

    return () => {
      window.removeEventListener("resize", setScreenHeight);
    };
  }, []);

  return (
    <>
      <Layout selected={"about"}>
        <div className={styles.home} id="first">
          <div
            className={styles.screen}
            style={{ paddingTop: 0, minHeight: "100vh" }}
          >
            <div id={styles["mobilePresentation"]}>
              <Image
                id="profilePicture"
                src={profile}
                alt="Profile Picture"
                width="100%"
                height="100%"
                quality={"100"}
                priority
              />
              <h1 style={{ marginTop: 20 }}>Pierre Zachary</h1>
              <a href="/cv.pdf" target="_blank" aria-label={"Download CV"}>
                <button>
                  <FontAwesomeIcon icon={faDownload} /> {t("index:downloadCv")}
                </button>
              </a>
              <Scrolldown />
            </div>
          </div>
          <div className={styles.screen}>
            <div className={styles.presentationContainer}>
              <motion.h2
                initial={{ opacity: 0, y: -50 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                {t("index:Welcome")} <span>👋</span>{" "}
                <span
                  dangerouslySetInnerHTML={{ __html: t("index:IntroHtml") }}
                />{" "}
              </motion.h2>
              <motion.h2
                initial={{ opacity: 0, y: -50 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                dangerouslySetInnerHTML={{ __html: t("index:Intro2Html") }}
              ></motion.h2>
              <motion.h2
                initial={{ opacity: 0, y: -50 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                dangerouslySetInnerHTML={{ __html: t("index:Intro3Html") }}
              ></motion.h2>
            </div>
          </div>
        </div>
        <div className={styles.screen} id="second">
          <h1>{t("header:section2")}</h1>
          <div className={styles.skillsContainer} ref={skillsRef}>
            {pageFullyLoaded && skillIsVisible ?
                <SkillsComponent skills={skills}/> :
                <div >Loading...</div>
            }
          </div>


        </div>
        <div
          className={styles.screenContact + " " + styles.screen}
          id="fifth"
        >
          <h1>{t("header:section5")}</h1>
          <div className={styles.splineContainer} ref={contactRef}>
            {pageFullyLoaded && contactIsVisible ?
                <Suspense fallback={<div>Loading...</div>}>

                  <Spline
                      onLoad={(spline: Application) => (splineRef.current = spline)}
                      scene="https://prod.spline.design/ZF0DQUkk5PMyP6IZ/scene.splinecode"
                      className={styles.splineObj}
                    />
                </Suspense>
                :<div>Loading...</div>
            }
          </div>
          <div
            className={sass.container}
            onMouseLeave={() => {
              splineRef.current
                ?.findObjectByName("ResetView")
                ?.emitEvent("mouseDown");
              setTimeout(
                () =>
                  splineRef.current
                    ?.findObjectByName("Rotate")
                    ?.emitEvent("mouseDown"),
                1000
              );
            }}
          >
            <div
              className={sass.mail}
              onMouseEnter={() => {
                splineRef.current
                  ?.findObjectByName("LookAtMail")
                  ?.emitEvent("mouseDown");
              }}
            >
              <a href={"mailto:pierre.zachary45@gmail.com"} aria-label={"pierre.zachary45@gmail.com"}>
                pierre.zachary45@gmail.com
              </a>
              <a aria-label={"Copy Email"}
                onClick={() => {
                  navigator.clipboard
                    .writeText("pierre.zachary45@gmail.com")
                    .then((r) => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 3000);
                    });
                }}
              >
                {copied ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon icon={faCopy} />
                )}
              </a>
            </div>
            <div className={sass.socialsIcons}>
              <a aria-label={"Discord"}
                 href={"/"}
                onMouseEnter={() => {
                  splineRef.current
                    ?.findObjectByName("LookAtDiscord")
                    ?.emitEvent("mouseDown");
                }}
              >
                <FontAwesomeIcon icon={faDiscord as IconProp} />
              </a>
              <a aria-label={"Twitter"}
                 href={"/"}
                onMouseEnter={() => {
                  splineRef.current
                    ?.findObjectByName("LookAtTwitter")
                    ?.emitEvent("mouseDown");
                }}
              >
                <FontAwesomeIcon icon={faTwitter as IconProp} />
              </a>
              <a aria-label={"Phone"}
                 href={"/"}
                onMouseEnter={() => {
                  splineRef.current
                    ?.findObjectByName("LookAtTel")
                    ?.emitEvent("mouseDown");
                }}
              >
                <FontAwesomeIcon icon={faPhone as IconProp} />
              </a>
              <a aria-label={"Linkedin"}
                 href={"/"}
                 onMouseEnter={() => {
                  splineRef.current
                    ?.findObjectByName("LookAtLinkedin")
                    ?.emitEvent("mouseDown");
                }}
              >
                <FontAwesomeIcon icon={faLinkedin as IconProp} />
              </a>
              <a aria-label={"GitHub"}
                href={"https://github.com/Pierre-ZACHARY"}
                rel={"_blank"}
                onMouseEnter={() => {
                  splineRef.current
                    ?.findObjectByName("LookAtGithub")
                    ?.emitEvent("mouseDown");
                }}
              >
                <FontAwesomeIcon icon={faGithub as IconProp} />
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
