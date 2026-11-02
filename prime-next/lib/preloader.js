/**
 * Shared contract between the inline boot script (runs in <head> before first
 * paint) and the <Preloader> component (runs after hydration).
 *
 * Classes on <html>:
 *   pl       a preloader exists — shows the overlay, and stops the header
 *            logo playing its own entrance (the flying PRIME *is* its entrance)
 *   pl-hold  hero entrance animations are held at frame zero
 *   pl-logo  the real header logo is hidden while its stand-in flies to it
 *
 * They are set by script, never in server HTML. So with JavaScript disabled the
 * overlay never appears and the hero renders normally — no blank page.
 */
export const PL_CLASSES = ["pl", "pl-hold", "pl-logo"];

/* Safety net: if the app never hydrates (a JS error, a failed chunk), lift the
   curtain anyway rather than leave the visitor staring at a loader forever. */
const SAFETY_MS = 7000;

export const PRELOADER_BOOT = `(function(){try{
var d=document.documentElement,c=${JSON.stringify(PL_CLASSES)};
c.forEach(function(k){d.classList.add(k)});
setTimeout(function(){if(!window.__primeLoader){c.forEach(function(k){d.classList.remove(k)})}},${SAFETY_MS});
}catch(e){}})()`;
