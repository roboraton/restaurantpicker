(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();async function e(e){let t=`https://www.themealdb.com/api/json/v1/1/search.php?s=${e}`,n=await(await fetch(t)).json();return n.meals?n.meals.map(e=>({id:e.idMeal,name:e.strMeal,type:e.strCategory,image:e.strMealThumb,area:e.strArea,instructions:e.strInstructions,tags:e.strTags,rating:Math.floor(Math.random()*5)+1,price:Math.floor(Math.random()*3)+1})):[]}async function t(e){let t=`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${e}`,n=await(await fetch(t)).json();return n.meals?n.meals[0]:null}async function n(t){return await e(t)}function r(e,t){return e.filter(e=>{let n=t.filters.type?e.name.toLowerCase().includes(t.filters.type.toLowerCase()):!0,r=t.filters.rating?(e.rating||5)>=t.filters.rating:!0;return n&&r})}var i=null;function a(e,t,n){if(!e||e.length===0)return;clearInterval(i);let r=0,a=[...e];for(let e=a.length-1;e>0;e--){let t=Math.floor(Math.random()*(e+1));[a[e],a[t]]=[a[t],a[e]]}let o=a[Math.floor(Math.random()*a.length)],s=0,c=Math.min(18,Math.max(8,a.length*2));i=setInterval(()=>{let e=a[r%a.length];t(e),r++,s++,s>=c&&(clearInterval(i),t(o),n(o))},120)}var o=`favorites`;function s(){let e=localStorage.getItem(o);return e?JSON.parse(e):[]}function c(e){localStorage.setItem(o,JSON.stringify(e))}function l(e){let t=s();t.some(t=>t.name===e.name)||(t.push(e),c(t))}function u(e){c(s().filter(t=>t.name!==e))}var d=`history`,f=10;function p(){let e=localStorage.getItem(d);return e?JSON.parse(e):[]}function m(e){localStorage.setItem(d,JSON.stringify(e))}function h(e){let t=p();t=t.filter(t=>t.name!==e.name),t.unshift(e),t.length>f&&(t=t.slice(0,f)),m(t)}function g(){localStorage.removeItem(`history`)}function _(e,t){let n=document.getElementById(`results`);n.innerHTML=``,e.forEach(e=>{let r=document.createElement(`div`);r.className=`result-card`,r.innerHTML=`
      <h3>${e.name}</h3>

      <p style="font-size:12px; color:#666; margin:2px 0;">
        ${e.type||`Unknown type`}
      </p>

      <p style="font-size:12px; color:#999; margin:0;">
        ⭐ ${e.rating??`-`} | ${`$`.repeat(e.price??1)}
      </p>
    `,r.addEventListener(`click`,()=>{t(e),document.dispatchEvent(new CustomEvent(`restaurantSelected`,{detail:e}))}),n.appendChild(r)})}function v(e){document.querySelectorAll(`#results .result-card`).forEach(t=>{t.classList.remove(`highlight`,`winner`),t.querySelector(`h3`)?.textContent?.trim()===e.name&&(t.classList.add(`highlight`,`winner`),setTimeout(()=>{t.classList.remove(`winner`)},500),t.scrollIntoView({behavior:`smooth`,block:`nearest`}))})}async function y(e){let n=document.getElementById(`details`);n.classList.remove(`show`);let r=await t(e.id);n.innerHTML=`
    <div class="card-flip">
      <div class="card-inner">

        <!-- FRONT -->
        <div class="card-front">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2 style="margin:0;">${e.name}</h2>
            <button id="favBtn">❤️</button>
          </div>

          <p><strong>Type:</strong> ${e.type||`Not available`}</p>

          ${e.image?`<img src="${e.image}" style="width:100%; border-radius:8px; margin-top:10px;" />`:``}
        </div>

        <!-- BACK -->
        <div class="card-back">
          ${r?.strInstructions?`<p style="font-size:13px; color:#555;">
                  ${r.strInstructions.substring(0,200)}...
                 </p>`:`<p>No details available</p>`}
        </div>

      </div>
    </div>
  `;let i=document.getElementById(`favBtn`);i&&i.addEventListener(`click`,()=>{l(e),b()}),document.dispatchEvent(new CustomEvent(`addToHistory`,{detail:e})),setTimeout(()=>{n.classList.add(`show`)},50),n.scrollIntoView({behavior:`smooth`})}function b(){let e=document.getElementById(`favorites`),t=s();if(e.innerHTML=`<h3>Favorites</h3>`,t.length===0){e.innerHTML+=`<p>No favorites yet</p>`;return}t.forEach(t=>{let n=document.createElement(`div`);n.className=`result-card pop-in`,n.innerHTML=`
      <h4>${t.name}</h4>
      <p style="font-size:13px; color:#666;">${t.type||``}</p>
      <button data-name="${t.name}">Remove</button>
    `,n.querySelector(`button`).addEventListener(`click`,e=>{e.stopPropagation();let t=e.target.dataset.name,n=e.target.closest(`.result-card`);n.classList.add(`snap-out`);let r=!1,i=()=>{r||(r=!0,u(t),b())};n.addEventListener(`animationend`,i,{once:!0}),setTimeout(i,600)}),n.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`restaurantSelected`,{detail:t}))}),e.appendChild(n)})}function x(){let e=document.getElementById(`history`),t=p();if(e.innerHTML=`
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h3>History</h3>
      <button id="clearHistoryBtn">Clear History</button>
    </div>
  `,t.length===0){e.innerHTML+=`<p>No history yet</p>`;return}t.forEach(t=>{let n=document.createElement(`div`);n.className=`result-card pop-in`,n.innerHTML=`<p>${t.name}</p>`,n.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`restaurantSelected`,{detail:t}))}),e.appendChild(n)});let n=document.getElementById(`clearHistoryBtn`);n&&n.addEventListener(`click`,()=>{e.querySelectorAll(`.result-card`).forEach(e=>e.classList.add(`snap-out`)),setTimeout(()=>{g(),x()},400)})}async function S(){return new Promise(e=>{navigator.geolocation.getCurrentPosition(t=>{e({lat:t.coords.latitude,lng:t.coords.longitude})},()=>{e(null)})})}var C,w=[],T=null,E=null,D=null;function O(){C=new google.maps.Map(document.getElementById(`map`),{center:{lat:19.4326,lng:-99.1332},zoom:13}),D&&A()}function k(e){e&&(D={lat:e.lat,lng:e.lng},C&&A())}function A(){!C||!D||(C.setCenter(D),T&&T.setMap(null),T=new google.maps.Marker({position:D,map:C,title:`You are here`,icon:`http://maps.google.com/mapfiles/ms/icons/blue-dot.png`}))}function j(){w.forEach(e=>e.setMap(null)),w=[],E&&=(E.clearMarkers(),null)}function M(e,t){let n=t/8*Math.PI*2,r=.01+t%3*.003;return{lat:e.lat+Math.cos(n)*r,lng:e.lng+Math.sin(n)*r}}function N(e){if(!C||!e||e.length===0)return;j();let t=D||C.getCenter().toJSON();e.forEach((e,n)=>{let r=M(t,n),i=new google.maps.Marker({position:r,map:C,title:e.name});i.addListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`restaurantSelected`,{detail:e}))}),w.push(i)}),window.markerClusterer&&window.markerClusterer.MarkerClusterer&&w.length>0&&(E=new window.markerClusterer.MarkerClusterer({map:C,markers:w}))}var P=[],F=null,I={filters:{type:null,rating:null}},L=document.querySelector(`#randomBtn`),R=document.querySelector(`#typeFilter`),z=document.querySelector(`#ratingFilter`),B=document.querySelector(`#resetFilters`);window.initMap=()=>{O(),F&&k(F),P.length>0&&N(H())};async function V(){try{F=await S(),F&&k(F)}catch{console.log(`Location not available`)}b(),x()}V();function H(){return r(P,I)}R.addEventListener(`change`,async e=>{let t=e.target.value;if(I.filters.type=t||null,!t){P=[],U();return}P=await n(t),U()}),z.addEventListener(`change`,e=>{I.filters.rating=e.target.value?parseInt(e.target.value):null,U()}),B.addEventListener(`click`,()=>{I.filters.type=null,I.filters.rating=null,R.value=``,z.value=``,P=[],U()}),L.addEventListener(`click`,()=>{let e=H();if(e.length===0){alert(`Pick a food type first!`);return}a(e,v,e=>{y(e)})});function U(){let e=H();_(e,e=>{y(e)}),e.length>0&&N(e)}document.addEventListener(`restaurantSelected`,e=>{y(e.detail)}),document.addEventListener(`favoritesUpdated`,()=>{b()}),document.addEventListener(`addToHistory`,e=>{h(e.detail),x()});