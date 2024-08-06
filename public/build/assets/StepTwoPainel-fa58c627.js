import{o as p,f as x,b as e,j as b,T as w,x as h,m as r,v as c,u as n,y as v,a as k}from"./app-4ff54ba4.js";import{u as I}from"./toastr-9d5d101a.js";import"./toastr-e1375ee3.js";/* empty css                   */function B(l,m){return p(),x("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon"},[e("path",{"fill-rule":"evenodd",d:"M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z","clip-rule":"evenodd"})])}const T={class:"w-full flex flex-col items-center justify-center space-y-8"},V=e("p",{class:"mt-3 text-sm leading-6 text-gray-600"},"Preencha os dados técnicos do Painel.",-1),E={class:"w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0"},L={class:"w-full sm:w-3/12"},P=e("label",{for:"ident",class:"block text-sm font-medium leading-6 text-gray-900"},"Identificação",-1),S={class:"mt-2"},M=["disabled"],O={class:"w-full sm:w-3/12"},j=e("label",{for:"ident_ant",class:"block text-sm font-medium leading-6 text-gray-900"},"Ident. Antiga",-1),A={class:"mt-2"},C=["disabled"],U={class:"w-full sm:w-4/12"},D=e("label",{for:"cadan",class:"block text-sm font-medium leading-6 text-gray-900"},"Cadan",-1),N={class:"mt-2"},H={class:"w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0"},Z={class:"w-full sm:w-2/12"},q=e("label",{for:"dimensao",class:"block text-sm font-medium leading-6 text-gray-900"},"Dimensão",-1),G={class:"mt-2"},$=["disabled"],F={class:"w-full sm:w-2/12"},J=e("label",{for:"dim_lona",class:"block text-sm font-medium leading-6 text-gray-900"},"Dimensão Lona",-1),z={class:"mt-2"},K={class:"w-full sm:w-2/12"},Q=e("label",{for:"posicao",class:"block text-sm font-medium leading-6 text-gray-900"},"Posição",-1),R={class:"mt-2"},W={class:"w-full sm:w-3/12"},X=e("label",{for:"tipo",class:"block text-sm font-medium leading-6 text-gray-900"},"Tipo",-1),Y={class:"mt-2"},ee=["disabled"],te=e("option",{value:"0",disabled:"",selected:""},"Selecione",-1),se=e("option",{value:"1"},"Nobre",-1),ie=e("option",{value:"2"},"Convencional",-1),oe=[te,se,ie],ne={class:"w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0"},le={class:"w-full sm:w-10/12"},ae=e("label",{for:"cover-photo",class:"block text-sm font-medium leading-6 text-gray-900"},"Imagem do Painel",-1),de={class:"mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"},re={class:"text-center"},ce={class:"mt-4 flex text-sm leading-6 text-gray-600"},me={for:"file-upload",class:"relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"},ue=e("span",null,"Selecione um arquivo",-1),ge=["disabled"],fe=e("p",{class:"pl-1"},"ou arraste e solte aqui",-1),pe=e("p",{class:"text-xs leading-5 text-gray-600"},"PNG, JPG. Máx.: 10MB",-1),xe={class:"mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4"},he={__name:"StepTwoPainel",props:["painel","user"],emits:["step1","formOne"],setup(l,{emit:m}){const u=l,g=m,a=I(),d=b(u.painel),t=w({ident:null,ident_ant:null,cadan:null,dim:null,dimLona:null,posicao:null,tipo:null,imagem:null,idPainel:null});h(()=>{u.painel.value!={}&&(t.idPainel=d.value[0].id,t.ident=d.value[0].identificacao,t.ident_ant=d.value[0].ident_antiga,t.cadan=d.value[0].cadan,t.dim=d.value[0].dimensao,t.dimLona=d.value[0].dimensao_lona,t.posicao=d.value[0].posicao,t.tipo=d.value[0].tipo)});function f(i){let s=document.getElementById("btnSendTwo");s.innerHTML="Carregando...",setTimeout(()=>{g("step2",i),s.innerHTML="Avançar"},1e3)}function y(){t.ident!=null&&t.ident_ant!=null&&t.cadan!=null&&t.posicao!=null&&t.tipo!=null&&t.imagem!=null&&g("formTwo",t)}function _(){if(t.ident==null){let i=document.getElementById("ident");a.error("O campo Identificação é obrigatório!"),i.focus()}else if(t.ident_ant==null){let i=document.getElementById("ident_ant");a.error("O campo Ident. Antiga é obrigatório!"),i.focus()}else if(t.cadan==null){let i=document.getElementById("cadan");a.error("O campo Cadan é obrigatório!"),i.focus()}else if(t.dim==null){let i=document.getElementById("dimensao");a.error("O campo Dimensão é obrigatório!"),i.focus()}else if(t.dimLona==null){let i=document.getElementById("dim_lona");a.error("O campo Dimensão Lona é obrigatório!"),i.focus()}else if(t.posicao==null){let i=document.getElementById("posicao");a.error("O campo Posição é obrigatório!"),i.focus()}else if(t.tipo==null){let i=document.getElementById("tipo");a.error("O campo Tipo é obrigatório!"),i.focus()}else if(t.imagem==null){let i=document.getElementById("imagem");a.error("O campo Imagem é obrigatório!"),i.focus()}else f(4)}return(i,s)=>(p(),x("div",T,[V,e("div",E,[e("div",L,[P,e("div",S,[r(e("input",{type:"number",name:"ident",id:"ident","onUpdate:modelValue":s[0]||(s[0]=o=>n(t).ident=o),disabled:l.user.id!==1&&l.user.id!==1,class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"},null,8,M),[[c,n(t).ident]])])]),e("div",O,[j,e("div",A,[r(e("input",{type:"text",name:"ident_ant",id:"ident_ant","onUpdate:modelValue":s[1]||(s[1]=o=>n(t).ident_ant=o),disabled:l.user.id!==1&&l.user.id!==1,class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"},null,8,C),[[c,n(t).ident_ant]])])]),e("div",U,[D,e("div",N,[r(e("input",{type:"text",name:"cadan",id:"cadan","onUpdate:modelValue":s[2]||(s[2]=o=>n(t).cadan=o),class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"},null,512),[[c,n(t).cadan]])])])]),e("div",H,[e("div",Z,[q,e("div",G,[r(e("input",{type:"text",name:"dimensao",id:"dimensao","onUpdate:modelValue":s[3]||(s[3]=o=>n(t).dim=o),disabled:l.user.id!==1&&l.user.id!==1,class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"},null,8,$),[[c,n(t).dim]])])]),e("div",F,[J,e("div",z,[r(e("input",{type:"text",name:"dim_lona",id:"dim_lona","onUpdate:modelValue":s[4]||(s[4]=o=>n(t).dimLona=o),class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"},null,512),[[c,n(t).dimLona]])])]),e("div",K,[Q,e("div",R,[r(e("input",{type:"text",name:"posicao",id:"posicao","onUpdate:modelValue":s[5]||(s[5]=o=>n(t).posicao=o),class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"},null,512),[[c,n(t).posicao]])])]),e("div",W,[X,e("div",Y,[r(e("select",{id:"tipo",name:"tipo","onUpdate:modelValue":s[6]||(s[6]=o=>n(t).tipo=o),disabled:l.user.id!==1&&l.user.id!==1,class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"},oe,8,ee),[[v,n(t).tipo]])])])]),e("div",ne,[e("div",le,[ae,e("div",de,[e("div",re,[k(n(B),{class:"mx-auto h-12 w-12 text-gray-300","aria-hidden":"true"}),e("div",ce,[e("label",me,[ue,e("input",{id:"file-upload",name:"file-upload",type:"file",class:"sr-only",onInput:s[7]||(s[7]=o=>n(t).imagem=o.target.files[0]),disabled:l.user.id!==1&&l.user.id!==1},null,40,ge)]),fe]),pe])])])]),e("div",xe,[e("label",{class:"mt-3 inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12",onClick:s[8]||(s[8]=o=>f(1))},"Voltar"),e("label",{id:"btnSendTwo",class:"inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12",onClick:s[9]||(s[9]=o=>(_(),y()))},"Avançar")])]))}};export{he as default};
