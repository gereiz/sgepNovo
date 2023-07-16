<script setup>
    const props = defineProps(['showText'])
</script>

<template>
  <div v-if="!showText" class="w-full my-4 flex flex-col space-y-4">
    
    <!-- Endereços -->
    <div class="w-full flex group">
        <div class="w-2/12 md:ml-2.5 text-center">
            <i class="fa-solid fa-map-location-dot text-white text-xl"></i>
        </div> 
        <div class="w-10/12 flex">
            <div class="">
                <p  class="text-white mt-1">Endereços</p>
                <ul  class="hidden group-hover:block w-52 text-white ml-1 mt-2 space-y-2">
                    <li class="hover:text-slate-400"><a href="/CadCidade">Cadastro de Cidades</a></li>
                    <li class="hover:text-slate-400"><a href="/CadRegiao">Cadastro de Regiões</a></li>
                    <li class="hover:text-slate-400"><a href="/CadBairro">Cadastro de Bairros</a></li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Clientes -->
    <div class="w-full flex">
        <div class="w-2/12 md:ml-2.5 text-center">
            <i class="fa-solid fa-user-plus text-white text-xl"></i>
        </div> 
        <div class="w-10/12 flex">
            <div class="group">
            <p  class="text-white mt-1">Clientes</p>
                <ul  class="hidden group-hover:block w-52 text-white ml-1 mt-2 space-y-2">
                    <li class="hover:text-slate-400"><a href="/Clientes">Lista de Clientes</a></li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Painéis -->
    <div class="w-full flex">
        <div class="w-2/12 md:ml-2.5 text-center">
            <i class="fa-solid fa-solar-panel text-white text-xl"></i>
        </div> 
        <div class="w-10/12 flex">
            <div class="group">
            <p  class="text-white mt-1">Painéis</p>
                <ul  class="hidden group-hover:block w-52 text-white ml-1 mt-2 space-y-2">
                    <li class="hover:text-slate-400"><a>Lista de Painéis</a></li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Disponibilidades -->
    <div class="w-full flex">
        <div class="w-2/12 md:ml-2.5 text-center">
            <i class="fa-solid fa-square-envelope text-white text-xl"></i>
        </div> 
        <div class="w-10/12 flex">
            <div class="group">
            <p  class="text-white mt-1">Disponibilidades</p>
                <ul  class="hidden group-hover:block w-52 text-white ml-1 mt-2 space-y-2">
                    <li class="hover:text-slate-400"><a>Cadastro de Cidades</a></li>
                    <li class="hover:text-slate-400"><a>Cadastro de Regiões</a></li>
                    <li class="hover:text-slate-400"><a href="/CadBairro">Cadastro de Bairros</a></li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Relatórios -->
    <div class="w-full flex">
        <div class="w-2/12 md:ml-2.5 text-center">
            <i class="fa-regular fa-file text-white text-xl"></i>
        </div> 
        <div class="w-10/12 flex">
            <div class="group">
            <p  class="text-white mt-1">Relatórios</p>
                <ul  class="hidden group-hover:block w-52 text-white ml-1 mt-2 space-y-2">
                    <li class="hover:text-slate-400"><a href="https://sgepequipe.com/relColagem">Relatório de Colagem</a></li>
                    <li class="hover:text-slate-400"><a>Cadastro de Regiões</a></li>
                    <li class="hover:text-slate-400"><a href="/CadBairro">Cadastro de Bairros</a></li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Configurações -->
    <div class="w-full flex">
        <div class="w-2/12 md:ml-2.5 text-center">
            <i class="fa-solid fa-gears text-white text-xl"></i>
        </div> 
        <div class="w-10/12 flex">
            <div class="group">
            <p  class="text-white mt-1">Configurações</p>
                <ul  class="hidden group-hover:block w-52 text-white ml-1 mt-2 space-y-2">
                    <li class="hover:text-slate-400"><a>Cadastro de Cidades</a></li>
                    <li class="hover:text-slate-400"><a>Cadastro de Regiões</a></li>
                    <li class="hover:text-slate-400"><a href="/CadBairro">Cadastro de Bairros</a></li>
                </ul>
            </div>
        </div>
    </div>


  </div>
</template>

