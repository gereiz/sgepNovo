import{j as o,o as a,f as n,a as h,u as k,w as D,F as m,Z as V,b as e,k as f,x as v,l as w,t as c}from"./app-7f605639.js";import{_ as L}from"./AuthenticatedLayout-4c504047.js";import"./toastr-ee16744d.js";import"./toastr-6d337fc1.js";import"./XMarkIcon-0ae6a479.js";import"./transition-6db815fe.js";const $={class:"w-full h-screen pt-24 pb-32 mx-2 md:mx-4"},I=e("div",{class:"w-full h-14 flex mb-2"},[e("div",{class:"sm:w-2/12 h-14 flex items-center"},[e("h1",{class:"titulo"},"Reservas por Cliente")])],-1),U={class:"card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md"},A={class:"card-body space-y-10"},M={class:"w-full flex flex-col flex-wrap md:flex-row"},P={class:"w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 sm:space-x-6"},T={class:"w-full sm:w-[20%] flex flex-col"},j=e("label",{for:"cliente"},"Cliente",-1),E=e("option",{value:"0",disabled:"",selected:""},"Selecione",-1),F=["value"],G={class:"w-full sm:w-1/12 flex flex-col"},H=e("label",{for:"cliente"},"Ano",-1),N=e("option",{value:"0",disabled:"",selected:""},"Selecione",-1),z=["value"],O={class:"w-full sm:w-3/12 flex flex-col"},Z=e("label",{for:"cliente"},"Bi-semana",-1),q=["disabled"],J=e("option",{value:"0",disabled:"",selected:""},"Selecione",-1),K=["value"],Q={class:"w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 space-x-6"},W={class:"w-full sm:w-6/12 flex flex-wrap sm:space-x-4 space-y-6 sm:space-y-0"},X={class:"w-full sm:w-5/12 flex flex-col"},Y=e("label",{for:"cliente"},"Orientação",-1),ee=e("option",{value:"",disabled:"",selected:""},"Selecione",-1),se=e("option",{value:"R"},"A4 - Retrato",-1),le=e("option",{value:"P"},"A4 - Paisagem",-1),te=[ee,se,le],oe={class:"w-full sm:w-5/12 flex flex-col items-center sm:items-start justify-center"},ue={__name:"RelReservaCliente",props:["clientes","anos"],setup(b){const x=b,g=o(x.clientes),C=o(x.anos),_=o(""),d=o(0),r=o(0),u=o(0),p=o("P");function R(){axios.post("/setRelReservaCliente",{anoBs:r.value}).then(t=>{_.value=t.data}).catch(t=>{console.log(t)})}function y(){axios.post("/setCliente",{cliente:d.value}).then(t=>{console.log(t.data)}).catch(t=>{console.log(t)})}function B(){axios.post("/setBsCliente",{numBs:u.value}).then(t=>{console.log(t.data)}).catch(t=>{console.log(t)})}function S(){let t=document.getElementById("gera_rel");t.innerHTML="Carregando...",axios.post("/getRelReservaCliente",{cliente:d.value,ano:r.value,bisemana:u.value,orient:p.value}).then(l=>{setTimeout(()=>{t.innerHTML="Gerar Relatório",window.open("/getRelReservaCliente","_blank")},3e3)}).catch(l=>{console.log(l)})}return(t,l)=>(a(),n(m,null,[h(k(V),{title:"Relatórios"}),h(L,null,{default:D(()=>[e("div",$,[I,e("div",U,[e("div",A,[e("div",M,[e("div",P,[e("div",T,[j,f(e("select",{class:"select select-bordered w-full max-w-xs","onUpdate:modelValue":l[0]||(l[0]=s=>d.value=s),onChange:l[1]||(l[1]=s=>y())},[E,(a(!0),n(m,null,w(g.value,(s,i)=>(a(),n("option",{key:i,value:s.id},c(s.nome_fantasia?s.nome_fantasia:s.razao_social),9,F))),128))],544),[[v,d.value]])]),e("div",G,[H,f(e("select",{class:"select select-bordered w-full max-w-xs","onUpdate:modelValue":l[2]||(l[2]=s=>r.value=s),onChange:l[3]||(l[3]=s=>R())},[N,(a(!0),n(m,null,w(C.value,(s,i)=>(a(),n("option",{key:i,value:s.id},c(s.ano_bisemana),9,z))),128))],544),[[v,r.value]])]),e("div",O,[Z,f(e("select",{class:"select select-bordered w-full max-w-xs","onUpdate:modelValue":l[4]||(l[4]=s=>u.value=s),disabled:_.value.length===0,onChange:l[5]||(l[5]=s=>B())},[J,(a(!0),n(m,null,w(_.value,(s,i)=>(a(),n("option",{key:i,value:s.id},"BS: "+c(s.num_bisemana)+" "+c(new Date(s.inicio).toLocaleDateString())+" até "+c(new Date(s.fim).toLocaleDateString()),9,K))),128))],40,q),[[v,u.value]])])])]),e("div",Q,[e("div",W,[e("div",X,[Y,f(e("select",{"onUpdate:modelValue":l[6]||(l[6]=s=>p.value=s),class:"select select-bordered w-full max-w-xs",disabled:""},te,512),[[v,p.value]])]),e("div",oe,[e("button",{id:"gera_rel",class:"botao-primario w-11/12 sm:w-fit sm:px-4 -ms-3.5 sm:-ms-0 mt-5",onClick:l[7]||(l[7]=s=>S())},"Gerar Relatório")])])])])])])]),_:1})],64))}};export{ue as default};
