import u from"./StepOne-812ca796.js";import O from"./StepTwo-2db358f6.js";import N from"./StepThree-4ca5e865.js";import"./toastr-e1375ee3.js";import{h as y,G as A,V as F,Y as I,S as J}from"./transition-a4c308ad.js";import{r as j}from"./CheckIcon-dfbb59e1.js";import{j as c,s as V,k as E,o as p,c as _,w as l,u as s,a as r,b as t,d as k,K as B,q as R}from"./app-4ff54ba4.js";import"./maska-1eacf752.js";import"./toastr-9d5d101a.js";/* empty css                   */const $=t("div",{class:"fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"},null,-1),z={class:"fixed inset-0 z-10 overflow-y-auto"},G={class:"flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"},K={class:"mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"},Y={class:"mt-3 text-center sm:mt-5"},q={class:"space-y-12"},D={class:"border-b border-gray-900/10 pb-12"},P=t("p",{class:"mt-1 text-sm leading-6 text-gray-600"},"Preencha os dados para incluir um novo cliente.",-1),H={class:"mt-10 space-y-10"},oe={__name:"AddCliente",props:["openAdd","clienteEdit"],emits:["closeAdd"],setup(g,{emit:x}){const v=g,w=x,m=c(!1),o=V(u),n=c({}),a=c({}),i=c({}),d=c({});function h(){m.value=!1,w("CloseAdd",m.value)}function f(e){e===0?(o.value=u,h()):e===1?o.value=u:e===2?o.value=O:e===3?o.value=N:e===4&&(o.value=u,T(),h())}function S(e){n.value.r_social=e.r_social,n.value.n_fantasia=e.n_fantasia,n.value.cpf_cnpj=e.cpf_cnpj,n.value.insc_est=e.insc_est,localStorage.setItem("formOne",JSON.stringify(n.value))}function b(e){a.value.ender=e.ender,a.value.numero=e.numero,a.value.uf=e.uf,a.value.cidade=e.cidade,a.value.bairro=e.bairro,a.value.cep=e.cep,localStorage.setItem("formTwo",JSON.stringify(a.value))}function C(e){i.value.responsavel=e.responsavel,i.value.tel_resp=e.telResp,i.value.email_resp=e.emailResp,i.value.idCliente=e.idCliente,localStorage.setItem("formThree",JSON.stringify(i.value)),d.value.sOne=JSON.parse(localStorage.getItem("formOne")),d.value.sTwo=JSON.parse(localStorage.getItem("formTwo")),d.value.sThree=JSON.parse(localStorage.getItem("formThree"))}function T(){axios.post("/CadCliente",{form:d.value}).then(e=>{location.reload()}).catch(e=>{console.error(e)})}return E(()=>v.openAdd,e=>{e===!0&&(m.value=!0)}),(e,L)=>(p(),_(s(J),{as:"template",show:m.value},{default:l(()=>[r(s(I),{as:"div",class:"relative z-10"},{default:l(()=>[r(s(y),{as:"template",enter:"ease-out duration-300","enter-from":"opacity-0","enter-to":"opacity-100",leave:"ease-in duration-200","leave-from":"opacity-100","leave-to":"opacity-0"},{default:l(()=>[$]),_:1}),t("div",z,[t("div",G,[r(s(y),{as:"template",enter:"ease-out duration-300","enter-from":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95","enter-to":"opacity-100 translate-y-0 sm:scale-100",leave:"ease-in duration-200","leave-from":"opacity-100 translate-y-0 sm:scale-100","leave-to":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"},{default:l(()=>[r(s(A),{class:"relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-5/12 sm:max-w-full sm:p-6"},{default:l(()=>[t("div",null,[t("div",K,[r(s(j),{class:"h-6 w-6 text-green-600","aria-hidden":"true"})]),t("div",Y,[r(s(F),{as:"h3",class:"text-base font-semibold leading-6 text-gray-900"},{default:l(()=>[k("Cadastrar Novo Cliente")]),_:1}),t("form",null,[t("div",q,[t("div",D,[P,t("div",H,[(p(),_(B,null,[(p(),_(R(o.value),{clienteEdit:v.clienteEdit,onStep2:f,onStep3:f,onStepSubumit:f,onFormOne:S,onFormTwo:b,onFormThree:C},null,40,["clienteEdit"]))],1024))])])])])])])]),_:1})]),_:1})])])]),_:1})]),_:1},8,["show"]))}};export{oe as default};
