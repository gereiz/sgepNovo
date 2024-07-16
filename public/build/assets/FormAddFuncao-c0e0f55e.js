import{j as m,o as u,f as g,b as e,m as a,v as i}from"./app-b59ccc57.js";import{u as f}from"./toastr-0012676b.js";import"./toastr-0e92b8d6.js";const p={class:"w-full flex flex-col items-center justify-center space-y-8 mt-10"},x={class:"w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0"},_={class:"w-10/12 sm:w-5/12"},v=e("label",{for:"nome_servico",class:"block text-sm font-medium leading-6 text-gray-900"},"Nome do Cargo/Função",-1),y={class:"mt-2"},b={class:"w-10/12 sm:w-5/12"},w=e("label",{for:"desc_servico",class:"block text-sm font-medium leading-6 text-gray-900"},"Descrição do Cargo/Função",-1),h={class:"mt-2"},F={class:"mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4 sm:space-x-8"},T={__name:"FormAddFuncao",props:[],emits:["closeAdd","sendFormFunc"],setup(S,{emit:r}){f();function c(n){r("closeAdd",n)}const t=m({cargo_funcao:"",desc_funcao:""});function d(n){document.getElementById("btnSendOne"),btnSendServ.innerHTML="Carregando...",setTimeout(()=>{btnSendServ.innerHTML="Salvar"},1e3)}function l(){t.cargo_funcao!=""&&t.desc_funcao!=""&&r("sendFormFunc",t.value)}return(n,s)=>(u(),g("div",p,[e("div",x,[e("div",_,[v,e("div",y,[a(e("input",{type:"text",name:"nome_servico",id:"nome_servico","onUpdate:modelValue":s[0]||(s[0]=o=>t.value.cargo_funcao=o),class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"},null,512),[[i,t.value.cargo_funcao]])])]),e("div",b,[w,e("div",h,[a(e("input",{type:"text",name:"desc_servico",id:"desc_servico","onUpdate:modelValue":s[1]||(s[1]=o=>t.value.desc_funcao=o),class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"},null,512),[[i,t.value.desc_funcao]])])])]),e("div",F,[e("label",{id:"btnSendServ",class:"inline-flex w-10/12 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12",onClick:s[2]||(s[2]=o=>(l(),d()))},"Salvar"),e("label",{class:"mt-3 inline-flex w-10/12 justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12",onClick:s[3]||(s[3]=o=>c("f"))},"Cancelar")])]))}};export{T as default};