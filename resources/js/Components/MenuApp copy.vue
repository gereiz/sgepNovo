<script setup>
    const props = defineProps(['showText'])
</script>

<template>
  <div v-if="!showText" class="w-full my-4 flex flex-col space-y-4">
    
    <!-- Endereços -->
    <div class="w-full flex">
        <div tabindex="0" class="collapse text-white w-full flex"> 
            <div class="w-2/12 md:ml-2.5 text-center">
                <i class="fa-solid fa-map-location-dot text-white text-2xl"></i>
            </div> 
            <div class="flex flex-col -ms-4 -mt-2">
                <div class="collapse-title text font-medium">
                Endereços
            </div>
                <div class="collapse-content -mt-2 ms-2 space-y-4"> 
                    <p class="hover:text-slate-400"><a href="/CadCidade" target="_blank">Cadastro de Cidades</a></p>
                    <p class="hover:text-slate-400"><a href="/CadRegiao" target="_blank">Cadastro de Regiões</a></p>
                    <p class="hover:text-slate-400"><a href="/CadBairro" target="_blank">Cadastro de Bairros</a></p>
                   
                </div>
            </div>
          
        </div>
    </div>

    <!-- Clientes -->
    <div class="w-full flex">
        <div tabindex="0" class="collapse text-white w-full flex -mt-4"> 
            <div class="w-2/12 md:ml-2.5 text-center">
                <i class="fa-solid fa-user-plus text-white text-2xl"></i>
            </div> 
            <div class="flex flex-col -ms-4 -mt-2">
                <div class="collapse-title text font-medium">
                Clientes
            </div>
                <div class="collapse-content -mt-2 ms-2 space-y-4"> 
                    <p class="hover:text-slate-400"><a href="/Clientes" target="_blank">Lista de Clientes</a></p>
                   
                </div>
            </div>
          
        </div>
    </div>

    <!-- Painéis -->
    <div class="w-full flex">
        <div tabindex="0" class="collapse text-white w-full flex -mt-4"> 
            <div class="w-2/12 md:ml-2.5 text-center">
                <i class="fa-solid fa-solar-panel text-white text-2xl"></i>
            </div> 
            <div class="flex flex-col -ms-4 -mt-2">
                <div class="collapse-title text font-medium">
                Painéis
            </div>
                <div class="collapse-content -mt-2 ms-2 space-y-4"> 
                    <p class="hover:text-slate-400"><a href="/Paineis" target="_blank">Lista de Painéis</a></p>
                    <p class="hover:text-slate-400"><a href="/ResPaineis" target="_blank">Reserva de Painéis</a></p>
                    <p class="hover:text-slate-400"><a href="/ResPaineisCli" target="_blank">Reservas por Cliente</a></p>
                   
                </div>
            </div>
          
        </div>
    </div>

    <!-- Disponibilidades -->
    <div class="w-full flex">
        <div tabindex="0" class="collapse text-white w-full flex -mt-4"> 
            <div class="w-2/12 md:ml-2.5 text-center">
                <i class="fa-regular fa-envelope text-white text-2xl"></i>
            </div> 
            <div class="flex flex-col -ms-4 -mt-2">
                <div class="collapse-title text font-medium">
                Disponibilidades
            </div>
                <div class="collapse-content -mt-2 ms-2 space-y-4"> 
                    <p class="hover:text-slate-400"><a target="_blank">Disp. Enviadas</a></p>
                   
                </div>
            </div>
          
        </div>
    </div>
    
    <!-- Relatórios -->
    <div class="w-full flex">
        <div tabindex="0" class="collapse text-white w-full flex -mt-4"> 
            
            <div class="w-2/12 md:ml-2.5 text-center">
                <i class="fa-regular fa-file text-white text-2xl"></i>
            </div> 
            <div class="flex flex-col -ms-4 -mt-2">
                <div class="collapse-title text font-medium">
                Relatórios
            </div>
                <div class="collapse-content -mt-2 ms-2 space-y-4"> 
                    <p class="hover:text-slate-400"><a href="https://old.sgepequipe.com/relColagem" target="_blank">Relatório de Colagem</a></p>
                    <p class="hover:text-slate-400"><a href="https://old.sgepequipe.com/relReservaCLiente" target="_blank">Reservas por Cliente</a></p>
                    <p class="hover:text-slate-400"><a href="https://old.sgepequipe.com/relPainelCliente" target="_blank">Painéis por Cliente</a></p>
                    <p class="hover:text-slate-400"><a href="https://old.sgepequipe.com/relPainelBisemana" target="_blank">Painéis por Bisemana</a></p>
                    <p class="hover:text-slate-400"><a href="https://old.sgepequipe.com/relClienteXbisemana" target="_blank">Clientes por Bisemana</a></p>

                </div>
            </div>
          
        </div>
    </div>

    <!-- Financeiro -->
    <div class="w-full flex">
        <div tabindex="0" class="collapse text-white w-full flex -mt-4"> 
            <div class="w-2/12 md:ml-2.5 text-center">
                <i class="fa-regular fa-file text-white text-2xl"></i>
            </div> 
            <div class="flex flex-col -ms-4 -mt-2">
                <div class="collapse-title text font-medium">
                Financeiro
            </div>
                <div class="collapse-content -mt-2 ms-2 space-y-4"> 
                    <!-- <p class="hover:text-slate-400"><a href="https://old.sgepequipe.com/relColagem" target="_blanksgepnovo/public/">Relatório de Colagem</a></p>
                    <p class="hover:text-slate-400"><a>Cadastro de Regiões</a></p>
                    <p class="hover:text-slate-400"><a href="/CadBairro">Cadastro de Bairros</a></p> -->
                </div>
            </div>
          
        </div>
    </div>


    <!-- Configurações -->
    <div class="w-full flex">
        <div tabindex="0" class="collapse text-white w-full flex -mt-4"> 
            <div class="w-2/12 md:ml-2.5 text-center">
                <i class="fa-solid fa-gears text-white text-2xl"></i>
            </div> 
            <div class="flex flex-col -ms-4 -mt-2">
                <div class="collapse-title text font-medium">
                Configurações
            </div>
            <div class="collapse-content -mt-2 mb-2 ms-2 space-y-4"> 
                <a class="h-24" href="/Config" target="_blank">Config Gerais</a>
            </div>
        </div>
          
        </div>
    </div>



  </div>
</template>

