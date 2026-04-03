import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

let isRegistered = false;

const registerGSAP = () => {
  if (isRegistered) {
    return;
  }
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    MorphSVGPlugin,
    ScrollSmoother,
    MotionPathPlugin
  );
  isRegistered = true;
};

registerGSAP();

export {
  gsap,
  ScrollTrigger,
  MotionPathPlugin,
  MorphSVGPlugin,
  ScrollSmoother,
  useGSAP,
};
