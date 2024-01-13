import{j as d,h as b,o as i,f as a,a as c,u as g,w as y,F as _,Z as P,b as e,t as n,k as j,v as k,l as C}from"./app-2a6efd20.js";import{_ as B,a as E}from"./painel_conv-45a82d16.js";import{_ as F}from"./AuthenticatedLayout-0dccdab5.js";import"./toastr.min-78168abc.js";import N from"./AddPainel-4fb05b18.js";import"./XMarkIcon-7a5bbd58.js";import"./transition-59246d05.js";import"./StepOnePainel-908b42a1.js";import"./toastr-b40820a6.js";import"./StepTwoPainel-c2e50072.js";import"./CheckIcon-5a884784.js";const q={class:"w-full h-screen pt-10 sm:pt-4 pb-32 mx-2 sm:mx-4"},A={class:"w-full h-14 flex mb-2 pe-3 sm:pe-0"},L={class:"w-2/12 h-14 flex items-center"},$=e("h1",{class:"text-xl sm:text-4xl font-bold"},"Painéis",-1),V={class:"text-lg sm:text-2xl text-red-400 font-bold ml-2 sm:ml-4"},D={class:"w-10/12 flex justify-end"},I={class:"w-full sm:w-4/12"},O={class:"card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md"},S={class:"card-body"},M={class:"w-full flex flex-col flex-wrap sm:flex-row justify-center"},R={for:"modal-cliente"},T={class:"card-body"},U={class:"flex justify-between"},Z={key:0,class:"w-10 ms-4 sm:w-14 sm:hover:w-20 transition-all duration-500",src:B,alt:"Painel Nobre",title:"Painel Nobre"},z={key:1,class:"w-10 ms-4 sm:w-14 sm:hover:w-20 transition-all duration-500",src:E,alt:"Painel Convêncional",title:"Painel Convêncional"},G={class:"text-xs sm:card-title text-red-500"},H={class:"w-full flex flex-col items-center"},J={class:"w-full mb-4 -ml-4"},K=["src"],Q={class:"w-full sm:w-11/12 flex justify-center flex-wrap mb-4"},W={class:"w-full flex justify-between sm:justify-between"},X={class:"text-xs sm:card-title"},Y={class:"text-xs sm:card-title"},ee={class:"w-full sm:w-11/12 flex justify-center flex-wrap space-x-2 mb-4"},se=["onClick"],te=e("button",{class:"botao bg-red-700"},"Excluir",-1),pe={__name:"ListaPaineis",props:["paineis"],setup(m){const p=m,r=d(""),l=d(!1),u=d({});function f(o){o==="t"?l.value=!0:l.value=!1}function h(o,t){axios.post("/EditPainel",{idPainel:t}).then(s=>{u.value=s.data}).catch(s=>{console.error(s)}),o==="t"?l.value=!0:l.value=!1}const x=b(()=>Object.values(p.paineis).filter(t=>String(t.bairro.nome).toLowerCase().indexOf(r.value.toLowerCase())>-1));function v(o){var t="http://localhost:8000/storage/"+o,t="/storage/"+o;return t}return(o,t)=>(i(),a(_,null,[c(g(P),{title:"Painéis"}),c(F,null,{default:y(()=>[e("div",q,[e("div",A,[e("div",L,[$,e("h1",V,n(m.paineis.length),1)]),e("div",D,[e("label",{for:"modal-cliente-add",class:"w-28 botao-modal text-sm",onClick:t[0]||(t[0]=s=>f("t"))},"+ Novo Painel")])]),e("div",I,[j(e("input",{"onUpdate:modelValue":t[1]||(t[1]=s=>r.value=s),placeholder:"Pesquisar Painel",class:"w-full h-10 input input-bordered rounded-none mb-4",type:"text",name:"pesquisar",id:"pesquisar"},null,512),[[k,r.value]])]),e("div",O,[e("div",S,[e("div",M,[(i(!0),a(_,null,C(x.value,(s,w)=>(i(),a("div",{key:w,class:"card w-full sm:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4"},[e("label",R,[e("div",T,[e("div",U,[s.tipo==="1"?(i(),a("img",Z)):(i(),a("img",z)),e("h2",G,"Identificação.: "+n(s.identificacao),1)]),e("div",H,[e("div",J,[e("img",{class:"img-painel",src:v(s.image_url),alt:"Bairro"},null,8,K)]),e("div",Q,[e("div",W,[e("h2",X,"Região: "+n(s.bairro.regiao.nome),1),e("h2",Y,"Bairro: "+n(s.bairro.nome),1)])]),e("div",ee,[e("button",{class:"botao bg-yellow-700",onClick:oe=>h("t",s.id)},"Editar",8,se),te])])])])]))),128))])])]),c(N,{openAdd:l.value,onCloseAdd:f,painel:u.value},null,8,["openAdd","painel"])])]),_:1})],64))}};export{pe as default};
