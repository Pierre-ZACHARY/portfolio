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
import Hero from "../../../components/Portfolio/Index/Hero/Hero";
import LoadAfterInteractive from "../../../components/Portfolio/Utils/LoadAfterInteractive";
import LoadWhenVisible from "../../../components/Portfolio/Utils/LoadWhenVisible";

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
  const splineRef = useRef<Application | undefined>(undefined);

  return (
    <>
      <Layout selected={"about"}>
        <Hero/>
        <div className={styles.screen} id="second">
          <h1>{t("header:section2")}</h1>
          <div className={styles.skillsContainer}>
            <LoadAfterInteractive>
              <LoadWhenVisible>
                <SkillsComponent skills={skills}/>
              </LoadWhenVisible>
            </LoadAfterInteractive>
          </div>
        </div>
        <div
          className={styles.screenContact + " " + styles.screen}
          id="fifth"
        >
          <h1>{t("header:section5")}</h1>
          <div className={styles.splineContainer}>
            <LoadAfterInteractive>
              <LoadWhenVisible>
                <Suspense fallback={<div>Loading...</div>}>
                  <Spline
                      onLoad={(spline: Application) => (splineRef.current = spline)}
                      scene="https://prod.spline.design/ZF0DQUkk5PMyP6IZ/scene.splinecode"
                      className={styles.splineObj}
                  />
                </Suspense>
              </LoadWhenVisible>
            </LoadAfterInteractive>
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
              <a href={"#"}
                  aria-label={"Copy Email"}
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
