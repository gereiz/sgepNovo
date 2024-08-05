import{j as a,z as Y,h as me,x as ve,o as i,f as n,a as w,u as V,w as fe,F as v,Z as _e,b as e,t as d,m as u,y as b,p,g as ee,n as N,d as pe,v as se,X as be}from"./app-cc449fe3.js";import{_ as he,a as xe}from"./painel_conv-45a82d16.js";import{_ as we}from"./regiao-35565801.js";import{_ as ge}from"./AuthenticatedLayout-50e568ff.js";import ke from"./ModalCancelRes-16e99013.js";import ye from"./ModalWpp-692d67c7.js";import Ce from"./ModalPiRes-10114ec9.js";import{g as Pe,a as De,t as S}from"./functions-56098775.js";import{s as je}from"./vue-multiselect.esm-0ef9c773.js";/* empty css              */import"./transition-da6d0184.js";import"./XMarkIcon-6d17bc51.js";import"./toastr-38af5969.js";import"./toastr-26786df3.js";/* empty css                   */import"./html2pdf-63a74ed2.js";import"./StepOnePi-f7cf6aaa.js";import"./maska-1eacf752.js";import"./UserCircleIcon-4fef8515.js";import"./StepTwoPi-1c4d800d.js";import"./StepThreePi-e6dbbbc5.js";const Be="/build/assets/spinner-0f1bcd37.png",$e={class:"w-full h-screen pt-20 pb-32 mx-2 sm:mx-4"},Re={class:"w-full h-14 flex mb-2"},Te={class:"w-2/12 h-14 flex items-center"},Ve=e("h1",{class:"text-xl sm:text-4xl font-bold"},"Painéis",-1),Se={class:"text-lg sm:text-2xl text-red-400 font-bold ml-2 sm:ml-4"},Ee={class:"w-full flex flex-row flex-wrap items-center justify-center mb-20 sm:mb-0"},Le={class:"w-full flex items-center sm:justify-center flex-wrap"},Me={class:"w-5/12 sm:w-1/12 flex flex-col me-4 sm:me-6"},Ue=e("label",{for:"bi-semana"},"Ano",-1),Ie=e("option",{value:"0",selected:""},"Selecione",-1),ze=["value"],Oe={class:"w-5/12 sm:w-[20%] flex flex-col me-4 sm:me-6"},Ae=e("label",{for:"bi-semana"},"Bi-Semana",-1),Ne=["disabled"],Fe=e("option",{value:"0",selected:"",disabled:""},"Selecione",-1),Ge=["value"],Ze={class:"w-full sm:w-1/12 flex flex-col me-4 sm:me-6"},He=e("label",{for:"status"},"Status",-1),We=["disabled"],qe=e("option",{value:"T"},"Todos",-1),Xe=e("option",{value:"D"},"Disponível",-1),Je=e("option",{value:"R"},"Reservado",-1),Ke=[qe,Xe,Je],Qe={class:"w-full sm:w-4/12 flex flex-col sm:-mt-4 me-4 sm:me-6"},Ye=e("label",{class:"typo__label"},"Identificação",-1),es={class:"w-full flex"},ss={class:"w-9/12 me-4"},ts={class:"w-2/12"},as={class:"w-full flex items-center sm:justify-center flex-wrap"},ls={class:"w-5/12 sm:w-[15%] flex flex-col me-4 sm:me-6"},os=e("label",{for:"cidades"},"Cidades",-1),is=["disabled"],ns=e("option",{value:"0",selectedd:""},"Todas as Cidades",-1),ds=["value"],cs={class:"w-5/12 sm:w-[13%] flex flex-col me-4 sm:me-6"},rs=e("label",{for:"regioes"},"Regiões",-1),us=["disabled"],ms=e("option",{value:"0",selected:""},"Todas as Regiões",-1),vs=["value"],fs={class:"w-full sm:w-[20%] flex flex-col me-4 sm:me-6"},_s=e("label",{for:"bairros"},"Bairros",-1),ps=["disabled"],bs=e("option",{value:"0",selected:""},"Todos os Bairros",-1),hs=["value"],xs={class:"space-x-4 mt-3.5 mb-2"},ws={class:"dropdown"},gs={key:0,tabindex:"0",class:"w-fit botao flex items-center bg-green-700 hover:bg-green-500 px-2 py-[0.7rem]"},ks=e("p",{id:"envia_lista"},"Enviar Lista",-1),ys={tabindex:"0",class:"w-56 -ml-20 sm:-ml-10 dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box mt-4"},Cs=e("li",null,[e("a",null,"Envio por Email")],-1),Ps={class:"card w-full max-h-[85%] bg-base-100 shadow-xl overflow-auto rounded-md"},Ds={class:"card-body pt-1 sm:pt-2"},js={class:"w-full flex flex-col flex-wrap sm:flex-row justify-center"},Bs=["id","onClick"],$s={class:"flex justify-between"},Rs={key:0,class:"w-10 ms-4 sm:w-14 sm:hover:w-20 transition-all duration-500",src:he,alt:"Painel Nobre",title:"Painel Nobre"},Ts={key:1,class:"w-10 ms-4 sm:w-14 sm:hover:w-20 transition-all duration-500",src:xe,alt:"Painel Convêncional",title:"Painel Convêncional"},Vs={class:"text-xs sm:card-title text-red-500"},Ss={class:"w-full flex justify-end"},Es={class:"w-full flex flex-col items-center"},Ls={class:"w-full mb-4 sm:-ml-4"},Ms=["src"],Us={class:"w-full sm:w-11/12 flex justify-center flex-wrap"},Is={class:"w-full flex justify-between sm:justify-between flex-wrap space-y-4"},zs={class:"w-full flex flex-wrap justify-between sm:justify-between"},Os={class:"text-xs sm:card-title"},As={class:"text-xs flex sm:card-title hover:text-red-700"},Ns=["href"],Fs=e("img",{class:"w-6 ms-4 sm:w-10 sm:hover:w-14 transition-all duration-500",src:we,alt:"Mapa"},null,-1),Gs=[Fs],Zs={class:"w-full flex flex-wrap justify-between sm:justify-between"},Hs={class:"text-xs sm:card-title"},Ws=e("div",{class:"w-full flex justify-center flex-wrap space-y-2 mb-4"},[e("button",{class:"w-11/12 sm:w-10/12 botao bg-sky-700 hover:bg-sky-500"},"Detalhes")],-1),qs=e("input",{type:"checkbox",id:"modal-reserva",class:"modal-toggle"},null,-1),Xs={class:"modal flex items-end md:items-center"},Js={class:"modal-box"},Ks={class:"flex mb-4"},Qs=e("h3",{class:"font-bold text-lg"},"Reservar Painel:",-1),Ys={class:"font-bold text-lg ml-2 text-red-500"},et={class:"w-full flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-8"},st={class:"w-7/12 flex flex-col"},tt=e("span",{class:"label-text ml-1"},"Bi-semana",-1),at={name:"",id:"",class:"select select-bordered",disabled:""},lt=["value"],ot={class:"w-full sm:w-6/12 flex flex-col me-4"},it=e("span",{class:"label-text ml-1"},"Cliente",-1),nt=["disabled"],dt=e("option",{value:"0",selected:""},"Selecione o cliente",-1),ct=["value"],rt={class:"w-full sm:w-5/12 flex flex-col"},ut=e("span",{class:"label-text ml-1"},"Campanha",-1),mt=["disabled"],vt={class:"w-full flex flex-col"},ft=e("span",{class:"label-text ml-1"},"Mensagem",-1),_t=["disabled"],pt={class:"w-full flex flex-col"},bt={class:"form-control"},ht={class:"cursor-pointer"},xt=e("span",{class:"label-text text-lg sm:text-xl me-4"},"Existe P. I. para esta reserva?",-1),wt=["disabled"],gt={class:"modal-action"},kt={method:"dialog",class:"modal-box bg-white"},yt=e("h3",{class:"font-black text-2xl text-red-700 animate-pulse duration-200 text-center"},"ATENÇÃO!",-1),Ct=e("p",{class:"py-4"},"Ao Marcar que existe uma P. I. para esta reserva não será mais possível alterá-la!",-1),Pt=e("p",{class:"py-4"},"Confirme somente se tiver certeza da reserva.",-1),Dt={class:"ModalAddPain-action"},jt={class:"w-full flex justify-center space-x-4"},Xt={__name:"DispPaineis",props:["ambiente","reservas","anos","paineis","clientes","bisemanas","cidades","regioes","bairros","whatsapp"],setup(E){const g=E,L=a(!0),F=a(""),C=a([]),m=a([]),h=a([]),f=a([]),k=a(g.paineis),G=Y([]),te=a(""),M=a("");a("");const U=a(!0),Z=a(!0),H=a(!0),W=a(!0),P=a(0),r=a(0),x=a("T"),D=a(0),y=a(0),j=a(0);a({});const q=a(0),X=a(0),J=a(0),B=a(""),_=a(!1),K=a(null),$=a(!1),I=a(!1),c=Y({cliente:0,campanha:"",observ:""}),z=me(()=>Object.values(g.bisemanas).filter(t=>t.id===r.value));ve(()=>{re()});function ae(){axios.post("/getBisemanass",{bisemana:P.value}).then(l=>{q.value=Object.values(l.data),U.value=!1,r.value=0})}function le(){axios.post("/GetRegioes",{idCid:D.value}).then(l=>{X.value=Object.values(l.data),y.value=0,j.value=0})}function oe(){axios.post("/GetBairros",{idReg:y.value}).then(l=>{J.value=Object.values(l.data)})}function R(){r.value===0?S.error("É necessário informar uma Bi-semana"):x.value==="T"?S.error("É necessário informar um Status"):axios.post("/GetPaineis",{ano:P.value,bisemana:r.value,statusPainel:x.value,cidade:D.value,regiao:y.value,bairro:j.value}).then(l=>{k.value=l.data,M.value=x.value})}function ie(l){R()}function ne(l,t,s,o){const A=C.value[l];Object.values(m.value).includes(t)?(m.value.splice(m.value.indexOf(t),1),h.value.splice(h.value.indexOf(o),1),f.value.splice(f.value.indexOf(s),1),A.checked=!1):(m.value.push(t),h.value.push(o),f.value.push(s),A.checked=!0),m.value.length===0&&(h.value=[],f.value=[])}function de(){let l=0;T(),k.value.forEach(t=>{let s=C.value[l];m.value.push(t.identificacao),h.value.push(t),f.value.push(t.id),s.checked=!0,l++})}function T(){m.value=[],f.value=[],h.value=[],C.value.forEach(t=>{t.checked=!1})}function ce(){if(_.value){let l=K.value;$.value=!0,l.showModal()}}function re(){k.value.forEach(l=>{G.push(l.identificacao)})}function ue(l){axios.post("/ReservaPainel",{clienteId:c.cliente.id,outdoorId:l,bsId:r.value,campanha:c.campanha,obs:c.observ,checkPi:_.value}).then(t=>{t.data.cod===0?S.error(t.data.msg):t.data.cod==1&&(S.success(t.data.msg),c.cliente="",c.campanha="",c.observ="",_.value=!1,setTimeout(()=>{R()},500))})}function Q(l){let t=document.getElementById("envia_lista");L.value=!1,axios.post("/setData",{numBs:r.value,idPaineis:f.value}).then(s=>{t.innerHTML="Carregando...",setTimeout(()=>{axios.post("/relDisponiveis",{tpEnvio:l}).then(o=>{console.log("Relatório gerado"),l=="wpp"?F.value=o.data:l=="pdf"&&window.open("/relDisponiveis","_blank"),t.innerHTML="Enviar Lista",L.value=!0}).catch(o=>{console.log("Relatório não gerado")})},2e3)}).catch(s=>{console.log("Dados não Enviados")})}function O(l){l=="t"?I.value=!0:I.value=!1}return(l,t)=>(i(),n(v,null,[w(V(_e),{title:"Reservas"}),w(ge,null,{default:fe(()=>[e("div",$e,[e("div",Re,[e("div",Te,[Ve,e("h1",Se,d(k.value.length),1)])]),e("div",Ee,[e("div",Le,[e("div",Me,[Ue,u(e("select",{class:"select-paineis",name:"ano",id:"ano","onUpdate:modelValue":t[0]||(t[0]=s=>P.value=s),onChange:t[1]||(t[1]=s=>ae())},[Ie,(i(!0),n(v,null,p(E.anos,(s,o)=>(i(),n("option",{key:o,value:s.id},d(s.ano_bisemana),9,ze))),128))],544),[[b,P.value]])]),e("div",Oe,[Ae,u(e("select",{class:"select-paineis",name:"bi-semana",id:"bi-semama","onUpdate:modelValue":t[2]||(t[2]=s=>r.value=s),disabled:U.value,onChange:t[3]||(t[3]=s=>(x.value="T",Z.value=!1))},[Fe,(i(!0),n(v,null,p(q.value,(s,o)=>(i(),n("option",{key:o,value:s.id},"BS: "+d(s.num_bisemana)+" "+d(new Date(s.inicio).toLocaleDateString("pt-br",{timeZone:"UTC"}))+" até "+d(new Date(s.fim).toLocaleDateString("pt-br",{timeZone:"UTC"})),9,Ge))),128))],40,Ne),[[b,r.value]])]),e("div",Ze,[He,u(e("select",{class:"select-paineis",name:"status",id:"status",disabled:Z.value,"onUpdate:modelValue":t[4]||(t[4]=s=>x.value=s),onChange:t[5]||(t[5]=s=>(R(),T()))},Ke,40,We),[[b,x.value]])]),e("div",Qe,[Ye,e("div",es,[e("div",ss,[w(V(je),{disabled:"",modelValue:m.value,"onUpdate:modelValue":t[6]||(t[6]=s=>m.value=s),options:G,multiple:!0,"close-on-select":!0,"show-labels":!0,placeholder:"Todos"},null,8,["modelValue","options"])]),e("div",ts,[e("button",{onClick:t[7]||(t[7]=s=>T()),class:"botao max-h-10 bg-red-700 hover:bg-red-500"},"Limpar")])])])]),e("div",as,[e("div",ls,[os,u(e("select",{class:"select-paineis",name:"cidades",id:"cidades",disabled:U.value,"onUpdate:modelValue":t[8]||(t[8]=s=>D.value=s),onChange:t[9]||(t[9]=s=>(H.value=!1,le()))},[ns,(i(!0),n(v,null,p(E.cidades,(s,o)=>(i(),n("option",{key:o,value:s.id},d(s.nome),9,ds))),128))],40,is),[[b,D.value]])]),e("div",cs,[rs,u(e("select",{class:"select-paineis",name:"regioes",id:"regioes",disabled:H.value,"onUpdate:modelValue":t[10]||(t[10]=s=>y.value=s),onChange:t[11]||(t[11]=s=>(W.value=!1,oe()))},[ms,(i(!0),n(v,null,p(X.value,(s,o)=>(i(),n("option",{key:o,value:s.id},d(s.nome),9,vs))),128))],40,us),[[b,y.value]])]),e("div",fs,[_s,u(e("select",{class:"select-paineis",name:"bairros",id:"bairros",disabled:W.value,"onUpdate:modelValue":t[12]||(t[12]=s=>j.value=s)},[bs,(i(!0),n(v,null,p(J.value,(s,o)=>(i(),n("option",{key:o,value:s.id},d(s.nome),9,hs))),128))],8,ps),[[b,j.value]])]),e("div",xs,[e("button",{class:"botao bg-sky-700 hover:bg-sky-500",onClick:t[13]||(t[13]=s=>(R(),T()))}," Filtrar "),M.value=="D"?(i(),n("button",{key:0,onClick:t[14]||(t[14]=s=>de()),class:"botao w-32 max-h-10 bg-fuchsia-700 hover:bg-fuchsia-500"}," Marcar Todos ")):ee("",!0),e("div",ws,[f.value.length>0&&M.value=="D"?(i(),n("label",gs,[e("img",{src:Be,class:N(["w-4 h-4 me-2 animate-spin",{hidden:L.value}]),alt:"spinner"},null,2),ks])):ee("",!0),e("ul",ys,[e("li",null,[e("label",{onClick:t[15]||(t[15]=s=>Q("wpp")),for:"modal-wpp"},"Envio por Whatsapp")]),Cs,e("li",null,[e("label",{onClick:t[16]||(t[16]=s=>Q("pdf"))},"Download do Relatório")])])])])])]),e("div",Ps,[e("div",Ds,[e("div",js,[(i(!0),n(v,null,p(k.value,(s,o)=>(i(),n("div",{key:o,class:"card w-full sm:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 sm:mr-4"},[e("div",{class:"card-body",id:o,onClick:A=>ne(o,s.identificacao,s.id,s)},[e("div",$s,[s.tipo==="1"?(i(),n("img",Rs)):(i(),n("img",Ts)),e("h2",Vs,"Identificação.: "+d(s.identificacao),1)]),e("div",Ss,[e("input",{type:"checkbox",ref_for:!0,ref_key:"itemRefs",ref:C,class:"w-14 h-14 border-0 checkbox checkbox-success"},null,512)]),e("div",Es,[e("div",Ls,[e("img",{class:"img-painel",src:V(Pe)(g.ambiente,s.image_url),alt:"Bairro"},null,8,Ms)]),e("div",Us,[e("div",Is,[e("div",zs,[e("h2",Os,"Bairro: "+d(s.bnome),1),e("h2",As,[pe("Ver Localização "),e("a",{href:V(De)(s.latitude,s.longitude),target:"_blank"},Gs,8,Ns)])]),e("div",Zs,[e("h2",Hs,"Localização: "+d(s.logradouro)+" - "+d(s.numero),1)])])])])],8,Bs),Ws]))),128))])])]),qs,e("div",Xs,[e("div",Js,[e("div",Ks,[e("label",{for:"modal-reserva",class:"btn btn-sm btn-circle btn-ghost absolute right-2 top-2",onClick:t[17]||(t[17]=s=>c.cliente=0)},"✕"),Qs,e("h3",Ys,"Identificação "+d(B.value.identificacao),1)]),e("form",null,[e("div",et,[e("div",st,[tt,e("select",at,[(i(!0),n(v,null,p(z.value,(s,o)=>(i(),n("option",{key:o,value:s.id},"BS: "+d(s.num_bisemana)+" "+d(new Date(s.inicio).toLocaleDateString())+" até "+d(new Date(s.fim).toLocaleDateString()),9,lt))),128))])]),e("div",ot,[it,u(e("select",{"onUpdate:modelValue":t[18]||(t[18]=s=>c.cliente=s),name:"",id:"",class:"select select-bordered",disabled:r.value==0},[dt,(i(!0),n(v,null,p(te.value,(s,o)=>(i(),n("option",{key:o,value:s},d(s.nome_fantasia?s.nome_fantasia:s.razao_social),9,ct))),128))],8,nt),[[b,c.cliente]])]),e("div",rt,[ut,u(e("input",{"onUpdate:modelValue":t[19]||(t[19]=s=>c.campanha=s),type:"text",name:"",id:"",class:"input input-bordered",disabled:r.value==0},null,8,mt),[[se,c.campanha]])]),e("div",vt,[ft,u(e("textarea",{"onUpdate:modelValue":t[20]||(t[20]=s=>c.observ=s),name:"",id:"",class:"textarea textarea-bordered textarea-lg",disabled:r.value==0},null,8,_t),[[se,c.observ]])]),e("div",pt,[e("div",bt,[e("label",ht,[xt,u(e("input",{type:"checkbox","onUpdate:modelValue":t[21]||(t[21]=s=>_.value=s),onClick:t[22]||(t[22]=s=>(_.value=!_.value,ce())),class:"checkbox checkbox-lg checkbox-success border-2 border-gray-400",disabled:c.cliente===0},null,8,wt),[[be,_.value]])])])])]),e("div",gt,[e("label",{for:"modal-reserva",class:N(["w-full botao-modal",{"bg-slate-400":r.value==0,"hover:bg-slate-400":r.value==0}]),onClick:t[23]||(t[23]=s=>ue(B.value.id))},"Reservar",2)])]),e("dialog",{id:"modal_confirm",ref_key:"confPi",ref:K,class:N(["bg-transparent flex justify-center",{hidden:!$.value}])},[e("form",kt,[yt,Ct,Pt,e("div",Dt,[e("div",jt,[e("button",{class:"w-5/12 botao-primario",onClick:t[24]||(t[24]=s=>($.value=!1,O("t")))},"Confirmar"),e("button",{onClick:t[25]||(t[25]=s=>(_.value=!1,$.value=!1,O("f"))),class:"w-5/12 botao-danger"},"Ainda não !")])])])],2)])]),w(ye,{listaClientes:g.clientes,whatsapp:g.whatsapp,bisemana:z.value,linkrel:F.value},null,8,["listaClientes","whatsapp","bisemana","linkrel"]),w(ke,{painel:B.value,bisemana:r.value,onAtualizaPage:ie},null,8,["painel","bisemana"]),w(Ce,{openPi:I.value,cliente:c.cliente,campanha:c.campanha,bisemana:z.value,painel:B.value,onClosePi:O},null,8,["openPi","cliente","campanha","bisemana","painel"])])]),_:1})],64))}};export{Xt as default};
