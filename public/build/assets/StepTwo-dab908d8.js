import{j as c,q as S,o as l,f as a,b as s,k as d,v as m,x as f,F as g,l as v,u as U,t as p}from"./app-bd8ed453.js";import{U as V}from"./maska-82a16b27.js";import{u as j}from"./toastr-56ff4fca.js";const I={class:"w-full flex flex-col items-center justify-center space-y-8"},F={class:"w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0"},M={class:"w-full sm:w-9/12"},$=s("label",{for:"endereco",class:"block text-sm font-medium leading-6 text-gray-900"},"Endereço",-1),G={class:"mt-2"},L={class:"w-full sm:w-1/12"},N=s("label",{for:"numero",class:"block text-sm font-medium leading-6 text-gray-900"},"Número",-1),A={class:"mt-2"},D={class:"w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0"},H={class:"w-full sm:w-4/12"},O=s("label",{for:"uf",class:"block text-sm font-medium leading-6 text-gray-900"},"UF",-1),P={class:"mt-2"},q=s("option",{value:"0",disabled:"",selected:""},"Selecione",-1),z=["value"],J={class:"w-full sm:w-6/12"},K=s("label",{for:"cidade",class:"block text-sm font-medium leading-6 text-gray-900"},"Cidade",-1),Q={class:"mt-2"},R=["disabled"],W=s("option",{value:"0",disabled:"",selected:""},"Selecione",-1),X=["value"],Y={class:"w-full flex flex-wrap justify-center space-x-0 sm:space-x-6 space-y-8 sm:space-y-0"},Z={class:"w-full sm:w-6/12"},ee=s("label",{for:"bairro",class:"block text-sm font-medium leading-6 text-gray-900"},"Bairro",-1),se={class:"mt-2"},te=["disabled"],oe=s("option",{value:"0",disabled:"",selected:""},"Selecione",-1),ne=["value"],le={class:"w-full sm:w-4/12"},ae=s("label",{for:"cep",class:"block text-sm font-medium leading-6 text-gray-900"},"CEP",-1),ie={class:"mt-2"},re={class:"mt-5 sm:mt-6 w-full space-y-4 border-t border-gray-200 pt-4"},me={__name:"StepTwo",props:["clienteEdit"],emits:["step3","formTwo"],setup(B,{emit:x}){const y=B,i=j(),b=c([]),w=c([]),_=c([]),r=c(y.clienteEdit),e=c({ender:"",numero:"",uf:0,cidade:0,bairro:0,cep:""});S(()=>{axios.get("/dtGetUf").then(t=>{_.value=t.data}),y.clienteEdit.value!={}&&(e.value.ender=r.value.endereco,e.value.numero=r.value.num,e.value.uf=r.value.uf,h(),e.value.cidade=r.value.cidade,k(),e.value.bairro=r.value.bairro,e.value.cep=r.value.cep)});function h(){axios.post("/dtGetCidades",{uf:e.value.uf}).then(t=>{w.value=t.data}).catch(t=>{console.log(t)})}function k(){axios.post("/dtGetBairros",{cidade:e.value.cidade}).then(t=>{b.value=t.data}).catch(t=>{console.log(t)})}function E(t){let n=document.getElementById("btnSendTwo");n.innerHTML="Carregando...",setTimeout(()=>{x("step3",t),n.innerHTML="Avançar"},1e3)}function T(){if(e.value.ender==""){let t=document.getElementById("endereco");i.error("O campo Endereço é obrigatório!"),t.focus()}else if(e.value.numero==""){let t=document.getElementById("numero");i.error("O campo Número é obrigatório!"),t.focus()}else if(e.value.uf===0){let t=document.getElementById("uf");i.error("É necessário selecionar uma UF!"),t.focus()}else if(e.value.cidade===0){let t=document.getElementById("cidade");i.error("É necessário selecionar uma Cidade!"),t.focus()}else if(e.value.bairro===0){let t=document.getElementById("bairro");i.error("É necessário selecionar um Bairro!"),t.focus()}else if(e.value.cep==""){let t=document.getElementById("cep");i.error("É necessário informar um CEP!"),t.focus()}else E(3)}function C(){e.value.ender!=""&&e.value.numero!=""&&e.value.uf!=0&&e.value.cidade!=0&&e.value.bairro!=0&&e.value.cep!=""&&x("formTwo",e.value)}return(t,n)=>(l(),a("div",I,[s("div",F,[s("div",M,[$,s("div",G,[d(s("input",{type:"text",name:"endereco",id:"endereco","onUpdate:modelValue":n[0]||(n[0]=o=>e.value.ender=o),class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"},null,512),[[m,e.value.ender]])])]),s("div",L,[N,s("div",A,[d(s("input",{type:"text",name:"numero",id:"numero","onUpdate:modelValue":n[1]||(n[1]=o=>e.value.numero=o),class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"},null,512),[[m,e.value.numero]])])])]),s("div",D,[s("div",H,[O,s("div",P,[d(s("select",{id:"uf",name:"uf","onUpdate:modelValue":n[2]||(n[2]=o=>e.value.uf=o),onChange:n[3]||(n[3]=o=>h()),class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"},[q,(l(!0),a(g,null,v(_.value,(o,u)=>(l(),a("option",{key:u,value:o.id},p(o.nome),9,z))),128))],544),[[f,e.value.uf]])])]),s("div",J,[K,s("div",Q,[d(s("select",{id:"cidade",name:"cidade","onUpdate:modelValue":n[4]||(n[4]=o=>e.value.cidade=o),disabled:e.value.uf==0,onChange:n[5]||(n[5]=o=>k()),class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"},[W,(l(!0),a(g,null,v(w.value,(o,u)=>(l(),a("option",{key:u,value:o.id},p(o.nome),9,X))),128))],40,R),[[f,e.value.cidade]])])])]),s("div",Y,[s("div",Z,[ee,s("div",se,[d(s("select",{id:"bairro",name:"bairro","onUpdate:modelValue":n[6]||(n[6]=o=>e.value.bairro=o),disabled:e.value.cidade==0,class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"},[oe,(l(!0),a(g,null,v(b.value,(o,u)=>(l(),a("option",{key:u,value:o.id},p(o.nome),9,ne))),128))],8,te),[[f,e.value.bairro]])])]),s("div",le,[ae,s("div",ie,[d(s("input",{type:"text",name:"cep",id:"cep","onUpdate:modelValue":n[7]||(n[7]=o=>e.value.cep=o),class:"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center","data-maska":"##.###-###"},null,512),[[m,e.value.cep],[U(V)]])])])]),s("div",re,[s("label",{class:"mt-3 inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-5/12",onClick:n[8]||(n[8]=o=>E(1))},"Voltar"),s("label",{id:"btnSendTwo",class:"inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-5/12",onClick:n[9]||(n[9]=o=>(T(),C()))},"Avançar")])]))}};export{me as default};
