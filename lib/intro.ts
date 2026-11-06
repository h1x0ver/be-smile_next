export const INTRO_SESSION_KEY = "besmile-intro-v2";
export const INTRO_DURATION_MS = 1650;

// Runs in <head>, before paint: returning visits never flash the overlay.
// Failure or disabled JavaScript leaves the page visible (CSS hides it by default).
export const INTRO_BOOTSTRAP = `(function(){
  var root=document.documentElement;
  if(root.dataset.bsIntro)return;
  var play=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try{
    if(sessionStorage.getItem(${JSON.stringify(INTRO_SESSION_KEY)}))play=false;
    else if(play)sessionStorage.setItem(${JSON.stringify(INTRO_SESSION_KEY)},'1');
  }catch(e){}
  root.dataset.bsIntro=play?'play':'done';
  if(play)root.dataset.bsIntroStarted=String(performance.now());
})();`;
