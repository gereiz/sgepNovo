import{u as r}from"./toastr-56ff4fca.js";import{o as d,f as m,b as e,t as p,F as v}from"./app-bd8ed453.js";const _=e("input",{type:"checkbox",id:"modal-canc-reserva",class:"modal-toggle"},null,-1),f={class:"modal flex items-end md:items-center"},u={method:"dialog",class:"modal-box bg-white"},b={class:"font-black text-2xl animate-pulse duration-200 text-center mb-2"},h=e("h3",{class:"font-black text-2xl text-red-700 animate-pulse duration-200 text-center"},"ATENÇÃO!",-1),x=e("p",{class:"py-4"},"Ao cancelar esta reserva, o painel ficará disponível na Bi-semana selecionada, e poderá ser reservado imadiatamente.",-1),g=e("p",{class:"py-4"},"Confirme somente se tiver certeza do cancelamento!",-1),y={class:"modal-action"},R={class:"w-full flex justify-center space-x-4"},k=e("label",{for:"modal-canc-reserva",class:"w-5/12 text-sm botao-modal bg-gray-700 hover:bg-gray-500"},"Manter Reserva",-1),z={__name:"ModalCancelRes",props:["painel","bisemana"],emits:["atualizaPage"],setup(s,{emit:l}){const t=s,o=r(),c=a=>{l("atualizaPage",a)};function i(){axios.post("/CancelaReserva",{painelReserva:t.painel,bs:t.bisemana}).then(a=>{a.data.cod==1?o.success(a.data.msg):o.error(a.data.msg)})}return(a,n)=>(d(),m(v,null,[_,e("div",f,[e("form",u,[e("h3",b,"Cancelar Reserva: Painel "+p(s.painel.identificacao),1),h,x,g,e("div",y,[e("div",R,[e("label",{onClick:n[0]||(n[0]=C=>(i(s.painel),c(1))),for:"modal-canc-reserva",class:"w-5/12 text-sm botao-modal bg-red-700 hover:bg-red-500"},"Cancelar Reserva"),k])])])])],64))}};export{z as default};
