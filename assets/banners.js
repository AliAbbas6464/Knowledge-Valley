/* Knowledge Valley — hero banner slider */
document.addEventListener('DOMContentLoaded',function(){
  var sl=document.querySelector('.bn-slider'); if(!sl) return;
  var s=[].slice.call(sl.querySelectorAll('.bn-slide')),d=document.getElementById('bnDots'),i=0,t=null;
  s.forEach(function(_,k){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Banner '+(k+1));b.addEventListener('click',function(){go(k);play();});d.appendChild(b);});
  var db=d.children;
  function go(n){i=(n+s.length)%s.length;s.forEach(function(e,k){var on=k===i;e.classList.toggle('bn-on',on);e.setAttribute('aria-hidden',on?'false':'true');db[k].classList.toggle('bn-on',on);});}
  var BASE=14000,EXTRA=10000;
  function stop(){if(t){clearTimeout(t);t=null;}}
  function sched(ms){stop();if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;t=setTimeout(function(){go(i+1);sched(BASE);},ms);}
  function play(){sched(BASE);}
  function extend(){sched(BASE+EXTRA);}
  document.getElementById('bnPrev').addEventListener('click',function(){go(i-1);play();});
  document.getElementById('bnNext').addEventListener('click',function(){go(i+1);play();});
  sl.addEventListener('pointerdown',extend);sl.addEventListener('keydown',extend);
  go(0);play();
});
