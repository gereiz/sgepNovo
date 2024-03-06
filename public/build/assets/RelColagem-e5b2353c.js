import{j as t,o as a,f as n,a as C,u as D,w as U,F as c,Z as L,b as e,k as r,x as u,l as m,t as d}from"./app-bd8ed453.js";import{_ as $}from"./AuthenticatedLayout-18cc19d3.js";import{u as A}from"./toastr-56ff4fca.js";import"./XMarkIcon-0fe4e5a0.js";import"./transition-a66b7804.js";const M={class:"w-full h-screen pt-24 pb-32 mx-2 md:mx-4"},P=e("div",{class:"w-full h-14 flex mb-2"},[e("div",{class:"sm:w-2/12 h-14 flex items-center"},[e("h1",{class:"titulo"},"Relatório de Colagem")])],-1),j={class:"card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md"},E={class:"card-body space-y-10"},F={class:"w-full flex flex-col flex-wrap md:flex-row"},G={class:"w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 sm:space-x-6"},H={class:"w-full sm:w-1/12 flex flex-col"},N=e("label",{for:"cliente"},"Ano",-1),O=e("option",{value:"0",disabled:"",selected:""},"Selecione",-1),Z=["value"],q={class:"w-full sm:w-3/12 flex flex-col"},z=e("label",{for:"cliente"},"Bi-semana",-1),J=["disabled"],K=e("option",{value:"0",disabled:"",selected:""},"Selecione",-1),Q=["value"],W={class:"w-full sm:w-5/12 flex flex-col"},X=e("label",{for:"cliente"},"Orientação",-1),Y=e("option",{value:"",disabled:"",selected:""},"Selecione",-1),ee=e("option",{value:"R"},"A4 - Retrato",-1),se=e("option",{value:"P"},"A4 - Paisagem",-1),le=[Y,ee,se],oe={class:"w-full sm:w-10/12 flex flex-wrap space-y-6 sm:space-y-0 sm:space-x-6"},te={class:"w-full sm:w-[20%] flex flex-col"},ae=e("label",{for:"cidade"},"Cidade",-1),ne=e("option",{value:"0",disabled:"",selected:""},"Todos",-1),ie=["value"],de={class:"w-full sm:w-[20%] flex flex-col"},ce=e("label",{for:"regiao"},"Região",-1),re=e("option",{value:"0",disabled:"",selected:""},"Todos",-1),ue=["value"],me={class:"w-full sm:w-[20%] flex flex-col"},fe=e("label",{for:"bairro"},"Bairro",-1),ve=e("option",{value:"0",disabled:"",selected:""},"Todos",-1),_e=["value"],pe={class:"w-full sm:w-4/12 flex flex-wrap sm:space-x-4 space-y-6 sm:space-y-0"},xe={class:"w-full sm:w-5/12 flex flex-col items-center sm:items-start justify-center"},ye={__name:"RelColagem",props:["anos","cidades"],setup(w){const h=w,B=A();t(h.clientes);const k=t(h.anos),v=t(""),b=t(""),g=t("");t(0);const _=t(0),f=t(0),p=t(0),x=t(0),R=t(0),y=t("P");function I(){axios.post("/setRelReservaCliente",{anoBs:_.value}).then(o=>{v.value=o.data}).catch(o=>{console.log(o)})}function S(){axios.post("/setRegioes",{cidId:p.value}).then(o=>{b.value=o.data}).catch(o=>{console.log(o)})}function V(){axios.post("/setBairros",{regId:x.value}).then(o=>{g.value=o.data,console.log(o.data)}).catch(o=>{console.log(o)})}function T(){let o=document.getElementById("gera_rel");f.value!=0?axios.post("/setRelColagem",{numBs:f.value}).then(l=>{axios.get("/getRelColagem").then(()=>{console.log(l.data),o.innerHTML="Carregando...",setTimeout(()=>{o.innerHTML="Gerar Relatório",window.open("/getRelColagem","_blank")},3e3)}).catch(s=>{console.log(s)})}).catch(l=>{console.log(l)}):B.error("É preciso escolhar uma Bi-semana!")}return(o,l)=>(a(),n(c,null,[C(D(L),{title:"Relatórios"}),C($,null,{default:U(()=>[e("div",M,[P,e("div",j,[e("div",E,[e("div",F,[e("div",G,[e("div",H,[N,r(e("select",{class:"select select-bordered w-full max-w-xs","onUpdate:modelValue":l[0]||(l[0]=s=>_.value=s),onChange:l[1]||(l[1]=s=>I())},[O,(a(!0),n(c,null,m(k.value,(s,i)=>(a(),n("option",{key:i,value:s.id},d(s.ano_bisemana),9,Z))),128))],544),[[u,_.value]])]),e("div",q,[z,r(e("select",{class:"select select-bordered w-full max-w-xs","onUpdate:modelValue":l[2]||(l[2]=s=>f.value=s),disabled:v.value.length===0},[K,(a(!0),n(c,null,m(v.value,(s,i)=>(a(),n("option",{key:i,value:s.id},"BS: "+d(s.num_bisemana)+" "+d(new Date(s.inicio).toLocaleDateString())+" até "+d(new Date(s.fim).toLocaleDateString()),9,Q))),128))],8,J),[[u,f.value]])]),e("div",W,[X,r(e("select",{"onUpdate:modelValue":l[3]||(l[3]=s=>y.value=s),class:"select select-bordered w-full max-w-xs",disabled:""},le,512),[[u,y.value]])])])]),e("div",oe,[e("div",te,[ae,r(e("select",{class:"select select-bordered w-full max-w-xs","onUpdate:modelValue":l[4]||(l[4]=s=>p.value=s),disabled:"",onChange:l[5]||(l[5]=s=>S())},[ne,(a(!0),n(c,null,m(w.cidades,(s,i)=>(a(),n("option",{key:i,value:s.id},d(s.nome),9,ie))),128))],544),[[u,p.value]])]),e("div",de,[ce,r(e("select",{class:"select select-bordered w-full max-w-xs","onUpdate:modelValue":l[6]||(l[6]=s=>x.value=s),disabled:"",onChange:l[7]||(l[7]=s=>V())},[re,(a(!0),n(c,null,m(b.value,(s,i)=>(a(),n("option",{key:i,value:s.id},d(s.nome),9,ue))),128))],544),[[u,x.value]])]),e("div",me,[fe,r(e("select",{class:"select select-bordered w-full max-w-xs","onUpdate:modelValue":l[8]||(l[8]=s=>R.value=s),disabled:""},[ve,(a(!0),n(c,null,m(g.value,(s,i)=>(a(),n("option",{key:i,value:s.id},d(s.nome),9,_e))),128))],512),[[u,R.value]])]),e("div",pe,[e("div",xe,[e("button",{id:"gera_rel",class:"botao-primario w-11/12 sm:w-fit sm:px-4 -ms-3.5 sm:-ms-0 mt-5",onClick:l[9]||(l[9]=s=>T())},"Gerar Relatório")])])])])])])]),_:1})],64))}};export{ye as default};
