import v from"./EditFuncao-53e673d8.js";import b from"./DelFuncao-4a5ac46b.js";import{j as n,o,f as t,b as e,F as g,p as y,a as u,d as k,t as _,g as p}from"./app-b52412a9.js";import"./FormEditFuncao-486eafdf.js";import"./toastr-e4fe5257.js";import"./toastr-dc695ffc.js";/* empty css                   */import"./functions-2590a097.js";import"./html2pdf-8576d365.js";import"./ClipboardDocumentCheckIcon-1891d3b7.js";import"./transition-97454304.js";const E="/build/assets/funcao-e98a7771.png",C={class:"card w-full h-[28rem] sm:h-[40rem] bg-base-100 border border-base-200 shadow-xl overflow-auto rounded-md"},j={class:"card-body flex flex-col sm:flex-row"},D={class:"w-full flex flex-col flex-wrap md:flex-row"},F=["id"],N=["id"],V={class:"w-full flex-col sm:flex sm:flex-wrap"},$={class:"w-full flex justify-center"},B=e("div",{class:"w-4/12"},[e("img",{class:"w-[5rem] h-[5rem] hover:scale-150 transition-all duration-1000 rounded-md",src:E,alt:"Foto-painel"})],-1),S={class:"w-6/12"},z={class:"text-xs sm:text-xl font-extrabold"},G=e("span",{class:"text-red-500"},"Função:",-1),L={class:"w-full flex flex-wrap sm:flex-nowrap justify-center my-2 sm:-ml-2 space-x-2"},T={class:"w-full"},q={class:"sm:flex flex-wrap"},A={class:"w-full flex flex-col items-center space-y-3 mt-4"},H={class:"text-xs sm:text-base"},I={class:"w-full flex items-center justify-around mt-4 space-x-2"},J=["onClick"],K=["onClick"],oe={__name:"GridFuncao",props:["funcoes"],setup(x){const h=n(x.funcoes),l=n(""),r=n(!1),d=n(!1);function c(a,i){a==="t"?(l.value=i,r.value=!0):(r.value=!1,window.location.reload())}function m(a,i){a==="t"?(l.value=i,d.value=!0):(d.value=!1,window.location.reload())}return(a,i)=>(o(),t("div",C,[e("div",j,[e("div",D,[(o(!0),t(g,null,y(h.value,(s,f)=>(o(),t("div",{key:f,id:s.id,class:"card w-full sm:w-[24%] h-[18rem] bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4 hover:scale-[1.1] hover:z-50 transition-all duration-500"},[e("div",{class:"card-body flex",id:f},[e("div",V,[e("div",$,[B,e("div",S,[e("p",z,[G,k(" "+_(s.cargo),1)])])]),e("div",L,[e("div",T,[e("div",q,[e("div",A,[e("p",H,_(s.descricao),1)]),e("div",I,[s.id!==1?(o(),t("label",{key:0,class:"inline-flex w-6/12 justify-center rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-amber-300 sm:mt-0 sm:w-5/12",onClick:w=>c("t",s)},"Editar",8,J)):p("",!0),s.id!==1?(o(),t("label",{key:1,class:"inline-flex w-6/12 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-300 sm:ml-3 sm:w-5/12",onClick:w=>m("t",s)},"Excluir",8,K)):p("",!0)])])])])])],8,N)],8,F))),128))]),u(v,{openEdit:r.value,onCloseEdit:c,funcao:l.value},null,8,["openEdit","funcao"]),u(b,{openDel:d.value,onCloseDel:m,funcao:l.value},null,8,["openDel","funcao"])])]))}};export{oe as default};