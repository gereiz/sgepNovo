import{o as b,f as k,b as e,j as n,m as A,c as q,w as v,a as i,u as o,d as O,k as L,v as R,z as J,q as K,h as Q,g as W,F as B,l as X,t as $,y as Y}from"./app-24751841.js";import{_ as Z,a as ee}from"./painel_conv-45a82d16.js";import{_ as se}from"./regiao-35565801.js";import{a as te}from"./functions-53da8c2b.js";import{s as ae}from"./vue-multiselect.esm-5554fb17.js";import{t as z}from"./toastr-57c3d31e.js";import{r as F}from"./ClipboardDocumentCheckIcon-be9d1d85.js";import{U as N,h as j,G as U,V as S,S as D}from"./transition-1838954b.js";import"./toastr-768a2c03.js";function M(p,m){return b(),k("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},[e("path",{"fill-rule":"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z","clip-rule":"evenodd"})])}const oe=e("div",{class:"fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"},null,-1),le={class:"fixed inset-0 z-10 overflow-y-auto"},ne={class:"flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"},ie={class:"mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"},re={class:"mt-3 text-center sm:mt-5 space-y-4"},ce=e("span",{class:"text-red-500 font-extrabold"},null,-1),de={class:"w-full flex flex-col items-center justify-end"},me={class:"w-11/12 flex flex-col flex-wrap"},ue=e("label",{for:"campanha",class:"block text-sm font-medium leading-6 text-gray-900"},[O("Inclua o Título da Campanha. "),e("span",{class:"text-red-500 italic"}," (Obrigatório) ")],-1),fe={class:"w-full flex flex-col items-center justify-end"},ve={class:"w-11/12 flex flex-col flex-wrap"},pe=e("label",{for:"obsevacoes",class:"block text-sm font-medium leading-6 text-gray-900"},[O("Inclua observações sobre a reseva. "),e("span",{class:"text-red-500 italic"}," (opcional) ")],-1),he={class:"w-full mt-2"},xe={class:"mt-5 sm:mt-6 w-full space-y-4 space-x-2 border-t border-gray-200 pt-4"},ge={__name:"ConfirmaReserva",props:["open"],emits:["campanha","obsevacoes","closeObs"],setup(p,{emit:m}){const w=p,r=n(""),h=n(""),u=n(!1);A(()=>w.open,y=>{y===!0&&(u.value=!0)});function x(){r.value="",h.value="",m("campanha",r.value),m("observacoes",h.value)}function _(){u.value=!1,m("closeObs",u.value)}function C(){m("campanha",r.value),m("observacoes",h.value),_()}return(y,a)=>(b(),q(o(D),{as:"template",show:u.value},{default:v(()=>[i(o(N),{as:"div",class:"relative z-10"},{default:v(()=>[i(o(j),{as:"template",enter:"ease-out duration-300","enter-from":"opacity-0","enter-to":"opacity-100",leave:"ease-in duration-200","leave-from":"opacity-100","leave-to":"opacity-0"},{default:v(()=>[oe]),_:1}),e("div",le,[e("div",ne,[i(o(j),{as:"template",enter:"ease-out duration-300","enter-from":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95","enter-to":"opacity-100 translate-y-0 sm:scale-100",leave:"ease-in duration-200","leave-from":"opacity-100 translate-y-0 sm:scale-100","leave-to":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"},{default:v(()=>[i(o(U),{class:"relative transform overflow-hidden rounded-lg bg-white w-full sm:w-[42.5%] sm:p-6 sm:ml-[15%] sm:my-4 pb-4 pt-5 text-left shadow-xl transition-all"},{default:v(()=>[e("div",null,[e("div",ie,[i(o(F),{class:"h-6 w-6 text-green-600","aria-hidden":"true"})]),e("div",re,[i(o(S),{as:"h3",class:"text-base font-semibold leading-6 text-gray-900"},{default:v(()=>[O(" Informe a Campanha e Observações sobre a reserva. "),ce]),_:1}),e("div",de,[e("div",me,[ue,L(e("input",{type:"text","onUpdate:modelValue":a[0]||(a[0]=f=>r.value=f),name:"campanha",id:"campanha",class:"block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",placeholder:"Pesquisar Painel"},null,512),[[R,r.value]])])]),e("div",fe,[e("div",ve,[pe,e("div",he,[L(e("textarea",{rows:"4",name:"obsevacoes",id:"obsevacoes","onUpdate:modelValue":a[1]||(a[1]=f=>h.value=f),class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"},null,512),[[R,h.value]])])])]),e("div",xe,[e("label",{class:"mt-3 inline-flex w-5/12 justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12",onClick:a[2]||(a[2]=f=>(_(),x()))}," Cancelar "),e("label",{class:"inline-flex w-5/12 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12",onClick:a[3]||(a[3]=f=>C())}," Confirmar ")])])])]),_:1})]),_:1})])])]),_:1})]),_:1},8,["show"]))}},we={class:"w-full flex flex-wrap sm:flex-none mt-2 space-y-4 sm:space-y-0"},be={class:"sm:w-4/12 w-full justify-center"},_e={class:"w-10/12 ms-10 relative mt-2 rounded-md shadow-sm"},ye={class:"sm:w-6/12 w-full justify-center"},ke={class:"w-10/12 relative ms-10 sm:ms-0 mt-1 rounded-md shadow-sm"},Ce={class:"w-full flex"},Pe={class:"w-9/12 me-4"},$e={class:"w-2/12"},je={key:0,class:"sm:w-1/12 w-full sm:-ms-20"},Oe={key:1,class:"sm:w-1/12 w-full sm:-ms-20"},Ie={class:"card w-full h-[28rem] sm:h-[36rem] bg-base-100 border border-base-200 shadow-xl overflow-auto rounded-md"},Ve={class:"card-body flex flex-col sm:flex-row"},ze={class:"w-full flex flex-col flex-wrap md:flex-row"},Le=["id"],Re=["id","onClick"],Ae={class:"w-full flex-col sm:flex sm:flex-wrap"},Be={class:"w-full flex justify-between max-h-8 -mt-4"},Me={key:0,class:"mb-2 w-6 h-6 sm:w-8 sm:h-8 sm:hover:w-10 sm:hover:h-10 transition-all duration-1000",src:Z,alt:"Painel Nobre",title:"Painel Nobre"},qe={key:1,class:"mb-2 w-6 h-6 sm:w-8 sm:h-8 sm:hover:w-10 sm:hover:h-10 transition-all duration-1000",src:ee,alt:"Painel Convêncional",title:"Painel Convêncional"},Fe={class:"text-xs sm:text-lg font-bold text-red-500"},Ne={class:"w-full flex flex-wrap sm:flex-nowrap justify-center my-2 sm:-ml-2 space-x-2"},Ue={class:"w-full flex justify-center sm:w-6/12"},Se=["src"],De={class:"w-full sm:w-6/12"},Ee={class:"sm:flex flex-wrap"},Ge={class:"w-full flex flex-col items-center space-y-3 mt-4 sm:mt-0"},Te={class:"text-xs sm:text-md font-extrabold"},He={class:"text-xs sm:card-md"},Je=e("p",{class:"text-xs sm:text-md hover:text-red-700 sm:ml-4"}," Ver Localização ",-1),Ke=["href"],Qe=e("img",{class:"w-6 h-6 ms-4 -mt-1 sm:hover:w-10 sm:hover:h-10 transition-all duration-500",src:se,alt:"Mapa"},null,-1),We=[Qe],Xe={__name:"GridPaineis",props:["tipoPainel","cliente","bisemana","paineis"],emits:["checkedPaineis","checkedPaineisId","campanha","observacoes"],setup(p,{emit:m}){const w=p,r=n(""),h=n(""),u=n(""),x=n(""),_=n(""),C=n(w.paineis),y=n([]),a=n([]),f=n([]);let I=J([]);K(()=>{g()}),A(()=>x.value,l=>{m("campanha",x.value),m("observacoes",_.value)});function P(l){l==="t"?u.value=!0:u.value=!1}const c=Q(()=>C.value.filter(s=>String(s.identificacao).toLowerCase().indexOf(r.value.toLowerCase())>-1));function d(l,s,t){h.value=y.value[l],h.classList,Object.values(a.value).includes(s)?(a.value.splice(a.value.indexOf(s),1),f.value.splice(a.value.indexOf(t),1)):(a.value.push(s),f.value.push(t),document.getElementById(s).classList.add("hidden")),m("checkedPaineis",a.value),m("checkedPaineisId",f.value)}function g(){axios.post("/GetPaineis",{statusPainel:w.tipoPainel,bisemana:w.bisemana}).then(l=>{C.value=l.data}).catch(l=>{console.log(l)})}function E(l){if(w.ambiente=="local")var s="http://localhost:8000/storage/"+l;else var s="/storage/"+l;return s}function G(){a.value=[],f.value=[],y.value.forEach(s=>{s.classList.remove("hidden")})}function T(l){x.value=l}function H(l){_.value=l}return(l,s)=>(b(),k(B,null,[e("div",we,[e("div",be,[e("div",_e,[L(e("input",{type:"text","onUpdate:modelValue":s[0]||(s[0]=t=>r.value=t),name:"pesquisa_painel",id:"pesquisa_painel",class:"block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",placeholder:"Pesquisar Painel"},null,512),[[R,r.value]])])]),e("div",ye,[e("div",ke,[e("div",Ce,[e("div",Pe,[i(o(ae),{disabled:"",modelValue:a.value,"onUpdate:modelValue":s[1]||(s[1]=t=>a.value=t),options:o(I),multiple:!0,"close-on-select":!0,"show-labels":!0,placeholder:"Painéis Selecionados"},null,8,["modelValue","options"])]),e("div",$e,[e("button",{onClick:s[2]||(s[2]=t=>G()),class:"botao max-h-10 bg-red-700 hover:bg-red-500"},"Limpar")])])])]),a.value.length>0&&x.value==""?(b(),k("div",je,[e("button",{title:"Preencher Campanha e Observações",onClick:s[3]||(s[3]=t=>P("t"))},[i(o(M),{class:"-mt-1 w-14 h-14 sm:w-14 sm:h-14 text-red-600 hover:text-red-700 transition-all duration-1000 animate-bounce"})])])):a.value.length>0&&x.value!=""?(b(),k("div",Oe,[e("button",{title:"Campanha e Observações preenchidos",onClick:s[4]||(s[4]=t=>P("t"))},[i(o(M),{class:"-mt-1 w-14 h-14 sm:w-14 sm:h-14 text-green-600 hover:text-green-700 transition-all duration-1000 animate-bounce"})])])):W("",!0)]),e("div",Ie,[e("div",Ve,[e("div",ze,[(b(!0),k(B,null,X(c.value,(t,V)=>(b(),k("div",{key:V,ref_for:!0,ref_key:"itemRefs",ref:y,id:t.identificacao,class:"card w-full sm:w-[30%] card-reserva-cliente"},[e("div",{class:"card-body flex",id:V,onClick:ls=>d(V,t.identificacao,t.id)},[e("div",Ae,[e("div",Be,[t.tipo==="1"?(b(),k("img",Me)):(b(),k("img",qe)),e("span",Fe,"Identificação.: "+$(t.identificacao),1)]),e("div",Ne,[e("div",Ue,[e("img",{class:"w-[240px] h-[140px] hover:scale-150 transition-all duration-1000 rounded-md",src:E(t.image_url),alt:"Foto-painel"},null,8,Se)]),e("div",De,[e("div",Ee,[e("div",Ge,[e("p",Te,"Bairro: "+$(t.bnome),1),e("p",He,$(t.logradouro)+" - "+$(t.numero),1),Je,e("a",{href:o(te)(t.latitude,t.longitude),target:"_blank"},We,8,Ke)])])])])])],8,Re)],8,Le))),128))])])]),i(ge,{open:u.value,onCloseObs:P,onCampanha:s[5]||(s[5]=t=>T(t)),onObservacoes:s[6]||(s[6]=t=>H(t))},null,8,["open"])],64))}},Ye=e("div",{class:"fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"},null,-1),Ze={class:"fixed inset-0 z-10 overflow-y-auto"},es={class:"flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"},ss={class:"mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"},ts={class:"mt-3 text-center sm:mt-5"},as={class:"text-red-500 font-extrabold"},os={class:"mt-5 sm:mt-6 w-full space-y-4 space-x-2 border-t border-gray-200 pt-4"},ps={__name:"AddReserva",props:["openAdd","cliente","bisemana","paineis"],emits:["closeAdd"],setup(p,{emit:m}){const w=p,r=n(!1),h=n([]),u=n([]),x=n(""),_=n("");A(()=>w.openAdd,c=>{c===!0&&(r.value=!0)});function C(c){h.value=[],h.value.push(c)}function y(c){u.value=[],u.value.push(c)}function a(c){x.value=c}function f(c){_.value=c}function I(){if(x.value===""){z.error("É obrigatório Informar a campanha!");return}Y.post("/ResPaineisCli",{clienteId:w.cliente.id,outdoorId:u.value,bsId:w.bisemana,campanha:x.value,observacoes:_.value}).then(c=>{z.success("Reserva realizada com sucesso!"),P(),setTimeout(()=>{window.location.reload()},2e3)}).catch(c=>{z.error("Erro ao realizar a reserva!")})}function P(){r.value=!1,m("closeAdd",r.value)}return(c,d)=>(b(),q(o(D),{as:"template",show:r.value},{default:v(()=>[i(o(N),{as:"div",class:"relative z-10"},{default:v(()=>[i(o(j),{as:"template",enter:"ease-out duration-300","enter-from":"opacity-0","enter-to":"opacity-100",leave:"ease-in duration-200","leave-from":"opacity-100","leave-to":"opacity-0"},{default:v(()=>[Ye]),_:1}),e("div",Ze,[e("div",es,[i(o(j),{as:"template",enter:"ease-out duration-300","enter-from":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95","enter-to":"opacity-100 translate-y-0 sm:scale-100",leave:"ease-in duration-200","leave-from":"opacity-100 translate-y-0 sm:scale-100","leave-to":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"},{default:v(()=>[i(o(U),{class:"relative transform overflow-hidden rounded-lg bg-white w-full sm:w-[82.5%] sm:p-6 sm:ml-[15%] sm:my-4 pb-4 pt-5 text-left shadow-xl transition-all"},{default:v(()=>[e("div",null,[e("div",ss,[i(o(F),{class:"h-6 w-6 text-green-600","aria-hidden":"true"})]),e("div",ts,[i(o(S),{as:"h3",class:"text-base font-semibold leading-6 text-gray-900"},{default:v(()=>[O(" Reservar painéis para o cliente: "),e("span",as,$(p.cliente.nome_fantasia?p.cliente.nome_fantasia:p.cliente.razao_social),1)]),_:1}),i(Xe,{tipoPainel:"D",bisemana:p.bisemana,paineis:p.paineis,onCheckedPaineis:d[0]||(d[0]=g=>C(g)),onCheckedPaineisId:d[1]||(d[1]=g=>y(g)),onCampanha:d[2]||(d[2]=g=>a(g)),onObservacoes:d[3]||(d[3]=g=>f(g))},null,8,["bisemana","paineis"]),e("div",os,[e("label",{class:"mt-3 inline-flex w-5/12 justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12",onClick:d[4]||(d[4]=g=>P())}," Cancelar "),e("label",{class:"inline-flex w-5/12 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12",onClick:d[5]||(d[5]=g=>I())}," Reservar ")])])])]),_:1})]),_:1})])])]),_:1})]),_:1},8,["show"]))}};export{ps as default};