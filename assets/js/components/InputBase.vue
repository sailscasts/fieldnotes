<script setup>
defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: String
  },
  label: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

function updateValue(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <label :for="id" class="relative block">
    <span class="mb-1.5 block text-sm font-medium text-gray-500">{{ label }}</span>
    <input
      :id="id"
      class="block w-full rounded-xl border border-gray-200/60 bg-gray-50/80 px-3.5 py-3.5 placeholder:text-lg placeholder:text-gray-400 focus:bg-white focus:border-brand/30 focus:outline-none focus:ring-2 focus:ring-brand/10"
      v-bind="$attrs"
      :value="modelValue"
      @input="updateValue"
    />
    <slot></slot>
    <slot name="suffix"></slot>
  </label>
</template>
<style>
::-ms-reveal {
  display: none;
}
</style>
