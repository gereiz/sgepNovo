import{j as l,y as te,h as ve,q as fe,o as i,f as n,a as g,u as L,w as _e,F as v,Z as be,b as e,t as d,k as u,x as p,l as b,g as M,n as N,d as pe,v as ae,A as he}from"./app-b70844ce.js";import{_ as xe,a as we}from"./painel_conv-45a82d16.js";import{_ as ge}from"./regiao-35565801.js";import{_ as ke}from"./AuthenticatedLayout-e4ed3eaa.js";import ye from"./ModalCancelRes-eeb9b682.js";import{g as Ce,a as Pe,_ as Be,t as R}from"./ModalWpp-ed24d7f0.js";import Re from"./ModalPiRes-18735009.js";import{s as je}from"./vue-multiselect.esm-10b2d0e6.js";import"./XMarkIcon-eae81f8b.js";import"./transition-30d2b01b.js";import"./toastr-6fa35806.js";import"./toastr.min-616d3607.js";import"./StepOne-7beb304a.js";import"./maska-82a16b27.js";import"./StepTwo-1e9fa0b5.js";const De="/build/assets/spinner-0f1bcd37.png",$e={class:"w-full h-screen pt-20 pb-32 mx-2 sm:mx-4"},Ve={class:"w-full h-14 flex mb-2"},Se={class:"w-2/12 h-14 flex items-center"},Te=e("h1",{class:"text-xl sm:text-4xl font-bold"},"Reservas",-1),Ee={class:"text-lg sm:text-2xl text-red-400 font-bold ml-2 sm:ml-4"},Le={class:"w-full flex flex-row flex-wrap items-center justify-center mb-20 sm:mb-0"},Me={class:"w-full flex items-center sm:justify-center flex-wrap"},Ue={class:"w-5/12 sm:w-1/12 flex flex-col me-4 sm:me-6"},Ie=e("label",{for:"bi-semana"},"Ano",-1),Ae=e("option",{value:"0",selected:""},"Selecione",-1),Oe=["value"],ze={class:"w-5/12 sm:w-[20%] flex flex-col me-4 sm:me-6"},Ne=e("label",{for:"bi-semana"},"Bi-Semana",-1),Ge=["disabled"],Fe=e("option",{value:"0",selected:"",disabled:""},"Selecione",-1),Ze=["value"],qe={class:"w-full sm:w-1/12 flex flex-col me-4 sm:me-6"},He=e("label",{for:"status"},"Status",-1),We=["disabled"],Je=e("option",{value:"0"},"Todos",-1),Ke=e("option",{value:"1"},"Disponível",-1),Qe=e("option",{value:"2"},"Reservado",-1),Xe=[Je,Ke,Qe],Ye={class:"w-full sm:w-4/12 flex flex-col sm:-mt-4 me-4 sm:me-6"},es=e("label",{class:"typo__label"},"Identificação",-1),ss={class:"w-full flex"},ts={class:"w-9/12 me-4"},as={class:"w-2/12"},ls={class:"w-full flex items-center sm:justify-center flex-wrap"},os={class:"w-5/12 sm:w-[15%] flex flex-col me-4 sm:me-6"},is=e("label",{for:"cidades"},"Cidades",-1),ns=["disabled"],ds=e("option",{value:"0",selectedd:""},"Todas as Cidades",-1),cs=["value"],rs={class:"w-5/12 sm:w-[13%] flex flex-col me-4 sm:me-6"},us=e("label",{for:"regioes"},"Regiões",-1),ms=["disabled"],vs=e("option",{value:"0",selected:""},"Todas as Regiões",-1),fs=["value"],_s={class:"w-full sm:w-[20%] flex flex-col me-4 sm:me-6"},bs=e("label",{for:"bairros"},"Bairros",-1),ps=["disabled"],hs=e("option",{value:"0",selected:""},"Todos os Bairros",-1),xs=["value"],ws={class:"space-x-4 mt-3.5 mb-2"},gs={class:"dropdown"},ks={key:0,tabindex:"0",class:"w-fit botao flex items-center bg-green-700 hover:bg-green-500 px-2 py-[0.7rem]"},ys=e("p",{id:"envia_lista"},"Enviar Lista",-1),Cs={tabindex:"0",class:"w-56 -ml-20 sm:-ml-10 dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box mt-4"},Ps=e("li",null,[e("a",null,"Envio por Email")],-1),Bs={class:"card w-full max-h-[85%] bg-base-100 shadow-xl overflow-auto rounded-md"},Rs={class:"card-body pt-1 sm:pt-2"},js={class:"w-full flex flex-col flex-wrap sm:flex-row justify-center"},Ds=["id","onClick"],$s={class:"flex justify-between"},Vs={key:0,class:"w-10 ms-4 sm:w-14 sm:hover:w-20 transition-all duration-500",src:xe,alt:"Painel Nobre",title:"Painel Nobre"},Ss={key:1,class:"w-10 ms-4 sm:w-14 sm:hover:w-20 transition-all duration-500",src:we,alt:"Painel Convêncional",title:"Painel Convêncional"},Ts={class:"text-xs sm:card-title text-red-500"},Es={class:"w-full flex justify-end"},Ls={class:"w-full flex flex-col items-center"},Ms={class:"w-full mb-4 sm:-ml-4"},Us=["src"],Is={class:"w-full sm:w-11/12 flex justify-center flex-wrap"},As={class:"w-full flex justify-between sm:justify-between flex-wrap space-y-4"},Os={class:"w-full flex flex-wrap justify-between sm:justify-between"},zs={class:"text-xs sm:card-title"},Ns={class:"text-xs flex sm:card-title hover:text-red-700"},Gs=["href"],Fs=e("img",{class:"w-6 ms-4 sm:w-10 sm:hover:w-14 transition-all duration-500",src:ge,alt:"Mapa"},null,-1),Zs=[Fs],qs={class:"w-full flex flex-wrap justify-between sm:justify-between"},Hs={class:"text-xs sm:card-title"},Ws={class:"w-full flex justify-center flex-wrap space-y-2 mb-4"},Js=e("button",{class:"w-11/12 sm:w-10/12 botao bg-sky-700 hover:bg-sky-500"},"Detalhes",-1),Ks=["onClick"],Qs=["onClick"],Xs=e("input",{type:"checkbox",id:"modal-reserva",class:"modal-toggle"},null,-1),Ys={class:"modal flex items-end md:items-center"},et={class:"modal-box"},st={class:"flex mb-4"},tt=e("h3",{class:"font-bold text-lg"},"Reservar Painel:",-1),at={class:"font-bold text-lg ml-2 text-red-500"},lt={class:"w-full flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-8"},ot={class:"w-7/12 flex flex-col"},it=e("span",{class:"label-text ml-1"},"Bi-semana",-1),nt={name:"",id:"",class:"select select-bordered",disabled:""},dt=["value"],ct={class:"w-full sm:w-6/12 flex flex-col me-4"},rt=e("span",{class:"label-text ml-1"},"Cliente",-1),ut=["disabled"],mt=e("option",{value:"0",selected:""},"Selecione o cliente",-1),vt=["value"],ft={class:"w-full sm:w-5/12 flex flex-col"},_t=e("span",{class:"label-text ml-1"},"Campanha",-1),bt=["disabled"],pt={class:"w-full flex flex-col"},ht=e("span",{class:"label-text ml-1"},"Mensagem",-1),xt=["disabled"],wt={class:"w-full flex flex-col"},gt={class:"form-control"},kt={class:"cursor-pointer"},yt=e("span",{class:"label-text text-lg sm:text-xl me-4"},"Existe P. I. para esta reserva?",-1),Ct=["disabled"],Pt={class:"modal-action"},Bt={method:"dialog",class:"modal-box bg-white"},Rt=e("h3",{class:"font-black text-2xl text-red-700 animate-pulse duration-200 text-center"},"ATENÇÃO!",-1),jt=e("p",{class:"py-4"},"Ao Marcar que existe uma P. I. para esta reserva não será mais possível alterá-la!",-1),Dt=e("p",{class:"py-4"},"Confirme somente se tiver certeza da reserva.",-1),$t={class:"ModalAddPain-action"},Vt={class:"w-full flex justify-center space-x-4"},Ht={__name:"ReservaPaineis",props:["ambiente","reservas","anos","paineis","clientes","bisemanas","cidades","regioes","bairros","whatsapp"],setup(U){const h=U,I=l(!0),G=l(""),j=l([]),m=l([]),x=l([]),f=l([]),k=l(h.paineis),F=te([]),Z=l(""),y=l("");l("");const A=l(!0),q=l(!0),H=l(!0),W=l(!0),D=l(0),r=l(0),w=l(0),$=l(0),C=l(0),V=l(0);l({});const J=l(0),K=l(0),Q=l(0),P=l(""),_=l(!1),X=l(null),S=l(!1),O=l(!1),c=te({cliente:0,campanha:"",observ:""}),Y=ve(()=>Object.values(h.bisemanas).filter(t=>t.id===r.value));fe(()=>{ue()});function le(){axios.post("/GetBisemanas",{bisemana:D.value}).then(a=>{J.value=Object.values(a.data),A.value=!1,r.value=0})}function oe(){axios.post("/GetRegioes",{idCid:$.value}).then(a=>{K.value=Object.values(a.data),C.value=0,V.value=0})}function ie(){axios.post("/GetBairros",{idReg:C.value}).then(a=>{Q.value=Object.values(a.data)})}function T(){r.value===0?R.error("É necessário informar uma Bi-semana"):w.value===0?R.error("É necessário informar um Status"):axios.post("/GetPaineis",{ano:D.value,bisemana:r.value,statusPainel:w.value,cidade:$.value,regiao:C.value,bairro:V.value}).then(a=>{k.value=a.data,y.value=w.value})}function ne(a){T()}function ee(a){P.value=a,Z.value=h.clientes,r.value===0&&setTimeout(()=>{R.error("É necessário infrmar a Bi-semana Primeiro")},500)}function de(a,t,s,o){const B=j.value[a];Object.values(m.value).includes(t)?(m.value.splice(m.value.indexOf(t),1),x.value.splice(x.value.indexOf(o),1),f.value.splice(f.value.indexOf(s),1),B.checked=!1):(m.value.push(t),x.value.push(o),f.value.push(s),B.checked=!0),m.value.length===0&&(x.value=[],f.value=[])}function ce(){let a=0;E(),k.value.forEach(t=>{let s=j.value[a];m.value.push(t.identificacao),x.value.push(t),f.value.push(t.id),s.checked=!0,a++})}function E(){m.value=[],f.value=[],x.value=[],j.value.forEach(t=>{t.checked=!1})}function re(){if(_.value){let a=X.value;S.value=!0,a.showModal()}}function ue(){k.value.forEach(a=>{F.push(a.identificacao)})}function me(a){axios.post("/ReservaPainel",{clienteId:c.cliente.id,outdoorId:a,bsId:r.value,campanha:c.campanha,obs:c.observ,checkPi:_.value}).then(t=>{t.data.cod===0?R.error(t.data.msg):t.data.cod==1&&(R.success(t.data.msg),c.cliente="",c.campanha="",c.observ="",_.value=!1,setTimeout(()=>{T()},500))})}function se(a){let t=document.getElementById("envia_lista");I.value=!1,axios.post("/setData",{numBs:r.value,idPaineis:f.value}).then(s=>{t.innerHTML="Carregando...",setTimeout(()=>{axios.post("/relDisponiveis",{tpEnvio:a}).then(o=>{console.log("Relatório gerado"),a=="wpp"?G.value=o.data:a=="pdf"&&window.open("/relDisponiveis","_blank"),t.innerHTML="Enviar Lista",I.value=!0}).catch(o=>{console.log("Relatório não gerado")})},2e3)}).catch(s=>{console.log("Dados não Enviados")})}function z(a){a=="t"?O.value=!0:O.value=!1}return(a,t)=>(i(),n(v,null,[g(L(be),{title:"Reservas"}),g(ke,null,{default:_e(()=>[e("div",$e,[e("div",Ve,[e("div",Se,[Te,e("h1",Ee,d(k.value.length),1)])]),e("div",Le,[e("div",Me,[e("div",Ue,[Ie,u(e("select",{class:"select-paineis",name:"ano",id:"ano","onUpdate:modelValue":t[0]||(t[0]=s=>D.value=s),onChange:t[1]||(t[1]=s=>le())},[Ae,(i(!0),n(v,null,b(U.anos,(s,o)=>(i(),n("option",{key:o,value:s.id},d(s.ano_bisemana),9,Oe))),128))],544),[[p,D.value]])]),e("div",ze,[Ne,u(e("select",{class:"select-paineis",name:"bi-semana",id:"bi-semama","onUpdate:modelValue":t[2]||(t[2]=s=>r.value=s),disabled:A.value,onChange:t[3]||(t[3]=s=>(w.value=0,q.value=!1))},[Fe,(i(!0),n(v,null,b(J.value,(s,o)=>(i(),n("option",{key:o,value:s.id},"BS: "+d(s.num_bisemana)+" "+d(new Date(s.inicio).toLocaleDateString("pt-br",{timeZone:"UTC"}))+" até "+d(new Date(s.fim).toLocaleDateString("pt-br",{timeZone:"UTC"})),9,Ze))),128))],40,Ge),[[p,r.value]])]),e("div",qe,[He,u(e("select",{class:"select-paineis",name:"status",id:"status",disabled:q.value,"onUpdate:modelValue":t[4]||(t[4]=s=>w.value=s),onChange:t[5]||(t[5]=s=>(T(),E()))},Xe,40,We),[[p,w.value]])]),e("div",Ye,[es,e("div",ss,[e("div",ts,[g(L(je),{disabled:"",modelValue:m.value,"onUpdate:modelValue":t[6]||(t[6]=s=>m.value=s),options:F,multiple:!0,"close-on-select":!0,"show-labels":!0,placeholder:"Todos"},null,8,["modelValue","options"])]),e("div",as,[e("button",{onClick:t[7]||(t[7]=s=>E()),class:"botao max-h-10 bg-red-700 hover:bg-red-500"},"Limpar")])])])]),e("div",ls,[e("div",os,[is,u(e("select",{class:"select-paineis",name:"cidades",id:"cidades",disabled:A.value,"onUpdate:modelValue":t[8]||(t[8]=s=>$.value=s),onChange:t[9]||(t[9]=s=>(H.value=!1,oe()))},[ds,(i(!0),n(v,null,b(U.cidades,(s,o)=>(i(),n("option",{key:o,value:s.id},d(s.nome),9,cs))),128))],40,ns),[[p,$.value]])]),e("div",rs,[us,u(e("select",{class:"select-paineis",name:"regioes",id:"regioes",disabled:H.value,"onUpdate:modelValue":t[10]||(t[10]=s=>C.value=s),onChange:t[11]||(t[11]=s=>(W.value=!1,ie()))},[vs,(i(!0),n(v,null,b(K.value,(s,o)=>(i(),n("option",{key:o,value:s.id},d(s.nome),9,fs))),128))],40,ms),[[p,C.value]])]),e("div",_s,[bs,u(e("select",{class:"select-paineis",name:"bairros",id:"bairros",disabled:W.value,"onUpdate:modelValue":t[12]||(t[12]=s=>V.value=s)},[hs,(i(!0),n(v,null,b(Q.value,(s,o)=>(i(),n("option",{key:o,value:s.id},d(s.nome),9,xs))),128))],8,ps),[[p,V.value]])]),e("div",ws,[e("button",{class:"botao bg-sky-700 hover:bg-sky-500",onClick:t[13]||(t[13]=s=>(T(),E()))}," Filtrar "),y.value==1?(i(),n("button",{key:0,onClick:t[14]||(t[14]=s=>ce()),class:"botao w-32 max-h-10 bg-fuchsia-700 hover:bg-fuchsia-500"}," Marcar Todos ")):M("",!0),e("div",gs,[f.value.length>0&&y.value==1?(i(),n("label",ks,[e("img",{src:De,class:N(["w-4 h-4 me-2 animate-spin",{hidden:I.value}]),alt:"spinner"},null,2),ys])):M("",!0),e("ul",Cs,[e("li",null,[e("label",{onClick:t[15]||(t[15]=s=>se("wpp")),for:"modal-wpp"},"Envio por Whatsapp")]),Ps,e("li",null,[e("label",{onClick:t[16]||(t[16]=s=>se("pdf"))},"Download do Relatório")])])])])])]),e("div",Bs,[e("div",Rs,[e("div",js,[(i(!0),n(v,null,b(k.value,(s,o)=>(i(),n("div",{key:o,class:"card w-full sm:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4"},[e("div",{class:"card-body",id:o,onClick:B=>de(o,s.identificacao,s.id,s)},[e("div",$s,[s.tipo==="1"?(i(),n("img",Vs)):(i(),n("img",Ss)),e("h2",Ts,"Identificação.: "+d(s.identificacao),1)]),e("div",Es,[e("input",{type:"checkbox",ref_for:!0,ref_key:"itemRefs",ref:j,class:"w-14 h-14 border-0 checkbox checkbox-success"},null,512)]),e("div",Ls,[e("div",Ms,[e("img",{class:"img-painel",src:L(Ce)(h.ambiente,s.image_url),alt:"Bairro"},null,8,Us)]),e("div",Is,[e("div",As,[e("div",Os,[e("h2",zs,"Bairro: "+d(s.bnome),1),e("h2",Ns,[pe("Ver Localização "),e("a",{href:L(Pe)(s.latitude,s.longitude),target:"_blank"},Zs,8,Gs)])]),e("div",qs,[e("h2",Hs,"Localização: "+d(s.logradouro)+" - "+d(s.numero),1)])])])])],8,Ds),e("div",Ws,[Js,y.value==1?(i(),n("label",{key:0,for:"modal-reserva",class:"w-11/12 sm:w-10/12 h-10 botao-modal bg-green-700 hover:bg-green-500",onClick:B=>ee(s)}," Reservar ",8,Ks)):M("",!0),y.value==2?(i(),n("label",{key:1,onClick:B=>ee(s),for:"modal-canc-reserva",class:"w-11/12 sm:w-10/12 h-10 botao-modal bg-red-700 hover:bg-red-500"}," Cancelar ",8,Qs)):M("",!0)])]))),128))])])]),Xs,e("div",Ys,[e("div",et,[e("div",st,[e("label",{for:"modal-reserva",class:"btn btn-sm btn-circle btn-ghost absolute right-2 top-2",onClick:t[17]||(t[17]=s=>c.cliente=0)},"✕"),tt,e("h3",at,"Identificação "+d(P.value.identificacao),1)]),e("form",null,[e("div",lt,[e("div",ot,[it,e("select",nt,[(i(!0),n(v,null,b(Y.value,(s,o)=>(i(),n("option",{key:o,value:s.id},"BS: "+d(s.num_bisemana)+" "+d(new Date(s.inicio).toLocaleDateString())+" até "+d(new Date(s.fim).toLocaleDateString()),9,dt))),128))])]),e("div",ct,[rt,u(e("select",{"onUpdate:modelValue":t[18]||(t[18]=s=>c.cliente=s),name:"",id:"",class:"select select-bordered",disabled:r.value==0},[mt,(i(!0),n(v,null,b(Z.value,(s,o)=>(i(),n("option",{key:o,value:s},d(s.nome_fantasia?s.nome_fantasia:s.razao_social),9,vt))),128))],8,ut),[[p,c.cliente]])]),e("div",ft,[_t,u(e("input",{"onUpdate:modelValue":t[19]||(t[19]=s=>c.campanha=s),type:"text",name:"",id:"",class:"input input-bordered",disabled:r.value==0},null,8,bt),[[ae,c.campanha]])]),e("div",pt,[ht,u(e("textarea",{"onUpdate:modelValue":t[20]||(t[20]=s=>c.observ=s),name:"",id:"",class:"textarea textarea-bordered textarea-lg",disabled:r.value==0},null,8,xt),[[ae,c.observ]])]),e("div",wt,[e("div",gt,[e("label",kt,[yt,u(e("input",{type:"checkbox","onUpdate:modelValue":t[21]||(t[21]=s=>_.value=s),onClick:t[22]||(t[22]=s=>(_.value=!_.value,re())),class:"checkbox checkbox-lg checkbox-success border-2 border-gray-400",disabled:c.cliente===0},null,8,Ct),[[he,_.value]])])])])]),e("div",Pt,[e("label",{for:"modal-reserva",class:N(["w-full botao-modal",{"bg-slate-400":r.value==0,"hover:bg-slate-400":r.value==0}]),onClick:t[23]||(t[23]=s=>me(P.value.id))},"Reservar",2)])]),e("dialog",{id:"modal_confirm",ref_key:"confPi",ref:X,class:N(["bg-transparent flex justify-center",{hidden:!S.value}])},[e("form",Bt,[Rt,jt,Dt,e("div",$t,[e("div",Vt,[e("button",{class:"w-5/12 botao-primario",onClick:t[24]||(t[24]=s=>(S.value=!1,z("t")))},"Confirmar"),e("button",{onClick:t[25]||(t[25]=s=>(_.value=!1,S.value=!1,z("f"))),class:"w-5/12 botao-danger"},"Ainda não !")])])])],2)])]),g(Be,{listaClientes:h.clientes,whatsapp:h.whatsapp,bisemana:Y.value,linkrel:G.value},null,8,["listaClientes","whatsapp","bisemana","linkrel"]),g(ye,{painel:P.value,bisemana:r.value,onAtualizaPage:ne},null,8,["painel","bisemana"]),g(Re,{openPi:O.value,cliente:c.cliente,campanha:c.campanha,painel:P.value,onClosePi:z},null,8,["openPi","cliente","campanha","painel"])])]),_:1})],64))}};export{Ht as default};