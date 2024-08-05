import{j as h,z as w,h as D,o as a,f as i,a as R,u as F,w as N,F as b,Z as V,b as e,t as n,m as r,v as g,p as y,e as j,y as E,A as p}from"./app-cc449fe3.js";import{_ as $}from"./regiao-35565801.js";import{_ as q}from"./AuthenticatedLayout-50e568ff.js";import{u as O}from"./toastr-38af5969.js";/* empty css              */import"./transition-da6d0184.js";import"./XMarkIcon-6d17bc51.js";import"./toastr-26786df3.js";/* empty css                   */const U={class:"w-full h-screen pt-24 pb-32 mx-2 md:mx-4"},B={class:"w-full h-14 flex mb-2"},L={class:"w-2/12 h-14 flex items-center"},M=e("h1",{class:"text-xl md:text-4xl font-bold"},"Regiões",-1),z={class:"text-lg md:text-2xl text-red-400 font-bold ml-2 md:ml-4"},T=e("div",{class:"w-10/12 flex justify-end"},[e("label",{for:"modal-regiao-add",class:"w-28 botao-modal text-sm"},"+ Nova Região")],-1),I={class:"w-full md:w-4/12"},P={class:"card w-full h-full bg-base-100 shadow-xl overflow-auto rounded-md"},Z={class:"card-body"},G={class:"w-full flex flex-col flex-wrap md:flex-row justify-center"},H={class:"card-body"},J={class:"w-full flex justify-between flex-wrap mb-4"},K={class:"w-full flex justify-between"},Q={class:"text-xs md:card-title"},W={class:"text-xs md:text-base font-bold text-zinc-400"},X=e("div",{class:"w-full flex justify-center md:justify-start mb-4 md:mb-0"},[e("img",{class:"w-20 md:w-32",src:$,alt:"Regiao"})],-1),Y={class:"w-full card-actions justify-center md:justify-end"},ee=["onClick"],oe=e("input",{type:"checkbox",id:"modal-regiao-add",class:"modal-toggle"},null,-1),se={for:"modal-regiao-add",class:"modal modal-bottom sm:modal-middle cursor-pointer"},te={class:"modal-box relative",for:""},le=e("h3",{class:"font-bold text-lg"},"Adicionar Nova Região",-1),de={class:"w-full flex"},ae={class:"w-full flex flex-col"},ie=e("span",{class:"label-text ml-1"},"Nome",-1),ne={class:"w-full flex flex-col"},re=e("span",{class:"label-text ml-1"},"Cidade",-1),ce=e("option",{value:"0",disabled:"",selected:""},"Seleicione a Região",-1),me=["value"],ue={class:"modal-action"},_e=e("input",{type:"checkbox",id:"modal-regiao-edit",class:"modal-toggle"},null,-1),fe={for:"modal-regiao-edit",class:"modal modal-bottom sm:modal-middle cursor-pointer"},be={class:"modal-box relative",for:""},ge={class:"h-12 border-b-2 font-bold text-center md:text-start"},pe={class:""},xe={class:"h-full flex flex-col border-b-2 font-bold space-x-4 space-y-4 pb-2"},ve={class:"flex space-x-4"},he={class:"w-full"},we={class:"flex mt-2"},Re={class:"w-full flex flex-col"},ye=e("span",{class:"label-text ml-1"},"Nome",-1),je=e("span",{class:"card-title justify-center mb-4"},"ou",-1),qe={__name:"CadRegiao",props:["regioes","cidades","errors"],setup(c){const d=O(),k=c,m=h(""),u=h(""),l=w({nome:"",cidade_id:0}),t=w({nome_edit:"",id_regiao:"",id_cidade:""});function C(_,s,o){m.value=o,t.nome_edit=o,t.id_regiao=_,t.id_cidade=s}function x(){l.nome.length<3?d.error("O nome da Região deve ter no mínimo 3 caracteres!"):l.cidade_id==0?d.error("A Região deve pertencer a uma Cidade!"):(p.post("/AddRegiao",this.formRegiaoAdd),d.success("Região "+l.nome+" cadastrada!"),l.nome="",l.cidade_id=0)}function v(){t.nome_edit.length<3?d.error("O nome da Região deve ter no mínimo 3 caracteres!"):(p.post("/EditRegiao",t),d.success("Região "+t.nome_edit+" editada para "+t.nome_edit+" !"))}function A(){p.post("/DelRegiao",t),d.success("Região "+m.value+" excluída!")}const S=D(()=>Object.values(k.regioes).filter(s=>s.nome.toLowerCase().indexOf(u.value.toLowerCase())>-1));return(_,s)=>(a(),i(b,null,[R(F(V),{title:"Regiões"}),R(q,null,{default:N(()=>[e("div",U,[e("div",B,[e("div",L,[M,e("h1",z,n(c.regioes.length),1)]),T]),e("div",I,[r(e("input",{"onUpdate:modelValue":s[0]||(s[0]=o=>u.value=o),placeholder:"Pesquisar Região",class:"w-full h-10 input input-bordered rounded-none mb-4",type:"text",name:"pesquisar",id:"pesquisar"},null,512),[[g,u.value]])]),e("div",P,[e("div",Z,[e("div",G,[(a(!0),i(b,null,y(S.value,(o,f)=>(a(),i("div",{key:f,class:"card w-full md:w-5/12 bg-base-100 border-2 rounded-md shadow-xl mt-4 md:mr-4"},[e("div",H,[e("div",J,[e("div",K,[e("h2",Q,"Região.: "+n(o.nome),1),e("h2",W,"ID: "+n(o.id),1)])]),X,e("div",Y,[e("label",{for:"modal-regiao-edit",onClick:ke=>C(o.id,o.cidade_id,o.nome),class:"w-full md:w-28 botao-modal"},"Ações",8,ee)])])]))),128))])])]),oe,e("label",se,[e("label",te,[le,e("form",{onSubmit:j(x,["prevent"])},[e("div",de,[e("div",ae,[ie,r(e("input",{"onUpdate:modelValue":s[1]||(s[1]=o=>l.nome=o),class:"w-11/12 input input-bordered mb-4",type:"text",name:"nome_add",id:"nome_add"},null,512),[[g,l.nome]])]),e("div",ne,[re,r(e("select",{"onUpdate:modelValue":s[2]||(s[2]=o=>l.cidade_id=o),name:"cidade_id",id:"cidade_id",class:"select select-bordered"},[ce,(a(!0),i(b,null,y(c.cidades,(o,f)=>(a(),i("option",{key:f,value:o.id},n(o.nome),9,me))),128))],512),[[E,l.cidade_id]])])]),e("div",ue,[e("label",{onClick:s[3]||(s[3]=o=>x()),for:"modal-regiao-add",class:"botao-modal"},"Salvar")])],32)])]),_e,e("label",fe,[e("label",be,[e("div",ge,[e("h1",pe,"Dados da Região: "+n(m.value),1)]),e("div",xe,[e("div",ve,[e("div",he,[e("form",{onSubmit:j(v,["prevent"])},[e("div",we,[e("div",Re,[ye,r(e("input",{"onUpdate:modelValue":s[4]||(s[4]=o=>t.nome_edit=o),class:"w-full input input-bordered mb-4",type:"text"},null,512),[[g,t.nome_edit]])])]),e("label",{onClick:s[5]||(s[5]=o=>v()),for:"modal-regiao-edit",class:"botao-modal w-full bg-amber-500 hover:bg-amber-700 mb-4"},"Salvar Edição")],32),je,e("label",{onClick:s[6]||(s[6]=o=>A()),for:"modal-regiao-edit",class:"botao-modal w-full bg-red-500 hover:bg-red-800"},"Excluir Região")])])])])])])]),_:1})],64))}};export{qe as default};
