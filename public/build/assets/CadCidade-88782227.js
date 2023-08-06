import{j as w,p as C,h as A,o as a,f as i,a as g,u as D,w as N,F as b,Z as O,b as e,t as n,k as c,v as x,l as y,e as k,q as U,O as p}from"./app-c06e8cae.js";import{_ as V}from"./AuthenticatedLayout-833125bf.js";import{u as E}from"./toastr-33ac4744.js";import"./_plugin-vue_export-helper-c27b6911.js";import"./toastr.min-7c19c43c.js";const $="/build/assets/cidade-3beb767b.png",B={class:"w-full h-screen pt-24 pb-32 mx-2 md:mx-4"},L={class:"w-full h-14 flex mb-2"},M={class:"w-4/12 h-14 flex items-center"},R=e("h1",{class:"text-xl md:text-4xl font-bold"},"Cidades ",-1),T={class:"text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4"},z=e("div",{class:"w-10/12 flex justify-end"},[e("label",{for:"modal-cidade-add",class:"w-28 botao-modal text-sm"},"+ Nova Cidade")],-1),I={class:"w-full md:w-4/12"},P={class:"card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md"},Z={class:"card-body"},G={class:"w-full flex flex-col flex-wrap md:flex-row justify-center"},H={class:"card-body"},J={class:"w-full flex justify-between flex-wrap mb-4"},K={class:"w-full flex justify-between"},Q={class:"text-xs md:card-title"},W={class:"text-xs md:text-base font-bold text-zinc-400"},X=e("div",{class:"w-full flex justify-center md:justify-start mb-4 md:mb-0"},[e("img",{class:"w-20 md:w-32",src:$,alt:"Regiao"})],-1),Y={class:"w-full card-actions justify-center md:justify-end"},ee=["onClick"],de=e("input",{type:"checkbox",id:"modal-cidade-add",class:"modal-toggle"},null,-1),se={for:"modal-cidade-add",class:"modal modal-bottom sm:modal-middle cursor-pointer"},te={class:"modal-box relative",for:""},oe=e("h3",{class:"font-bold text-lg"},"Adicionar Nova Cidade",-1),le=["onSubmit"],ae={class:"w-full flex"},ie={class:"w-full flex flex-col"},ne=e("span",{class:"label-text ml-1"},"Nome",-1),ce={class:"w-full flex flex-col"},re=e("span",{class:"label-text ml-1"},"UF",-1),me=e("option",{value:"0",disabled:"",required:""},"Seleicione a Cidade",-1),ue=["value"],fe={class:"modal-action"},_e=e("input",{type:"checkbox",id:"modal-cidade-edit",class:"modal-toggle"},null,-1),be={for:"modal-cidade-edit",class:"modal modal-bottom sm:modal-middle cursor-pointer"},xe={class:"modal-box relative",for:""},pe={class:"h-12 border-b-2 font-bold text-center md:text-start"},he={class:""},ve={class:"h-full flex flex-col border-b-2 font-bold space-x-4 space-y-4 pb-2"},we={class:"flex space-x-4"},Ce={class:"w-full"},ge=["onSubmit"],ye={class:"flex mt-2"},ke={class:"w-full flex flex-col"},je=e("span",{class:"label-text ml-1"},"Nome",-1),Se=e("span",{class:"card-title justify-center mb-4"},"ou",-1),Ue={__name:"CadCidade",props:["cidades","uf","errors"],setup(r){const j=r,l=E(),m=w(""),u=w(""),o=C({nome:"",uf_id:0}),t=C({nome_edit:"",id_cidade:""});function S(f,s,d){m.value=d,t.nome_edit=d,t.id_cidade=f,t.id_uf=s}function h(){o.nome.length<3?l.error("O nome da Cidade deve ter no mínimo 3 caracteres!"):o.uf_id==0?l.error("A Cidade deve pertener a uma UF!"):(p.post("/AddCidade",this.formCidadeAdd),l.success("Cidade "+o.nome+" cadastrada!"),o.nome="",o.uf_id=0)}function v(){t.nome_edit.length<3?l.error("O nome da Cidade deve ter no mínimo 3 caracteres!"):(p.post("/EditCidade",t),l.success("Cidade "+t.nome_edit+" editada para "+t.nome_edit+" !"))}function F(){p.post("/DelCidade",t),l.success("Cidade "+m.value+" excluída!")}const q=A(()=>Object.values(j.cidades).filter(s=>s.nome.toLowerCase().indexOf(u.value.toLowerCase())>-1));return(f,s)=>(a(),i(b,null,[g(D(O),{title:"Cidades"}),g(V,null,{default:N(()=>[e("div",B,[e("div",L,[e("div",M,[R,e("h1",T,n(r.cidades.length),1)]),z]),e("div",I,[c(e("input",{"onUpdate:modelValue":s[0]||(s[0]=d=>u.value=d),placeholder:"Pesquisar Cidade",class:"w-full h-10 input input-bordered rounded-none mb-4",type:"text",name:"pesquisar",id:"pesquisar"},null,512),[[x,u.value]])]),e("div",P,[e("div",Z,[e("div",G,[(a(!0),i(b,null,y(q.value,(d,_)=>(a(),i("div",{key:_,class:"card w-full md:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 md:mr-4"},[e("div",H,[e("div",J,[e("div",K,[e("h2",Q,"Cidade.: "+n(d.nome),1),e("h2",W,"ID: "+n(d.id),1)])]),X,e("div",Y,[e("label",{for:"modal-cidade-edit",onClick:Fe=>S(d.id,d.uf_id,d.nome),class:"w-full md:w-28 botao-modal"},"Ações",8,ee)])])]))),128))])])]),de,e("label",se,[e("label",te,[oe,e("form",{onSubmit:k(h,["prevent"])},[e("div",ae,[e("div",ie,[ne,c(e("input",{"onUpdate:modelValue":s[1]||(s[1]=d=>o.nome=d),class:"w-11/12 input input-bordered mb-4",type:"text",name:"nome_add",id:"nome_add"},null,512),[[x,o.nome]])]),e("div",ce,[re,c(e("select",{"onUpdate:modelValue":s[2]||(s[2]=d=>o.uf_id=d),name:"uf_id",id:"uf_id",class:"select select-bordered"},[me,(a(!0),i(b,null,y(r.uf,(d,_)=>(a(),i("option",{key:_,value:d.id},n(d.nome),9,ue))),128))],512),[[U,o.uf_id]])])]),e("div",fe,[e("label",{onClick:s[3]||(s[3]=d=>h()),for:"modal-cidade-add",class:"botao-modal"},"Salvar")])],40,le)])]),_e,e("label",be,[e("label",xe,[e("div",pe,[e("h1",he,"Dados da Cidade: "+n(m.value),1)]),e("div",ve,[e("div",we,[e("div",Ce,[e("form",{onSubmit:k(v,["prevent"])},[e("div",ye,[e("div",ke,[je,c(e("input",{"onUpdate:modelValue":s[4]||(s[4]=d=>t.nome_edit=d),class:"w-full input input-bordered mb-4",type:"text"},null,512),[[x,t.nome_edit]])])]),e("label",{onClick:s[5]||(s[5]=d=>v()),for:"modal-cidade-edit",class:"botao-modal w-full bg-amber-500 hover:bg-amber-700 mb-4"},"Salvar Edição")],40,ge),Se,e("label",{onClick:s[6]||(s[6]=d=>F()),for:"modal-cidade-edit",class:"botao-modal w-full bg-red-500 hover:bg-red-800"},"Excluir Região")])])])])])])]),_:1})],64))}};export{Ue as default};