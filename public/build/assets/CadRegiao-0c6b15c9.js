import{j as v,p as w,h as D,o as a,f as i,a as R,u as N,w as O,F as b,Z as V,b as e,t as n,k as c,v as g,l as y,e as k,q,O as x}from"./app-c0191d23.js";import{_ as E}from"./regiao-35565801.js";import{_ as F}from"./AuthenticatedLayout-349afb90.js";import{u as $}from"./toastr-d9b552d4.js";import"./_plugin-vue_export-helper-c27b6911.js";import"./toastr.min-5509ae66.js";const U={class:"w-full h-screen pt-24 pb-32 mx-2 md:mx-4"},B={class:"w-full h-14 flex mb-2"},L={class:"w-2/12 h-14 flex items-center"},M=e("h1",{class:"text-xl md:text-4xl font-bold"},"Regiões",-1),T={class:"text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4"},z=e("div",{class:"w-10/12 flex justify-end"},[e("label",{for:"modal-regiao-add",class:"w-28 botao-modal text-sm"},"+ Nova Região")],-1),I={class:"w-full md:w-4/12"},P={class:"card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md"},Z={class:"card-body"},G={class:"w-full flex flex-col flex-wrap md:flex-row justify-center"},H={class:"card-body"},J={class:"w-full flex justify-between flex-wrap mb-4"},K={class:"w-full flex justify-between"},Q={class:"text-xs md:card-title"},W={class:"text-xs md:text-base font-bold text-zinc-400"},X=e("div",{class:"w-full flex justify-center md:justify-start mb-4 md:mb-0"},[e("img",{class:"w-20 md:w-32",src:E,alt:"Regiao"})],-1),Y={class:"w-full card-actions justify-center md:justify-end"},ee=["onClick"],oe=e("input",{type:"checkbox",id:"modal-regiao-add",class:"modal-toggle"},null,-1),se={for:"modal-regiao-add",class:"modal modal-bottom sm:modal-middle cursor-pointer"},te={class:"modal-box relative",for:""},de=e("h3",{class:"font-bold text-lg"},"Adicionar Nova Região",-1),le=["onSubmit"],ae={class:"w-full flex"},ie={class:"w-full flex flex-col"},ne=e("span",{class:"label-text ml-1"},"Nome",-1),ce={class:"w-full flex flex-col"},re=e("span",{class:"label-text ml-1"},"Cidade",-1),me=e("option",{value:"0",disabled:"",selected:""},"Seleicione a Região",-1),ue=["value"],_e={class:"modal-action"},fe=e("input",{type:"checkbox",id:"modal-regiao-edit",class:"modal-toggle"},null,-1),be={for:"modal-regiao-edit",class:"modal modal-bottom sm:modal-middle cursor-pointer"},ge={class:"modal-box relative",for:""},xe={class:"h-12 border-b-2 font-bold text-center md:text-start"},pe={class:""},he={class:"h-full flex flex-col border-b-2 font-bold space-x-4 space-y-4 pb-2"},ve={class:"flex space-x-4"},we={class:"w-full"},Re=["onSubmit"],ye={class:"flex mt-2"},ke={class:"w-full flex flex-col"},je=e("span",{class:"label-text ml-1"},"Nome",-1),Ce=e("span",{class:"card-title justify-center mb-4"},"ou",-1),Ee={__name:"CadRegiao",props:["regioes","cidades","errors"],setup(r){const j=r,l=$(),m=v(""),u=v(""),d=w({nome:"",cidade_id:0}),t=w({nome_edit:"",id_regiao:"",id_cidade:""});function C(_,s,o){m.value=o,t.nome_edit=o,t.id_regiao=_,t.id_cidade=s}function p(){d.nome.length<3?l.error("O nome da Região deve ter no mínimo 3 caracteres!"):d.cidade_id==0?l.error("A Região deve pertencer a uma Cidade!"):(x.post("/AddRegiao",this.formRegiaoAdd),l.success("Região "+d.nome+" cadastrada!"),d.nome="",d.cidade_id=0)}function h(){t.nome_edit.length<3?l.error("O nome da Região deve ter no mínimo 3 caracteres!"):(x.post("/EditRegiao",t),l.success("Região "+t.nome_edit+" editada para "+t.nome_edit+" !"))}function S(){x.post("/DelRegiao",t),l.success("Região "+m.value+" excluída!")}const A=D(()=>Object.values(j.regioes).filter(s=>s.nome.toLowerCase().indexOf(u.value.toLowerCase())>-1));return(_,s)=>(a(),i(b,null,[R(N(V),{title:"Regiões"}),R(F,null,{default:O(()=>[e("div",U,[e("div",B,[e("div",L,[M,e("h1",T,n(r.regioes.length),1)]),z]),e("div",I,[c(e("input",{"onUpdate:modelValue":s[0]||(s[0]=o=>u.value=o),placeholder:"Pesquisar Região",class:"w-full h-10 input input-bordered rounded-none mb-4",type:"text",name:"pesquisar",id:"pesquisar"},null,512),[[g,u.value]])]),e("div",P,[e("div",Z,[e("div",G,[(a(!0),i(b,null,y(A.value,(o,f)=>(a(),i("div",{key:f,class:"card w-full md:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 md:mr-4"},[e("div",H,[e("div",J,[e("div",K,[e("h2",Q,"Região.: "+n(o.nome),1),e("h2",W,"ID: "+n(o.id),1)])]),X,e("div",Y,[e("label",{for:"modal-regiao-edit",onClick:Se=>C(o.id,o.cidade_id,o.nome),class:"w-full md:w-28 botao-modal"},"Ações",8,ee)])])]))),128))])])]),oe,e("label",se,[e("label",te,[de,e("form",{onSubmit:k(p,["prevent"])},[e("div",ae,[e("div",ie,[ne,c(e("input",{"onUpdate:modelValue":s[1]||(s[1]=o=>d.nome=o),class:"w-11/12 input input-bordered mb-4",type:"text",name:"nome_add",id:"nome_add"},null,512),[[g,d.nome]])]),e("div",ce,[re,c(e("select",{"onUpdate:modelValue":s[2]||(s[2]=o=>d.cidade_id=o),name:"cidade_id",id:"cidade_id",class:"select select-bordered"},[me,(a(!0),i(b,null,y(r.cidades,(o,f)=>(a(),i("option",{key:f,value:o.id},n(o.nome),9,ue))),128))],512),[[q,d.cidade_id]])])]),e("div",_e,[e("label",{onClick:s[3]||(s[3]=o=>p()),for:"modal-regiao-add",class:"botao-modal"},"Salvar")])],40,le)])]),fe,e("label",be,[e("label",ge,[e("div",xe,[e("h1",pe,"Dados da Região: "+n(m.value),1)]),e("div",he,[e("div",ve,[e("div",we,[e("form",{onSubmit:k(h,["prevent"])},[e("div",ye,[e("div",ke,[je,c(e("input",{"onUpdate:modelValue":s[4]||(s[4]=o=>t.nome_edit=o),class:"w-full input input-bordered mb-4",type:"text"},null,512),[[g,t.nome_edit]])])]),e("label",{onClick:s[5]||(s[5]=o=>h()),for:"modal-regiao-edit",class:"botao-modal w-full bg-amber-500 hover:bg-amber-700 mb-4"},"Salvar Edição")],40,Re),Ce,e("label",{onClick:s[6]||(s[6]=o=>S()),for:"modal-regiao-edit",class:"botao-modal w-full bg-red-500 hover:bg-red-800"},"Excluir Região")])])])])])])]),_:1})],64))}};export{Ee as default};
