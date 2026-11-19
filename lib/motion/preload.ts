export const PRELOAD_KEY = "ya-preloaded";

/** Script inline (dans <head>) : pose un voile avant le premier rendu pour éviter tout flash. */
export const preloadScript = `try{if(sessionStorage.getItem("${PRELOAD_KEY}")!=="1"&&!matchMedia("(prefers-reduced-motion: reduce)").matches){var d=document.documentElement;d.dataset.preload="1";setTimeout(function(){delete d.dataset.preload},3000)}}catch(e){}`;
