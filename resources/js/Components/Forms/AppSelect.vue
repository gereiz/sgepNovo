<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['modelValue', 'options'])
const emit = defineEmits(['update:modelValue'])

const selectRef = ref(null)

const focusSelect = () => {
    selectRef.value?.focus()
}

// computed garante que as opções sempre reflitam props.options
const computedOptions = computed(() => {
    const baseOptions = [{ label: 'Selecione...', value: 0, disabled: true }];

    // Só adiciona props.options se for array e tiver elementos
    if (Array.isArray(props.options) && props.options.length > 0) {
        baseOptions.push(...props.options);
    }

    return baseOptions;
});

defineExpose({
    focusSelect
})
</script>

<template>
  <select
        ref="selectRef"
        :value="modelValue"
        class="select select-bordered " name="tipo-texto" id="tipo-texto"
        @change="$emit('update:modelValue', $event.target.value)"
    >
        <option v-for="opt in computedOptions" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
            {{ opt.label }}
        </option>
    </select>
</template>
