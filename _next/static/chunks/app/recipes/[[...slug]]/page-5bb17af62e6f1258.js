(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[594],{207:function(e,t,n){Promise.resolve().then(n.t.bind(n,6685,23)),Promise.resolve().then(n.bind(n,8400))},8400:function(e,t,n){"use strict";n.r(t),n.d(t,{RecipeView:function(){return c}});var i=n(7437),r=n(7415),s=n(9116),a=n(5898),l=n(329),o=n(3455),d=n(2265);function c(e){let{name:t,recipe:n}=e,c=(0,d.useMemo)(()=>parseInt(n.metadata.servings,10)||null,[n]),[u,m]=d.useState(c),h=c?u/c:1,x=(0,d.useCallback)(()=>{m(e=>e+1)},[]),p=(0,d.useCallback)(()=>{m(e=>Math.max(1,e-1))},[]);return(0,i.jsxs)(r.Z,{sx:{p:1},children:[(0,i.jsx)(s.ZP,{level:"h3",component:"h1",mb:1,children:t}),n.metadata.note&&(0,i.jsxs)(s.ZP,{level:"body-md",sx:{fontFamily:"Indie Flower",color:"#12467B",mb:2},children:[(0,i.jsx)("strong",{children:"Notiz:"})," ",n.metadata.note]}),(0,i.jsxs)(r.Z,{sx:{display:"flex",flexDirection:"row"},children:[(0,i.jsx)(s.ZP,{level:"title-lg",component:"h2",sx:{flex:1,verticalAlign:"bottom"},children:"Zutaten"}),c&&(0,i.jsxs)(r.Z,{sx:{width:200,display:"flex",flexDirection:"row",ml:1,mt:-1},children:[(0,i.jsx)(a.ZP,{variant:"soft",color:"primary",size:"sm",disabled:1===u,onClick:p,children:"-"}),(0,i.jsxs)(s.ZP,{sx:{flex:1,textAlign:"center",lineHeight:"32px"},children:[u," Portionen"]}),(0,i.jsx)(a.ZP,{variant:"soft",color:"primary",size:"sm",onClick:x,children:"+"})]})]}),(0,i.jsx)(l.Z,{stripe:"odd",borderAxis:"none",sx:{"& tr":{borderRadius:6},"& td:first-child":{textAlign:"right",width:"33.33%",borderTopLeftRadius:6,borderBottomLeftRadius:6},"& td:last-child":{borderTopRightRadius:6,borderBottomRightRadius:6},mt:1,mb:2},children:(0,i.jsx)("tbody",{children:n.ingredients.map((e,t)=>(0,i.jsxs)("tr",{children:[(0,i.jsxs)("td",{children:["some"===e.quantity?"etwas":"string"==typeof e.quantity?e.quantity:e.quantity*h,e.units&&" ".concat(e.units)]}),(0,i.jsx)("td",{children:e.name})]},t))})}),(0,i.jsx)(s.ZP,{level:"title-lg",component:"h2",mt:2,children:"Zubereitung"}),n.steps.map((e,t)=>(0,i.jsxs)(d.Fragment,{children:[e.some(e=>"ingredient"===e.type)&&(0,i.jsx)(s.ZP,{level:"body-xs",children:e.filter(e=>"ingredient"===e.type).map((e,t)=>"ingredient"===e.type&&(0,i.jsxs)("span",{children:[t>0&&", ","some"===e.quantity?"etwas":"string"==typeof e.quantity?e.quantity:e.quantity*h,e.units&&" ".concat(e.units)," ",e.name]},t))}),(0,i.jsx)(s.ZP,{mb:2,children:e.map((e,t)=>{switch(e.type){case"text":return(0,i.jsx)(d.Fragment,{children:e.value},t);case"ingredient":return(0,i.jsx)(d.Fragment,{children:e.name},t);case"cookware":return(0,i.jsxs)(d.Fragment,{children:[e.name," ",e.quantity]},t);case"timer":return(0,i.jsxs)(d.Fragment,{children:[e.quantity," ",e.units]},t)}})})]},t)),n.metadata.source&&(0,i.jsxs)(s.ZP,{level:"body-sm",children:["Quelle:"," ",n.metadata.source.startsWith("http")?(0,i.jsx)(o.Z,{href:n.metadata.source,target:"_blank",rel:"noreferrer noopener",children:new URL(n.metadata.source).host}):n.metadata.source]})]})}n(9590)}},function(e){e.O(0,[698,563,971,596,744],function(){return e(e.s=207)}),_N_E=e.O()}]);