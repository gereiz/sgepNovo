import{T as d,o as m,f as u,b as e,e as f,a as o,u as t,n as p}from"./app-c0191d23.js";import{a as r,b as i,_ as n}from"./TextInput-ed7554a8.js";const _="/build/assets/logo1-d61f7a73.png",w={class:"flex"},h=e("div",{class:"md:w-8/12 h-screen group md:flex md:flex-row items-center justify-center hidden"},[e("div",{class:"z-0 w-8/12 absolute h-screen bg-hero bg-cover opacity-30 group-hover:opacity-75 transform transition-all duration-1000"}),e("div",{class:"z-10 group-hover:text-white transition-all duration-1000"},[e("p",{class:"text-[4rem] text-center font-extrabold"},"Sistema de Gerenciamento de Espaços Publicitários")])],-1),b={class:"w-full md:w-4/12 hover:bg-stone-100 h-screen flex flex-col justify-center items-center transition-all duration-1000"},g=["onSubmit"],x={class:"w-full h-full flex flex-col justify-center items-center"},v=e("img",{src:_,class:"w-32 mb-10",alt:"Logo"},null,-1),y={class:"w-11/12 md:w-8/12 flex flex-col items-start"},V={class:"w-11/12 md:w-8/12 flex items-end justify-end mt-10"},S=["disabled"],z={__name:"Login",props:{canResetPassword:{type:Boolean},status:{type:String,type:String}},setup(j){const s=d({email:"",password:"",remember:!1}),c=()=>{s.post(route("login"),{onFinish:()=>s.reset("password")})};return(k,a)=>(m(),u("div",w,[h,e("div",b,[e("form",{onSubmit:f(c,["prevent"]),class:"w-full h-full flex flex-col justify-center items-center"},[e("div",x,[v,e("div",y,[o(n,{class:"float-right",for:"email",value:"Email"}),o(r,{id:"email",type:"email",class:"w-full h-[3.5rem] mt-1 block mb-10",modelValue:t(s).email,"onUpdate:modelValue":a[0]||(a[0]=l=>t(s).email=l),required:"",autofocus:"",autocomplete:"username"},null,8,["modelValue"]),o(i,{class:"mt-2",message:t(s).errors.email},null,8,["message"]),o(n,{for:"password",value:"Senha"}),o(r,{id:"password",type:"password",class:"w-full h-[3.5rem] mt-1 block",modelValue:t(s).password,"onUpdate:modelValue":a[1]||(a[1]=l=>t(s).password=l),required:"",autocomplete:"current-password"},null,8,["modelValue"]),o(i,{class:"mt-2",message:t(s).errors.password},null,8,["message"])]),e("div",V,[e("button",{class:p(["w-full btn bg-cor-primaria hover:bg-sky-600 hover:border-white transition-all duration-1000",{"opacity-25":t(s).processing}]),disabled:t(s).processing}," Entrar ",10,S)])])],40,g)])]))}};export{z as default};
