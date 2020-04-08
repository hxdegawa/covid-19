<template lang="pug">
  div
    nuxt
    .tooltip(ref="tooltip")
      p {{tooltip}}
</template>

<script lang="ts">
import { Vue, Component, Provide } from 'nuxt-property-decorator'

@Component({})
export default class BaseLayout extends Vue {
  @Provide() tooltip: string = ''
  mounted() {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })

    const tooltip: any = this.$refs.tooltip

    window.addEventListener('mousemove', (e) => {
      tooltip.style.left = e.pageX + 'px'
      tooltip.style.top = e.pageY + 'px'

      const targetElem: any = e.target

      if (targetElem.getAttribute('data-tooltip')) {
        this.tooltip = targetElem.getAttribute('data-tooltip')
        tooltip.classList.add('visible')
      } else {
        tooltip.classList.remove('visible')
      }
    })
  }
}
</script>

<style lang="scss">
@import url('https://rsms.me/inter/inter.css');

body {
  background-color: $color-deepblack;
  margin: 0;
}

* {
  font-family: 'Inter var', 'Inter', sans-serif;
}

.cursor {
  position: absolute;
  width: 3px;
  height: 3px;
  top: -3px;
  left: -3px;
  transform: translate(-1px, -1px);
  background-color: $color-truewhite;
  z-index: 1000000;
  pointer-events: none;

  @media screen and (max-width: $mobile) {
    display: none;
  }
}

.tooltip {
  position: absolute;
  top: 0px;
  left: 0px;
  opacity: 0;
  padding: 7px 10px;
  transform: translate(10px, calc(-100% - 10px));
  background-color: $color-trueblack;
  border-left: solid 1px $color-white;
  border-bottom: solid 1px $color-white;
  z-index: 100000;
  pointer-events: none;
  transition: opacity 0.2s ease;

  &.visible {
    opacity: 1;
  }

  p {
    margin: 0;
    font-size: 11px;
  }

  @media screen and (max-width: $mobile) {
    display: none;
  }
}

.cursor {
  position: absolute;
  width: 3px;
  height: 3px;
  top: -3px;
  left: -3px;
  transform: translate(-1px, -1px);
  background-color: $color-truewhite;
  z-index: 1000000;
  pointer-events: none;

  @media screen and (max-width: $mobile) {
    display: none;
  }
}

@supports (font-variation-settings: normal) {
  * {
    font-family: 'Inter var', sans-serif;
  }
}
</style>
