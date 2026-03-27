'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

let isRegistered = false;

export const registerGSAP = () => {
  if (isRegistered) {
    return;
  }

  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, MotionPathPlugin);
  isRegistered = true;
};

registerGSAP();

export { gsap, ScrollTrigger, ScrollSmoother, MotionPathPlugin, useGSAP };
