<template>
  <view class="z-icon" :style="style" />
</template>

<script setup>
import { computed } from 'vue'
import { icons } from '@/utils/icons'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 20 },
  color: { type: String, default: '#17292c' },
  weight: { type: Number, default: 2 },
})

const style = computed(() => {
  const svg = (icons[props.name] || '')
    .replace(/__C__/g, props.color)
    .replace(/__W__/g, props.weight)
  return {
    width: props.size + 'px',
    height: props.size + 'px',
    backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }
})
</script>
