import{_ as D}from"./funcionario-b96a7293.js";import{Q as A,j as n,o as i,f as a,b as e,F,p as $,a as f,u as r,t as b,g}from"./app-a0ee21ef.js";import B from"./EditUsuario-35971a05.js";import N from"./DelUsuario-6eb7bbdf.js";import U from"./Permissoes-cda43dda.js";import"./FormEditUsuario-6de1774d.js";import"./toastr-4cdd8a3e.js";import"./toastr-6cc5e9af.js";/* empty css                   */import"./functions-e6ce0893.js";import"./html2pdf-30a93cdf.js";import"./ClipboardDocumentCheckIcon-608c2712.js";import"./transition-ddbcad86.js";import"./FormPermissoes-4b17ebda.js";const V={class:"card w-full h-[35rem] sm:h-[38rem] bg-base-100 border border-base-200 shadow-xl overflow-auto rounded-md"},S={class:"card-body flex flex-col sm:flex-row"},z={class:"w-full flex flex-col flex-wrap md:flex-row"},G=["id"],I=["id"],L={class:"w-full flex-col sm:flex sm:flex-wrap"},Q={class:"w-full flex justify-center"},q=e("div",{class:"w-4/12"},[e("img",{class:"w-[5rem] h-[5rem] hover:scale-150 transition-all duration-1000 rounded-md",src:D,alt:"Foto-painel"})],-1),H={class:"w-6/12"},J={class:"text-xs sm:text-xl font-extrabold"},K={class:"text-red-500"},M={class:"w-full flex flex-wrap sm:flex-nowrap justify-center my-2 space-x-2"},O={class:"w-full"},P={class:"sm:flex flex-wrap"},R={class:"w-full flex flex-col items-center space-y-3 mt-4"},T={class:"text-xs sm:text-base"},W={class:"w-full flex items-center justify-around mt-4 space-x-2"},X=["onClick"],Y=["onClick"],fe={__name:"GridUsuario",props:["usuarios","funcoes"],setup(p){const c=p,_=A(),l=n(""),y=_.props.user.permissions.includes("editar usuario"),k=_.props.user.permissions.includes("editar usuario"),x=c.can,d=n(!1),u=n(!1),m=n(!1);function v(s,o){s==="t"?(l.value=o,d.value=!0):(d.value=!1,window.location.reload())}function w(s,o){s==="t"?(l.value=o,u.value=!0):(u.value=!1,window.location.reload())}function C(s,o){s==="t"?(l.value=o,m.value=!0):(m.value=!1,window.location.reload())}const E=s=>c.funcoes.find(t=>t.id===s).name;return(s,o)=>(i(),a("div",V,[e("div",S,[e("div",z,[(i(!0),a(F,null,$(p.usuarios,(t,h)=>(i(),a("div",{key:h,id:t.id,class:"card w-full sm:w-[24%] h-[16rem] bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4 hover:scale-[1.1] hover:z-50 transition-all duration-500"},[e("div",{class:"card-body flex",id:h},[e("div",L,[e("div",Q,[q,e("div",H,[e("p",J,[e("span",K,b(t.name),1)])])]),e("div",M,[e("div",O,[e("div",P,[e("div",R,[e("p",T,"Função: "+b(E(t.function)),1)]),e("div",W,[r(y)?(i(),a("label",{key:0,class:"inline-flex w-6/12 justify-center rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-amber-300 sm:mt-0 sm:w-5/12",onClick:j=>v("t",t)},"Editar",8,X)):g("",!0),r(k)?(i(),a("label",{key:1,class:"inline-flex w-6/12 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-300 sm:ml-3 sm:w-5/12",onClick:j=>w("t",t)},"Inativar",8,Y)):g("",!0)])])])])])],8,I)],8,G))),128))]),f(B,{openEdit:d.value,onCloseEdit:v,usuario:l.value,funcoes:c.funcoes},null,8,["openEdit","usuario","funcoes"]),f(N,{openDel:u.value,onCloseDel:w,usuario:l.value,permissions:r(x)},null,8,["openDel","usuario","permissions"]),f(U,{opAcessos:m.value,onCloseAcessos:C,usuario:l.value,permissions:r(x)},null,8,["opAcessos","usuario","permissions"])])]))}};export{fe as default};
