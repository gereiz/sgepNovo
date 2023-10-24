import{j as r,p as M,o as i,f as n,a as y,u as v,w as T,F as p,Z as U,b as e,d as x,t as c,k as b,q as P,A as S,l as w,g as E,v as F}from"./app-c0191d23.js";import{_ as q}from"./AuthenticatedLayout-349afb90.js";import Z from"./ModalAddPainCli-7fafa32a.js";import{u as H}from"./toastr-d9b552d4.js";import"./_plugin-vue_export-helper-c27b6911.js";import"./vue-multiselect.esm-ea8fb716.js";import"./toastr.min-5509ae66.js";const J={class:"w-full h-screen pt-24 pb-32 mx-2 md:mx-4"},K={class:"w-full h-14 flex mb-2"},Q={class:"w-2/12 h-14 flex items-center"},W=e("h1",{class:"titulo"},"Reservas por Cliente ",-1),X={class:"text-red-500 font-bold ml-2"},Y={class:"w-full flex flex-row flex-wrap items-center justify-center mb-20 sm:mb-0"},ee={class:"w-full flex items-center sm:justify-center flex-wrap"},se={class:"w-[30%] sm:w-[8%] flex flex-col me-4 sm:me-6"},ae=e("label",{for:"bi-semana"},"Ano",-1),te=e("option",{value:"0",selected:""},"Selecione",-1),le=["value"],oe={class:"w-[61%] sm:w-[20%] flex flex-col me-4 sm:me-6"},ie=e("label",{for:"bi-semana"},"Bi-Semana",-1),ne=e("option",{value:"0",selected:""},"Selecione",-1),ce=["value"],de={class:"w-full sm:w-[20%] flex flex-col me-4 sm:me-6"},re=e("label",{for:"status"},"Cliente",-1),ue=["disabled"],me=e("option",{value:"0",selected:""},"Selecione",-1),fe=["value"],ve={class:"w-full sm:w-[20%] flex mt-2 space-x-4"},_e={key:1,for:"modal-canc-res-cli",class:"w-fit botao-danger px-2 transition-all duration-1000"},he={class:"card w-full h-full max-h-[97%] bg-base-100 shadow-xl overflow-auto rounded-md"},pe={class:"card-body flex flex-col sm:flex-row"},xe={class:"w-full flex flex-col flex-wrap md:flex-row"},be=["id","onClick"],we={class:"w-full -mt-6 flex justify-end"},ge={class:"w-full flex"},ke={class:"w-5/12 mb-4 -ml-6 -mt-4"},Ce=["src"],ye={class:"w-7/12 mb-4 ml-4 -mt-4 space-y-2"},Pe=e("span",{class:"font-bold text-sm text-red-500"},"Painel: ",-1),Se={class:"font-extrabold text-xs"},Be=e("br",null,null,-1),Re=e("span",{class:"font-bold text-sm text-red-500"},"Campanha: ",-1),Ve={class:"font-extrabold text-xs"},je=e("br",null,null,-1),De=e("span",{class:"font-bold text-sm text-red-500"},"Obs.: ",-1),$e={class:"font-extrabold text-xs"},Ae=e("input",{type:"checkbox",id:"modal-canc-res-cli",class:"modal-toggle"},null,-1),Ee={class:"modal flex items-end md:items-center"},Ie={method:"dialog",class:"modal-box bg-white"},Oe={class:"font-black text-2xl animate-pulse duration-200 text-center mb-2"},ze=e("h3",{class:"font-black text-2xl text-red-700 animate-pulse duration-200 text-center"},"ATENÇÃO!",-1),Ge=e("p",{class:"py-4"},"Ao cancelar esta reserva, o painel ficará disponível na Bi-semana selecionada, e poderá ser reservado imadiatamente.",-1),Ne=e("p",{class:"py-4 text-center"},"Confirme somente se tiver certeza do cancelamento!",-1),Le=e("label",{for:"paineis-del"},"Painéis Selecionados",-1),Me={class:"modal-action"},Te={class:"w-full flex justify-center space-x-4"},Ue=e("label",{for:"modal-canc-res-cli",class:"w-5/12 text-sm botao-modal bg-gray-700 hover:bg-gray-500"},"Manter Painéis",-1),Xe={__name:"ReservaPaineisCli",props:["ambiente","clientes","anos","bisemanas","paineis"],setup(g){const B=g,_=r(B.paineis),R=H(),m=r([]),k=r([]),u=r([]);let f=M([]);const h=r([]),V=r(0),C=r(0);let l=r(0),j=r("");const d=r(0);function D(t){t.forEach(s=>{f.push("Painel: "+s.identificacao+"; End: "+s.logradouro+" - "+s.numero+"; Ref: "+s.ponto_referencia+" - id:   "+s.id)})}function I(t){l.value=0,axios.post("/GetPaineisCli",{bsId:d.value,cliente:l.value}).then(s=>{m.value=s.data.reservas,_.value=s.data.paineis,f.length=0,f.length==0&&D(_.value)})}function $(){u.value=[],h.value=[],k.value.forEach(s=>{s.checked=!1})}function O(t,s,a){const o=k.value[t];o.classList,Object.values(u.value).includes(s)?(u.value.splice(u.value.indexOf(s),1),h.value.splice(u.value.indexOf(a),1),o.checked=!1):(u.value.push(s),h.value.push(a),o.checked=!0)}function z(t){if(B.ambiente=="local")var s="http://localhost:8000/storage/"+t;else var s="/storage/"+t;return s}function G(){axios.post("/GetBisemanas",{bisemana:C.value}).then(t=>{V.value=Object.values(t.data),d.value=0,m.value=[]})}function N(t){axios.post("/GetPaineisCli",{bsId:t,cliente:l.value}).then(s=>{m.value=s.data.reservas,_.value=s.data.paineis,f.length=0,f.length==0&&D(_.value)})}function A(t){axios.post("/GetPaineisCli",{bsId:t,cliente:l.value}).then(s=>{m.value=s.data.reservas,_.value=s.data.paineis}),axios.post("/GetCliente",{cliente:l}).then(s=>{j.value=s.data})}function L(){axios.post("/DelResCliente",{paineisId:h.value,bs:d.value}).then(t=>{A(d.value),t.data.cod===0?R.error(t.data.msg):t.data.cod==1&&R.success(t.data.msg)})}return(t,s)=>(i(),n(p,null,[y(v(U),{title:"Painéis"}),y(q,null,{default:T(()=>[e("div",J,[e("div",K,[e("div",Q,[W,x(),e("p",X,c(m.value.length),1)])]),e("div",Y,[e("div",ee,[e("div",se,[ae,b(e("select",{class:"select-paineis",name:"ano",id:"ano","onUpdate:modelValue":s[0]||(s[0]=a=>C.value=a),onChange:s[1]||(s[1]=a=>(S(l)?l.value=0:l=0,G()))},[te,(i(!0),n(p,null,w(g.anos,(a,o)=>(i(),n("option",{key:o,value:a.id},c(a.ano_bisemana),9,le))),128))],544),[[P,C.value]])]),e("div",oe,[ie,b(e("select",{class:"select-paineis",name:"bi-semana",id:"bi-semama","onUpdate:modelValue":s[2]||(s[2]=a=>d.value=a),onChange:s[3]||(s[3]=a=>(S(l)?l.value=0:l=0,N(d.value)))},[ne,(i(!0),n(p,null,w(V.value,(a,o)=>(i(),n("option",{key:o,value:a.id},"BS: "+c(a.num_bisemana)+" "+c(new Date(a.inicio).toLocaleDateString())+" até "+c(new Date(a.fim).toLocaleDateString()),9,ce))),128))],544),[[P,d.value]])]),e("div",de,[re,b(e("select",{class:"select-paineis",name:"cliente",id:"cliente","onUpdate:modelValue":s[4]||(s[4]=a=>S(l)?l.value=a:l=a),disabled:d.value==0,onChange:s[5]||(s[5]=a=>(A(d.value),$()))},[me,(i(!0),n(p,null,w(g.clientes,(a,o)=>(i(),n("option",{value:a.id,key:o},c(a.nome_fantasia?a.nome_fantasia:a.razao_social),9,fe))),128))],40,ue),[[P,v(l)]])]),e("div",ve,[v(l)!=0?(i(),n("label",{key:0,onClick:s[6]||(s[6]=a=>$()),for:"modal-add-painel",class:"w-fit botao-modal px-2 transition-all duration-1000"},"Incluir painéis")):E("",!0),v(l)!=0&&u.value.length>0?(i(),n("label",_e,"Excluir Selecionados")):E("",!0)])])]),e("div",he,[e("div",pe,[e("div",xe,[(i(!0),n(p,null,w(m.value,(a,o)=>(i(),n("div",{key:o,class:"card w-full sm:w-[30%] card-reserva-cliente"},[e("div",{class:"card-body flex",id:o,onClick:Fe=>O(o,a.identificacao,a.id)},[e("div",we,[e("input",{type:"checkbox",ref_for:!0,ref_key:"itemRefs",ref:k,class:"border-0 checkbox checkbox-success"},null,512)]),e("div",ge,[e("div",ke,[e("img",{class:"w-36 h-24",src:z(a.image_url),alt:"Foto-painel"},null,8,Ce)]),e("div",ye,[Pe,e("span",Se,c(a.identificacao)+" - "+c(a.nome_fantasia?a.nome_fantasia:a.razao_social),1),Be,Re,x(),e("span",Ve,c(a.campanha),1),x(),je,De,x(),e("span",$e,c(a.obs),1)])])],8,be)]))),128))])])]),y(Z,{clienteSel:v(j),idents:v(f),idBisemana:d.value,onAtualizaPage:I},null,8,["clienteSel","idents","idBisemana"]),Ae,e("div",Ee,[e("form",Ie,[e("h3",Oe,"Cancelar Reserva: Painéis "+c(h.value),1),ze,Ge,Ne,Le,b(e("textarea",{class:"w-full input input-bordered",type:"text",name:"paineis-del",id:"paineis-del","onUpdate:modelValue":s[7]||(s[7]=a=>u.value=a),disabled:""},null,512),[[F,u.value]]),e("div",Me,[e("div",Te,[e("label",{onClick:s[8]||(s[8]=a=>L()),for:"modal-canc-res-cli",class:"w-5/12 text-sm botao-modal bg-red-700 hover:bg-red-500"},"Cancelar Painéis"),Ue])])])])])]),_:1})],64))}};export{Xe as default};
