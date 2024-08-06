import{j as o,o as a,f as n,a as h,u as k,w as D,F as m,Z as V,b as e,m as f,y as v,p as w,t as c}from"./app-4ff54ba4.js";import{_ as L}from"./AuthenticatedLayout-7afe2a2c.js";import"./toastr-e1375ee3.js";/* empty css                   *//* empty css              */import"./transition-a4c308ad.js";import"./XMarkIcon-b547c669.js";import"./toastr-9d5d101a.js";const $={class:"w-full h-screen pt-24 pb-32 mx-2 md:mx-4"},I=e("div",{class:"w-full h-14 flex mb-2"},[e("div",{class:"sm:w-2/12 h-14 flex items-center"},[e("h1",{class:"titulo"},"Reservas por Cliente")])],-1),U={class:"card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md"},A={class:"card-body space-y-10"},M={class:"w-full flex flex-col flex-wrap md:flex-row"},P={class:"w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 sm:space-x-6"},T={class:"w-full sm:w-[20%] flex flex-col"},j=e("label",{for:"cliente"},"Cliente",-1),E=e("option",{value:"0",disabled:"",selected:""},"Selecione",-1),F=["value"],G={class:"w-full sm:w-1/12 flex flex-col"},H=e("label",{for:"cliente"},"Ano",-1),N=e("option",{value:"0",disabled:"",selected:""},"Selecione",-1),z=["value"],O={class:"w-full sm:w-3/12 flex flex-col"},Z=e("label",{for:"cliente"},"Bi-semana",-1),q=["disabled"],J=e("option",{value:"0",disabled:"",selected:""},"Selecione",-1),K=["value"],Q={class:"w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 space-x-6"},W={class:"w-full sm:w-6/12 flex flex-wrap sm:space-x-4 space-y-6 sm:space-y-0"},X={class:"w-full sm:w-5/12 flex flex-col"},Y=e("label",{for:"cliente"},"Orientação",-1),ee=e("option",{value:"",disabled:"",selected:""},"Selecione",-1),se=e("option",{value:"R"},"A4 - Retrato",-1),te=e("option",{value:"P"},"A4 - Paisagem",-1),le=[ee,se,te],oe={class:"w-full sm:w-5/12 flex flex-col items-center sm:items-start justify-center"},fe={__name:"RelReservaCliente",props:["clientes","anos"],setup(b){const x=b,g=o(x.clientes),C=o(x.anos),_=o(""),d=o(0),r=o(0),u=o(0),p=o("P");function R(){axios.post("/setRelReservaCliente",{anoBs:r.value}).then(l=>{_.value=l.data}).catch(l=>{console.log(l)})}function y(){axios.post("/setCliente",{cliente:d.value}).then(l=>{}).catch(l=>{console.log(l)})}function B(){axios.post("/setBsCliente",{numBs:u.value}).then(l=>{}).catch(l=>{console.log(l)})}function S(){let l=document.getElementById("gera_rel");l.innerHTML="Carregando...",axios.post("/getRelReservaCliente",{cliente:d.value,ano:r.value,bisemana:u.value,orient:p.value}).then(t=>{setTimeout(()=>{l.innerHTML="Gerar Relatório",window.open("/getRelReservaCliente","_blank")},3e3)}).catch(t=>{console.log(t)})}return(l,t)=>(a(),n(m,null,[h(k(V),{title:"Relatórios"}),h(L,null,{default:D(()=>[e("div",$,[I,e("div",U,[e("div",A,[e("div",M,[e("div",P,[e("div",T,[j,f(e("select",{class:"select select-bordered w-full max-w-xs","onUpdate:modelValue":t[0]||(t[0]=s=>d.value=s),onChange:t[1]||(t[1]=s=>y())},[E,(a(!0),n(m,null,w(g.value,(s,i)=>(a(),n("option",{key:i,value:s.id},c(s.nome_fantasia?s.nome_fantasia:s.razao_social),9,F))),128))],544),[[v,d.value]])]),e("div",G,[H,f(e("select",{class:"select select-bordered w-full max-w-xs","onUpdate:modelValue":t[2]||(t[2]=s=>r.value=s),onChange:t[3]||(t[3]=s=>R())},[N,(a(!0),n(m,null,w(C.value,(s,i)=>(a(),n("option",{key:i,value:s.id},c(s.ano_bisemana),9,z))),128))],544),[[v,r.value]])]),e("div",O,[Z,f(e("select",{class:"select select-bordered w-full max-w-xs","onUpdate:modelValue":t[4]||(t[4]=s=>u.value=s),disabled:_.value.length===0,onChange:t[5]||(t[5]=s=>B())},[J,(a(!0),n(m,null,w(_.value,(s,i)=>(a(),n("option",{key:i,value:s.id},"BS: "+c(s.num_bisemana)+" "+c(new Date(s.inicio).toLocaleDateString())+" até "+c(new Date(s.fim).toLocaleDateString()),9,K))),128))],40,q),[[v,u.value]])])])]),e("div",Q,[e("div",W,[e("div",X,[Y,f(e("select",{"onUpdate:modelValue":t[6]||(t[6]=s=>p.value=s),class:"select select-bordered w-full max-w-xs",disabled:""},le,512),[[v,p.value]])]),e("div",oe,[e("button",{id:"gera_rel",class:"botao-primario w-11/12 sm:w-fit sm:px-4 -ms-3.5 sm:-ms-0 mt-5",onClick:t[7]||(t[7]=s=>S())},"Gerar Relatório")])])])])])])]),_:1})],64))}};export{fe as default};
