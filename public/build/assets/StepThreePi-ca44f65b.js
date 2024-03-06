import{j as m,z as d,h as c,o as x,f as p,b as e,t as a}from"./app-bd8ed453.js";const f={class:"space-y-6 transition-all duration-1000"},b={class:"mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left"},u=e("h1",{as:"h3",class:"text-base font-semibold leading-6 text-gray-900"},"Pedido de Inserção ",-1),g=e("div",{class:"flex mt-2"},[e("p",{class:"text-sm text-gray-500 mb-4"},"Confira os dados para criação do Pedido de Inserção.")],-1),h={class:"text-xs font-bold text-red-500"},v=e("div",null,[e("h3",{class:"font-extrabold text-4xl text-red-700 animate-pulse duration-200 text-center"},"ATENÇÃO!"),e("p",{class:"py-4 font-extrabold"},'Ao clicar no botão "Gerar PI" será criada uma PI para esta reserva!'),e("p",{class:"py-4 font-extrabold"},"Não será possível editar NENHUM dado desta reserva, ou da PI, somente cancelando e mesma e realizando uma nova reserva."),e("p",{class:"py-4 font-extrabold"},"Confirme somente se tiver certeza da reserva.")],-1),y={class:"mt-5 sm:mt-4 sm:flex sm:flex-row-reverse"},w={__name:"StepThreePi",props:["cliente","campanha","painel","bisemana"],emits:["nextStep","formThree"],setup(s,{emit:r}){m(!1);const i=d();c(()=>i.props.auth.user);const o=n=>{r("nextStep",n)};return(n,t)=>(x(),p("div",f,[e("div",b,[u,g,e("p",h,"Bi-Semana: "+a(s.bisemana[0].num_bisemana)+" "+a(new Date(s.bisemana[0].inicio).toLocaleDateString("pt-br",{timeZone:"UTC"}))+" até "+a(new Date(s.bisemana[0].fim).toLocaleDateString("pt-br",{timeZone:"UTC"})),1)]),v,e("div",y,[e("label",{class:"inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto",onClick:t[0]||(t[0]=l=>o(4))},"Gerar PI"),e("label",{class:"mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto",onClick:t[1]||(t[1]=l=>o(2))},"Voltar")])]))}};export{w as default};
