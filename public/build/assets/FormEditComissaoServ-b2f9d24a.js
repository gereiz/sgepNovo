import{j as i,o as f,f as _,b as s,k as m,v as x,u as y,x as b}from"./app-24751841.js";import{U as w}from"./maska-82a16b27.js";import{u as h}from"./toastr-768a2c03.js";import"./functions-53da8c2b.js";import"./toastr-57c3d31e.js";const S={class:"w-full flex flex-col items-center justify-center space-y-8 mt-10"},k={class:"w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0"},C={class:"w-10/12 sm:w-3/12"},T=s("label",{for:"valor_comissao",class:"block text-sm font-medium leading-6 text-gray-900"},"Valor",-1),j={class:"mt-2"},E={class:"w-10/12 sm:w-3/12"},V=s("label",{for:"tipo_comissao",class:"block text-sm font-medium leading-6 text-gray-900"},"Tipo:",-1),B={class:"mt-2"},F=s("option",{value:"0"},"Valor",-1),M=s("option",{value:"1"},"Porcentagem",-1),U=[F,M],H={class:"mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4 sm:space-x-8"},N={__name:"FormEditComissaoServ",props:["servico"],emits:["closeEdit","sendFormComissao"],setup(c,{emit:l}){const a=c;h();const d=i(a.servico.comissao),n=i(a.servico.tipo_comissao),u=i(a.servico.id);function p(r){l("closeEdit",r)}const e=i({valor_comissao:d,tipo_comissao:n,id_servico:u});function v(r){document.getElementById("btnSendOne"),btnSendServ.innerHTML="Carregando...",setTimeout(()=>{btnSendServ.innerHTML="Salvar"},1e3)}function g(){e.valor_comissao!=""&&e.tipo_comissao!=""&&l("sendFormComissao",e.value)}return(r,o)=>(f(),_("div",S,[s("div",k,[s("div",C,[T,s("div",j,[m(s("input",{type:"text",name:"valor_comissao",id:"valor_comissao","onUpdate:modelValue":o[0]||(o[0]=t=>e.value.valor_comissao=t),class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center","data-maska":`[\r
                            '##,##',\r
                            '###,##',\r
                            '####,##',\r
                            '#####,##'\r
                        ]`},null,512),[[x,e.value.valor_comissao],[y(w)]])])]),s("div",E,[V,s("div",B,[m(s("select",{"onUpdate:modelValue":o[1]||(o[1]=t=>n.value=t),name:"tipo_comissao",id:"tipo_comissao",class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"},U,512),[[b,n.value]])])])]),s("div",H,[s("label",{id:"btnSendServ",class:"inline-flex w-10/12 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12",onClick:o[2]||(o[2]=t=>(g(),v()))},"Salvar"),s("label",{class:"mt-3 inline-flex w-10/12 justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12",onClick:o[3]||(o[3]=t=>p("f"))},"Cancelar")])]))}};export{N as default};
