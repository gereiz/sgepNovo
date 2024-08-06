import{o as b,f as y,b as e,j as l,k as V,c as Z,w as p,a as n,u as i,d as B,m as N,v as R,z as Y,x as H,h as J,g as K,F as S,p as Q,t as $,l as W}from"./app-b79949ba.js";import{_ as X,a as ee}from"./painel_conv-45a82d16.js";import{_ as se}from"./regiao-35565801.js";import{a as te}from"./functions-ab7c0477.js";import{s as ae}from"./vue-multiselect.esm-b24b97a9.js";import{t as oe}from"./toastr-f64cb889.js";import{r as D}from"./ClipboardDocumentCheckIcon-131a2274.js";import{Y as G,h as I,G as U,V as E,S as T}from"./transition-80938efe.js";import le from"./ModalPiRes-454f1d0e.js";import"./toastr-76f8313c.js";/* empty css                   */import"./html2pdf-d3a538d9.js";import"./StepOnePi-bfda058b.js";import"./maska-1eacf752.js";import"./UserCircleIcon-6dceef4a.js";import"./StepTwoPi-380d5156.js";import"./StepThreePi-0967568e.js";import"./StepFourPi-4f588e93.js";import"./XMarkIcon-82728262.js";function q(h,C){return b(),y("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true","data-slot":"icon"},[e("path",{"fill-rule":"evenodd",d:"M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z","clip-rule":"evenodd"})])}const ne=e("div",{class:"fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"},null,-1),ie={class:"fixed inset-0 z-10 overflow-y-auto"},re={class:"flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"},ce={class:"mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"},de={class:"mt-3 text-center sm:mt-5 space-y-4"},me=e("span",{class:"text-red-500 font-extrabold"},null,-1),ue={class:"w-full flex flex-col items-center justify-end"},fe={class:"w-11/12 flex flex-col flex-wrap"},ve=e("label",{for:"campanha",class:"block text-sm font-medium leading-6 text-gray-900"},[B("Inclua o Título da Campanha. "),e("span",{class:"text-red-500 italic"}," (Obrigatório) ")],-1),pe={class:"w-full flex flex-col items-center justify-end"},he={class:"w-11/12 flex flex-col flex-wrap"},xe=e("label",{for:"obsevacoes",class:"block text-sm font-medium leading-6 text-gray-900"},[B("Inclua observações sobre a reseva. "),e("span",{class:"text-red-500 italic"}," (opcional) ")],-1),ge={class:"w-full mt-2"},_e={class:"mt-5 sm:mt-6 w-full space-y-4 space-x-2 border-t border-gray-200 pt-4"},be={__name:"ConfirmaReserva",props:["open"],emits:["campanha","obsevacoes","closeObs"],setup(h,{emit:C}){const g=h,m=C,c=l(""),u=l(""),f=l(!1);V(()=>g.open,_=>{_===!0&&(f.value=!0)});function x(){c.value="",u.value="",m("campanha",c.value),m("observacoes",u.value)}function w(){f.value=!1,m("closeObs",f.value)}function k(){m("campanha",c.value),m("observacoes",u.value),w()}return(_,o)=>(b(),Z(i(T),{as:"template",show:f.value},{default:p(()=>[n(i(G),{as:"div",class:"relative z-10"},{default:p(()=>[n(i(I),{as:"template",enter:"ease-out duration-300","enter-from":"opacity-0","enter-to":"opacity-100",leave:"ease-in duration-200","leave-from":"opacity-100","leave-to":"opacity-0"},{default:p(()=>[ne]),_:1}),e("div",ie,[e("div",re,[n(i(I),{as:"template",enter:"ease-out duration-300","enter-from":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95","enter-to":"opacity-100 translate-y-0 sm:scale-100",leave:"ease-in duration-200","leave-from":"opacity-100 translate-y-0 sm:scale-100","leave-to":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"},{default:p(()=>[n(i(U),{class:"relative transform overflow-hidden rounded-lg bg-white w-full sm:w-[42.5%] sm:p-6 sm:ml-[15%] sm:my-4 pb-4 pt-5 text-left shadow-xl transition-all"},{default:p(()=>[e("div",null,[e("div",ce,[n(i(D),{class:"h-6 w-6 text-green-600","aria-hidden":"true"})]),e("div",de,[n(i(E),{as:"h3",class:"text-base font-semibold leading-6 text-gray-900"},{default:p(()=>[B(" Informe a Campanha e Observações sobre a reserva. "),me]),_:1}),e("div",ue,[e("div",fe,[ve,N(e("input",{type:"text","onUpdate:modelValue":o[0]||(o[0]=v=>c.value=v),name:"campanha",id:"campanha",class:"block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",placeholder:"Informar campanha"},null,512),[[R,c.value]])])]),e("div",pe,[e("div",he,[xe,e("div",ge,[N(e("textarea",{rows:"4",name:"obsevacoes",id:"obsevacoes","onUpdate:modelValue":o[1]||(o[1]=v=>u.value=v),class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"},null,512),[[R,u.value]])])])]),e("div",_e,[e("label",{class:"mt-3 inline-flex w-5/12 justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12",onClick:o[2]||(o[2]=v=>(w(),x()))}," Cancelar "),e("label",{class:"inline-flex w-5/12 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12",onClick:o[3]||(o[3]=v=>k())}," Confirmar ")])])])]),_:1})]),_:1})])])]),_:1})]),_:1},8,["show"]))}},we={class:"w-full flex flex-wrap sm:flex-none mt-2 space-y-4 sm:space-y-0"},ye={class:"sm:w-4/12 w-full justify-center"},Ce={class:"w-10/12 ms-10 relative mt-2 rounded-md shadow-sm"},ke={class:"sm:w-6/12 w-full justify-center"},Pe={class:"w-10/12 relative ms-10 sm:ms-0 mt-1 rounded-md shadow-sm"},$e={class:"w-full flex"},je={class:"w-9/12 me-4"},Oe={class:"w-2/12"},Ve={key:0,class:"sm:w-1/12 w-full sm:-ms-20"},Ie={key:1,class:"sm:w-1/12 w-full sm:-ms-20"},Be={class:"card w-full h-[28rem] sm:h-[36rem] bg-base-100 border border-base-200 shadow-xl overflow-auto rounded-md"},Ae={class:"card-body flex flex-col sm:flex-row"},Le={class:"w-full flex flex-col flex-wrap md:flex-row"},ze=["id"],Me=["id","onClick"],Fe={class:"w-full flex-col sm:flex sm:flex-wrap"},Ne={class:"w-full flex justify-between max-h-8 -mt-4"},Re={key:0,class:"mb-2 w-6 h-6 sm:w-8 sm:h-8 sm:hover:w-10 sm:hover:h-10 transition-all duration-1000",src:X,alt:"Painel Nobre",title:"Painel Nobre"},Se={key:1,class:"mb-2 w-6 h-6 sm:w-8 sm:h-8 sm:hover:w-10 sm:hover:h-10 transition-all duration-1000",src:ee,alt:"Painel Convêncional",title:"Painel Convêncional"},qe={class:"text-xs sm:text-lg font-bold text-red-500"},De={class:"w-full flex flex-wrap sm:flex-nowrap justify-center my-2 sm:-ml-2 space-x-2"},Ge={class:"w-full flex justify-center sm:w-6/12"},Ue=["src"],Ee={class:"w-full sm:w-6/12"},Te={class:"sm:flex flex-wrap"},Ze={class:"w-full flex flex-col items-center space-y-3 mt-4 sm:mt-0"},Ye={class:"text-xs sm:text-md font-extrabold"},He={class:"text-xs sm:card-md"},Je=e("p",{class:"text-xs sm:text-md hover:text-red-700 sm:ml-4"}," Ver Localização ",-1),Ke=["href"],Qe=e("img",{class:"w-6 h-6 ms-4 -mt-1 sm:hover:w-10 sm:hover:h-10 transition-all duration-500",src:se,alt:"Mapa"},null,-1),We=[Qe],Xe={__name:"GridPaineis",props:["tipoPainel","cliente","bisemana","paineis"],emits:["checkedPaineis","checkedPaineisId","campanha","observacoes"],setup(h,{emit:C}){const g=h,m=C,c=l(""),u=l(""),f=l(""),x=l(""),w=l(""),k=l(g.paineis),_=l([]),o=l([]),v=l([]);let A=Y([]);H(()=>{j()}),V(()=>x.value,s=>{m("campanha",x.value),m("observacoes",w.value)}),V(()=>g.bisemana,s=>{j()});function P(s){s==="t"?f.value=!0:f.value=!1}const L=J(()=>k.value.filter(t=>String(t.identificacao).toLowerCase().indexOf(c.value.toLowerCase())>-1));function z(s,t,a){u.value=_.value[s],u.classList,Object.values(o.value).includes(t)?(o.value.splice(o.value.indexOf(t),1),v.value.splice(o.value.indexOf(a),1)):(o.value.push(t),v.value.push(a),document.getElementById(t).classList.add("hidden")),m("checkedPaineis",o.value),m("checkedPaineisId",v.value)}function j(){axios.post("/GetPaineis",{statusPainel:g.tipoPainel,bisemana:g.bisemana}).then(s=>{k.value=s.data}).catch(s=>{console.log(s)})}function O(s){if(g.ambiente=="local")var t="http://localhost:8000/storage/"+s;else var t="/storage/"+s;return t}function M(){o.value=[],v.value=[],x.value="",_.value.forEach(t=>{t.classList.remove("hidden")})}function r(s){x.value=s}function d(s){w.value=s}return(s,t)=>(b(),y(S,null,[e("div",we,[e("div",ye,[e("div",Ce,[N(e("input",{type:"text","onUpdate:modelValue":t[0]||(t[0]=a=>c.value=a),name:"pesquisa_painel",id:"pesquisa_painel",class:"block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",placeholder:"Pesquisar Painel"},null,512),[[R,c.value]])])]),e("div",ke,[e("div",Pe,[e("div",$e,[e("div",je,[n(i(ae),{disabled:"",modelValue:o.value,"onUpdate:modelValue":t[1]||(t[1]=a=>o.value=a),options:i(A),multiple:!0,"close-on-select":!0,"show-labels":!0,placeholder:"Painéis Selecionados"},null,8,["modelValue","options"])]),e("div",Oe,[e("button",{onClick:t[2]||(t[2]=a=>M()),class:"botao max-h-10 bg-red-700 hover:bg-red-500"},"Limpar")])])])]),o.value.length>0&&x.value==""?(b(),y("div",Ve,[e("button",{title:"Preencher Campanha e Observações",onClick:t[3]||(t[3]=a=>P("t"))},[n(i(q),{class:"-mt-1 w-14 h-14 sm:w-14 sm:h-14 text-red-600 hover:text-red-700 transition-all duration-1000 animate-bounce"})])])):o.value.length>0&&x.value!=""?(b(),y("div",Ie,[e("button",{title:"Campanha e Observações preenchidos",onClick:t[4]||(t[4]=a=>P("t"))},[n(i(q),{class:"-mt-1 w-14 h-14 sm:w-14 sm:h-14 text-green-600 hover:text-green-700 transition-all duration-1000 animate-bounce"})])])):K("",!0)]),e("div",Be,[e("div",Ae,[e("div",Le,[(b(!0),y(S,null,Q(L.value,(a,F)=>(b(),y("div",{key:F,ref_for:!0,ref_key:"itemRefs",ref:_,id:a.identificacao,class:"card w-full sm:w-[30%] card-reserva-cliente"},[e("div",{class:"card-body flex",id:F,onClick:is=>z(F,a.identificacao,a.id)},[e("div",Fe,[e("div",Ne,[a.tipo==="1"?(b(),y("img",Re)):(b(),y("img",Se)),e("span",qe,"Identificação.: "+$(a.identificacao),1)]),e("div",De,[e("div",Ge,[e("img",{class:"w-[240px] h-[140px] hover:scale-150 transition-all duration-1000 rounded-md",src:O(a.image_url),alt:"Foto-painel"},null,8,Ue)]),e("div",Ee,[e("div",Te,[e("div",Ze,[e("p",Ye,"Bairro: "+$(a.bnome),1),e("p",He,$(a.logradouro)+" - "+$(a.numero),1),Je,e("a",{href:i(te)(a.latitude,a.longitude),target:"_blank"},We,8,Ke)])])])])])],8,Me)],8,ze))),128))])])]),n(be,{open:f.value,onCloseObs:P,onCampanha:t[5]||(t[5]=a=>r(a)),onObservacoes:t[6]||(t[6]=a=>d(a))},null,8,["open"])],64))}},es=e("div",{class:"fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"},null,-1),ss={class:"fixed inset-0 z-10 overflow-y-auto"},ts={class:"flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"},as={class:"mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"},os={class:"mt-3 text-center sm:mt-5"},ls={class:"text-red-500 font-extrabold"},ns={class:"mt-5 sm:mt-6 w-full space-y-4 space-x-2 border-t border-gray-200 pt-4"},js={__name:"AddReserva",props:["openAdd","cliente","bisemana","paineis"],emits:["closeAdd"],setup(h,{emit:C}){const g=h,m=C,c=l(!1),u=l(!1),f=l([]),x=l([]),w=l(""),k=l(""),_=l("");V(()=>g.openAdd,r=>{r===!0&&(c.value=!0,P())});function o(r){f.value=[],f.value.push(r)}function v(r){x.value=[],x.value.push(r)}function A(r){w.value=r}function P(){W.post("/getBisemana",{idBs:g.bisemana}).then(r=>{_.value=r.data})}function L(r){k.value=r}function z(){if(w.value===""){oe.error("É obrigatório Informar a campanha!");return}j("t")}function j(r){r==="t"&&(u.value=!0)}function O(){c.value=!1,m("closeAdd",c.value)}function M(){u.value=!1}return(r,d)=>(b(),y(S,null,[n(i(T),{as:"template",show:c.value},{default:p(()=>[n(i(G),{as:"div",class:"relative z-10"},{default:p(()=>[n(i(I),{as:"template",enter:"ease-out duration-300","enter-from":"opacity-0","enter-to":"opacity-100",leave:"ease-in duration-200","leave-from":"opacity-100","leave-to":"opacity-0"},{default:p(()=>[es]),_:1}),e("div",ss,[e("div",ts,[n(i(I),{as:"template",enter:"ease-out duration-300","enter-from":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95","enter-to":"opacity-100 translate-y-0 sm:scale-100",leave:"ease-in duration-200","leave-from":"opacity-100 translate-y-0 sm:scale-100","leave-to":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"},{default:p(()=>[n(i(U),{class:"relative transform overflow-hidden rounded-lg bg-white w-full sm:w-[82.5%] sm:p-6 sm:my-4 pb-4 pt-5 text-left shadow-xl transition-all"},{default:p(()=>[e("div",null,[e("div",as,[n(i(D),{class:"h-6 w-6 text-green-600","aria-hidden":"true"})]),e("div",os,[n(i(E),{as:"h3",class:"text-base font-semibold leading-6 text-gray-900"},{default:p(()=>[B(" Reservar painéis para o cliente: "),e("span",ls,$(h.cliente.nome_fantasia?h.cliente.nome_fantasia:h.cliente.razao_social),1)]),_:1}),n(Xe,{tipoPainel:"D",bisemana:_.value,paineis:h.paineis,onCheckedPaineis:d[0]||(d[0]=s=>o(s)),onCheckedPaineisId:d[1]||(d[1]=s=>v(s)),onCampanha:d[2]||(d[2]=s=>A(s)),onObservacoes:d[3]||(d[3]=s=>L(s))},null,8,["bisemana","paineis"]),e("div",ns,[e("label",{class:"mt-3 inline-flex w-5/12 justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12",onClick:d[4]||(d[4]=s=>O())}," Cancelar "),e("label",{class:"inline-flex w-5/12 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12",onClick:d[5]||(d[5]=s=>z())}," Criar PI ")])])])]),_:1})]),_:1})])])]),_:1})]),_:1},8,["show"]),n(le,{openPi:u.value,paineis:f.value,campanha:w.value,onClosePi:M,onCloseAdd:O,cliente:h.cliente,bisemana:_.value},null,8,["openPi","paineis","campanha","cliente","bisemana"])],64))}};export{js as default};