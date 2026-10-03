import React, { useEffect } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import App from './App';
import './styles.css';

function Site() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ duration: 0.9, smoothWheel: true, anchors: { offset: -30 } });
      const ticker = (time) => lenis.raf(time * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(ticker);
      const start = () => lenis.start();
      const stop = () => lenis.stop();
      window.addEventListener('enquiry:open', stop);
      window.addEventListener('enquiry:close', start);
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      // Keep semantic text visible. Motion adds a short arrival, never gates content.
      intro.from('.hero-line', { y: 30, duration: 0.85, stagger: 0.09 })
        .from('.hero-image img', { scale: 1.04, duration: 1.2 }, 0)
        .from('.hero-actions, .hero-description', { y: 14, duration: 0.65, stagger: 0.06 }, 0.2);
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.from(element, { y: 28, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
      });
      let alive = true;
      document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
      return () => {
        alive = false;
        window.removeEventListener('enquiry:open', stop);
        window.removeEventListener('enquiry:close', start);
        gsap.ticker.remove(ticker);
        lenis.destroy();
      };
    });
    return () => media.revert();
  }, []);
  return <App/>;
}

const root = document.getElementById('root');
if (root.querySelector('header')) hydrateRoot(root, <Site/>);
else createRoot(root).render(<Site/>);
