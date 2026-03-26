'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isRegistered = false;

export const registerGSAP = () => {
  if (isRegistered) {
    return;
  }

  gsap.registerPlugin(useGSAP, ScrollTrigger);
  isRegistered = true;
};

registerGSAP();

export { gsap, ScrollTrigger, useGSAP };
