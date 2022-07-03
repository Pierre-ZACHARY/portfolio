import stylesSass from "./headerSection.module.sass"
import {useEffect, useRef, useState} from "react";
import cn from "classnames";
import {useAppDispatch, useAppSelector} from "../../../../../../redux/hooks";
import {executeAction, headerSectionAction} from "./headerSectionAction";

interface HeaderSectionProps{
    content: string
}


export const HeaderSection = ({content}: HeaderSectionProps) => {
    const [state, setState] = useState({left:0, width:0});

    const dispatch = useAppDispatch();

    const runOnceRef = useRef(false);

    const customAnimation =  (target: Element) => {
        let nav = document.getElementsByClassName(cn({[stylesSass.navbar]: true}))[0];
        const targetParent = target.parentElement;
        if(targetParent){
            if(!targetParent.classList.contains(cn([stylesSass.active])) ){
                const list = nav.getElementsByClassName(cn([stylesSass.active]));
                for(let i = 0; i<list.length; i++){
                    list[i].classList.remove(cn([stylesSass.active]));
                }
                let targetLeft = targetParent.offsetLeft;
                let targetWidth = targetParent.clientWidth;
                const currentLeft = state.left;
                const currentWidth = state.width;

                if(targetLeft>=currentLeft) {
                    nav.getElementsByClassName(cn([stylesSass.line]))[0].animate({
                        width: [`${currentWidth}` + "px" , `${targetLeft-currentLeft+targetWidth}` + "px"]
                    }, {duration: 200});
                    setTimeout(()=>{
                        setState({left: currentLeft, width: targetLeft-currentLeft+targetWidth})
                    },200);
                    nav.getElementsByClassName(cn([stylesSass.line]))[0].animate({
                        left: [`${currentLeft}` + "px" ,`${targetLeft}` + "px"],
                        width: [`${targetLeft-currentLeft+targetWidth}` + "px", `${targetWidth}` + "px"]
                    }, {delay: 200, duration: 100});
                }
                else{
                    nav.getElementsByClassName(cn([stylesSass.line]))[0].animate({
                        left: [`${currentLeft}` + "px" ,`${targetLeft}` + "px"],
                        width: [`${currentWidth}` + "px", `${currentLeft-targetLeft+currentWidth}` + "px"]
                    }, {duration:200});
                    setTimeout(()=>{
                        setState({left: targetLeft, width: currentLeft-targetLeft+currentWidth})
                    },200);
                    nav.getElementsByClassName(cn([stylesSass.line]))[0].animate({
                        width: [`${currentLeft-targetLeft+currentWidth}` + "px", `${targetWidth}` + "px"]
                    }, {delay: 200, duration: 100});
                }
                setTimeout(()=> {
                    setState({left: targetLeft, width: targetWidth});
                }, 300);
                targetParent.classList.add(cn([stylesSass.active]));
            }
        }
    }

    useEffect(() => {
        // code to run after render goes here
        let nav = document.getElementsByClassName(cn({[stylesSass.navbar]: true}))[0];
        if(nav && !runOnceRef.current){ // after first render
            let active = nav.getElementsByClassName(cn({[stylesSass.active]: true}));
            if(active.length) {
                runOnceRef.current = true;
                setState({left: active[0].clientLeft, width: active[0].clientWidth});
            }
        }
    }, []);

    const line = <div className={stylesSass.line} style={{left: state.left, width: state.width}}/>;
    // @ts-ignore
    const handleClick = (e:  MouseEvent<HTMLAnchorElement, MouseEvent>) => {

        const target = e.target as Element;
        let nav = document.getElementsByClassName(cn({[stylesSass.navbar]: true}))[0];
        customAnimation(target);
        let alist = nav.getElementsByTagName("a");
        for(let i = 0; i<alist.length; i++){
            if(alist[i] == target){
                executeAction(dispatch, headerSectionAction.Select, i);
                break;
            }
        }
    }

    const selectIndex = (index: number) => {
        let nav: Element | undefined = document.getElementsByClassName(cn({[stylesSass.navbar]: true}))[0];
        if(nav){
            let alist = nav.getElementsByTagName("a");
            if(alist.length){
                let target = alist[index];
                customAnimation(target);
            }
        }
    }

    const selected_index: number = useAppSelector(state => state.headerSection.selected);
    selectIndex(selected_index);

    return (
      <>
          <section className={stylesSass.navbar}>
              <ul>
                  <li className={stylesSass.active}><a href="#" onClick={((e) => handleClick(e))}>First</a></li>
                  <li><a href="#" onClick={((e) => handleClick(e))}>Second</a></li>
                  <li><a href="#" onClick={((e) => handleClick(e))}>Third</a></li>
                  <li><a href="#" onClick={((e) => handleClick(e))}>Fourth</a></li>
              </ul>
              {line}
          </section>
      </>
    );
}