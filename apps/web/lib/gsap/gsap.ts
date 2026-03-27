'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

let isRegistered = false;

export const registerGSAP = () => {
  if (isRegistered) {
    return;
  }

  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);
  isRegistered = true;
};

registerGSAP();

export { gsap, ScrollTrigger, ScrollSmoother, useGSAP };
