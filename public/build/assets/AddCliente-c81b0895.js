import u from"./StepOne-08e74847.js";import T from"./StepTwo-c0c541a5.js";import O from"./StepThree-70b1acc5.js";import"./toastr-0fb602b4.js";import{h as y,G as N,V as A,U as F,S as I}from"./transition-345955b9.js";import{r as J}from"./CheckIcon-1fc44059.js";import{j as c,s as j,m as V,o as p,c as _,w as l,u as s,a as n,b as t,d as E,K as B,p as R}from"./app-6503be43.js";import"./maska-82a16b27.js";import"./toastr-56b97b10.js";const $=t("div",{class:"fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"},null,-1),k={class:"fixed inset-0 z-10 overflow-y-auto"},z={class:"flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"},G={class:"mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"},K={class:"mt-3 text-center sm:mt-5"},U={class:"space-y-12"},D={class:"border-b border-gray-900/10 pb-12"},P=t("p",{class:"mt-1 text-sm leading-6 text-gray-600"},"Preencha os dados para incluir um novo cliente.",-1),q={class:"mt-10 space-y-10"},ae={__name:"AddCliente",props:["openAdd","clienteEdit"],emits:["closeAdd"],setup(g,{emit:x}){const v=g,m=c(!1),o=j(u),r=c({}),a=c({}),i=c({}),d=c({});function h(){m.value=!1,x("CloseAdd",m.value)}function f(e){e===0?(o.value=u,h()):e===1?o.value=u:e===2?o.value=T:e===3?o.value=O:e===4&&(o.value=u,C(),h())}function w(e){r.value.r_social=e.r_social,r.value.n_fantasia=e.n_fantasia,r.value.cpf_cnpj=e.cpf_cnpj,r.value.insc_est=e.insc_est,localStorage.setItem("formOne",JSON.stringify(r.value))}function S(e){a.value.ender=e.ender,a.value.numero=e.numero,a.value.uf=e.uf,a.value.cidade=e.cidade,a.value.bairro=e.bairro,a.value.cep=e.cep,localStorage.setItem("formTwo",JSON.stringify(a.value))}function b(e){i.value.responsavel=e.responsavel,i.value.tel_resp=e.telResp,i.value.email_resp=e.emailResp,i.value.idCliente=e.idCliente,localStorage.setItem("formThree",JSON.stringify(i.value)),d.value.sOne=JSON.parse(localStorage.getItem("formOne")),d.value.sTwo=JSON.parse(localStorage.getItem("formTwo")),d.value.sThree=JSON.parse(localStorage.getItem("formThree"))}function C(){axios.post("/CadCliente",{form:d.value}).then(e=>{console.log(e),location.reload()}).catch(e=>{console.error(e)})}return V(()=>v.openAdd,e=>{e===!0&&(m.value=!0)}),(e,H)=>(p(),_(s(I),{as:"template",show:m.value},{default:l(()=>[n(s(F),{as:"div",class:"relative z-10"},{default:l(()=>[n(s(y),{as:"template",enter:"ease-out duration-300","enter-from":"opacity-0","enter-to":"opacity-100",leave:"ease-in duration-200","leave-from":"opacity-100","leave-to":"opacity-0"},{default:l(()=>[$]),_:1}),t("div",k,[t("div",z,[n(s(y),{as:"template",enter:"ease-out duration-300","enter-from":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95","enter-to":"opacity-100 translate-y-0 sm:scale-100",leave:"ease-in duration-200","leave-from":"opacity-100 translate-y-0 sm:scale-100","leave-to":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"},{default:l(()=>[n(s(N),{class:"relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-5/12 sm:max-w-full sm:p-6"},{default:l(()=>[t("div",null,[t("div",G,[n(s(J),{class:"h-6 w-6 text-green-600","aria-hidden":"true"})]),t("div",K,[n(s(A),{as:"h3",class:"text-base font-semibold leading-6 text-gray-900"},{default:l(()=>[E("Cadastrar Novo Cliente")]),_:1}),t("form",null,[t("div",U,[t("div",D,[P,t("div",q,[(p(),_(B,null,[(p(),_(R(o.value),{clienteEdit:v.clienteEdit,onStep2:f,onStep3:f,onStepSubumit:f,onFormOne:w,onFormTwo:S,onFormThree:b},null,40,["clienteEdit"]))],1024))])])])])])])]),_:1})]),_:1})])])]),_:1})]),_:1},8,["show"]))}};export{ae as default};
