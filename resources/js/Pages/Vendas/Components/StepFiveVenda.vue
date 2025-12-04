<script setup>
import { ref } from 'vue'
import 'trix'
import 'trix/dist/trix.css'

const emit = defineEmits(['nextStep', 'formFive'])

const observacao = ref('')

function handleTrixChange(e) {
  observacao.value = e.target.value
}

function avancar() {
  emit('formFive', { observacao: observacao.value })
  emit('nextStep', 6)
}

function voltar() {
  emit('nextStep', 4)
}

</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-base font-semibold">Observações do serviço</h2>
      <p class="text-sm text-base-content/70">Inclua informações complementares que devem constar na OS.</p>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Observações</span>
      </label>
      <input id="obs-input" type="hidden" />
      <trix-editor input="obs-input" @trix-change="handleTrixChange" class="trix-content"></trix-editor>
    </div>

    <div class="w-full sm:flex sm:flex-row-reverse">
      <button class="btn btn-success w-full sm:w-auto sm:ml-3" @click="avancar">Avançar</button>
      <button class="btn btn-outline mt-3 sm:mt-0 w-full sm:w-auto" @click="voltar">Voltar</button>
    </div>
  </div>
</template>

