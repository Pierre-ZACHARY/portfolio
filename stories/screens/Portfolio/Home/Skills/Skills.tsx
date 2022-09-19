import Spline from "@splinetool/react-spline";
import styles from "./Skills.module.sass";
import { Application, SPEObject } from "@splinetool/runtime";
import {createContext, useContext, useEffect, useRef, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowRight,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {AnimatePresence, motion, useIsPresent, usePresence} from "framer-motion";
import { JsonTree } from "../../../../../pages";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import {setSecondLevelIndex, setTopLevelIndex} from "./SkillsReducer";
import Image from "next/image";

const SplineContext = createContext<Application | undefined>(undefined)


const ImageWithPresence = ({src, alt, title}: {src: string, alt: string, title: string}) => {

  const spline = useContext(SplineContext)

  useEffect(()=>{
    console.log(spline);
    if(spline){
      spline.findObjectByName(title)?.emitEvent("mouseDown");
    }
    return ()=> {
      if(spline){
        spline.findObjectByName(title)?.emitEvent("mouseUp");
      }
    };
  }, [title, spline])

  return <Image
      objectFit={"contain"}
      title={title}
      alt={alt}
      src={src}
      height={20}
      width={20}
  />
}

function ulChildNodesToJSX(childNodes: any[]): JSX.Element[] {
  const res = [];
  for (const child of childNodes) {
    if (child.childNodes.length)
      res.push(<li>{childNodesToText(child.childNodes).map((e, i)=> <JustJsxElem key={e.key ?? i+e.props.toString()} justJsx={e}/>)}</li>);
  }
  return res;
}
function childNodesToText(childNodes: any[]): JSX.Element[] {
  const res: JSX.Element[] = [];
  let temp = <p key={childNodes.length+childNodes.keys().toString()}></p>;
  for (const child of childNodes) {
    if (child.childNodes.length)
      temp = <>{childNodesToText(child.childNodes).map((e, i)=> <JustJsxElem key={e.key ?? i+e.props.toString()} justJsx={e}/>)}</>;
    else temp = <>{child._rawText}</>;
    if (child.rawTagName != undefined) {
      switch (child.rawTagName) {
        case "strong": {
          temp = <strong key={temp.key}>{temp}</strong>;
          break;
        }
        case "a": {
          temp = (
            <a key={temp.key ?? child.rawAttrs.split('"')[1]} href={child.rawAttrs.split('"')[1]} target={"_blank"} rel="noreferrer">
              {temp}
            </a>
          );
          break;
        }
        case "img": {
          temp = <ImageWithPresence
              title={child.rawAttrs.split('title="')[1].split('"')[0]}
              alt={child.rawAttrs.split('alt="')[1].split('"')[0]}
              src={child.rawAttrs.split('src="')[1].split('"')[0]}
            />;
          break;
        }
        default:
          alert(child.rawTagName);
      }
    }
    res.push(temp);
  }
  return res;
}
const JustJsxElem= ({...props}: {justJsx: JSX.Element}) => {
  return <>{props.justJsx}</>
}
const Skill = ({ skill }: { skill: JsonTree }) => {
  switch (skill.content.rawTagName) {
    case "h3": {
      if (skill.children.length)
        return (
          <>
            <h3>{childNodesToText(skill.content.childNodes).map((e, i)=> <JustJsxElem key={e.key ?? i+e.props.toString()} justJsx={e}/>)}</h3>{" "}
            {skill.children.map((s, i) => {
              return <Skill key={s.children.length +String.fromCharCode(87 + i)+ i} skill={s}/>
            })}
          </>
        );
      break;
    }
    case "p":
      return (
        <>
          <p>{childNodesToText(skill.content.childNodes).map((e, i)=> <JustJsxElem key={e.key ?? i+e.props.toString()} justJsx={e}/>)}</p>
        </>
      );
    case "ul":
      return (
        <>
          <ul>{ulChildNodesToJSX(skill.content.childNodes)}</ul>
        </>
      );
  }
  return <></>;
};



export const SkillsComponent = ({ skills }: { skills: JsonTree[] }) => {
  const [splineState, setSplineState] = useState<Application | undefined>(undefined);
  const camRef = useRef<SPEObject | undefined>(undefined);

  function onLoad(spline: Application) {
    setSplineState(spline);
    camRef.current = spline.findObjectById(
      "13b3d49f-38b0-4a8e-8c3e-85172aa9af0c"
    );
  }

  return (
      <SplineContext.Provider value={splineState}>
        <div className={styles.main}>
          <div className={styles.skills}>
            <Spline
              scene="https://prod.spline.design/XhjYI7UwM5Mo2WPm/scene.splinecode"
              onLoad={onLoad}
            />
          </div>
          <div className={styles.select}>
            {skills.map((s, i) => <div key={s.children.length +String.fromCharCode(87 + i)+ i}><SkillH1  skill={s} index={i} /></div>
            )}
          </div>
        </div>
      </SplineContext.Provider>
  );
};

const SkillH1 = ({ skill, index }: { skill: JsonTree; index: number }) => {
  const dispatch = useAppDispatch();
  const selectedTopLevelIndex = useAppSelector(
    (state) => state.skills.topLevelIndex
  );
  if (selectedTopLevelIndex != undefined && index != selectedTopLevelIndex)
    return <div className={styles.topLevelContainer}></div>;



  return (
    <div className={styles.topLevelContainer}>
      <motion.div
        layoutId={skill.children.length +String.fromCharCode(87 + index)+ skill}
        onClick={() =>
          dispatch(
            setTopLevelIndex(selectedTopLevelIndex == index ? undefined : index)
          )
        }
        className={styles.titleOnClick}
        id={styles["title" + index]}
      >
        {selectedTopLevelIndex == index && (
          <FontAwesomeIcon icon={faChevronLeft} />
        )}
        <h1>{childNodesToText(skill.content.childNodes).map((e, i)=> <JustJsxElem key={e.key ?? i+e.props.toString()} justJsx={e}/>)}</h1>
      </motion.div>{" "}
      {selectedTopLevelIndex != undefined &&
        skill.children.map((s, i) =>

          <motion.div
            key={s.children.length +String.fromCharCode(87 + i)+ i}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.2 }}
          >
            <SkillH2 skill={s} index={i} />
          </motion.div>
        )}
      {selectedTopLevelIndex != undefined && <div />}
    </div>
  );
};

const SkillH2 = ({ skill, index }: { skill: JsonTree; index: number }) => {
  const dispatch = useAppDispatch();
  const selectedH2 = useAppSelector((state) => state.skills.secondLevelIndex);

  return (
    <div className={styles.h2MainContainer}>
      <motion.div
        layoutId={skill.content.toString() + index}
        className={styles.h2Container}
        onClick={() =>
          dispatch(setSecondLevelIndex(selectedH2 == index ? undefined : index))
        }
      >
        <h2>{childNodesToText(skill.content.childNodes).map((e, i)=> <JustJsxElem key={e.key ?? i+e.props.toString()} justJsx={e}/>)}</h2>
        <FontAwesomeIcon
          icon={selectedH2 == index ? faChevronDown : faChevronRight}
        />
      </motion.div>
      {selectedH2 == index &&
        skill.children.map((s, i) =>
          <motion.div
            key={s.children.length +String.fromCharCode(87 + i + s.children.length*3 + 135%i)+ i}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: (i - 1) * 0.3 }}
          >
            <Skill skill={s} />
          </motion.div>
        )}
    </div>
  );
};
