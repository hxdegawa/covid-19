<template lang="pug">
  .logo-screen
    .logo-wrapper
      .text.text__top
        span C
        span O
        span V
        span I
        span D
        span -
        span 1
        span 9
      .logo
        img(src="~/assets/images/test.svg").logo__center
        .logo__outer
          img(src="~/assets/images/biohazard_outer_left_white.svg").logo__outer__left
          img(src="~/assets/images/biohazard_outer_right_white.svg").logo__outer__right
          img(src="~/assets/images/biohazard_outer_center_white.svg").logo__outer__center
      .text.text__bottom
        span S
        span T
        span A
        span.space Y
        span H
        span O
        span M
        span E
        span .

    .scroll-icon
      span scroll down
      img(src="~/assets/images/scrolldown.svg")
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>

<style lang="scss" scoped>
.logo-screen {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  overflow: hidden;
  background-image: url('~assets/images/pattern.svg');
  background-size: 100px;

  * {
    color: $color-white;
  }

  .logo-wrapper {
    position: relative;
    max-width: 200px;

    @media screen and (max-width: $mobile) {
      min-width: 160px;
      max-width: 160px;
    }

    .text {
      display: block;
      text-align: center;

      span {
        display: inline-block;
        font-size: 20px;
        text-transform: uppercase;
        font-weight: bold;
        transform: rotateX(90deg);
        word-break: keep-all;

        &.space {
          margin-right: 10px;
        }
      }

      &__top {
        span {
          @for $i from 1 through 11 {
            &:nth-child(#{$i}) {
              animation: flip 0.2s calc(6s + 0.1s * #{$i}) ease forwards;
            }
          }
        }
      }

      &__bottom {
        span {
          @for $i from 1 through 11 {
            &:nth-child(#{$i}) {
              animation: flip 0.2s calc(7s + 0.1s * #{$i}) ease forwards;
            }
          }
        }
      }

      &:first-child {
        margin-bottom: 40px;
      }

      &:last-child {
        margin-top: 20px;
      }
    }

    .logo {
      position: relative;
      display: inline-block;

      img {
        object-fit: contain;
        width: 100%;
      }

      &__center {
        position: relative;
        transform-origin: center;
        opacity: 0;
        animation: spin 4s 1s ease forwards;
      }

      &__outer {
        position: absolute;
        left: 0;
        top: 0;
        pointer-events: none;

        img {
          opacity: 0;
          filter: drop-shadow(5px 5px 0px $color-black);
        }

        img:not(:first-child) {
          position: absolute;
          left: 0;
        }

        &__left {
          animation: injectLeft 0.4s 5s ease forwards;
        }

        &__right {
          animation: injectRight 0.4s 5.4s ease forwards;
        }

        &__center {
          animation: injectCenter 0.4s 5.8s ease forwards;
        }
      }
    }
  }

  .scroll-icon {
    position: absolute;
    bottom: 30px;

    * {
      display: block;
      text-align: center;
      margin: 0 auto;
    }

    img {
      max-width: 20px;
      object-fit: contain;
      opacity: 0;
      animation: drop 1s ease-in infinite alternate, fadeAppear 1s 8s linear forwards;
    }

    span {
      position: relative;
      text-transform: uppercase;
      font-size: 9px;
      font-weight: 600;
      margin-bottom: 15px;
      color: rgba($color: $color-white, $alpha: 0);
      animation: appear .7s 8s linear forwards;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        background-color: $color-white;
        animation: slideFade 0.7s 8s ease forwards;
      }
    }
  }
}

@keyframes flip {
  from {
    transform: rotateX(90deg);
  }

  to {
    transform: rotateX(0deg);
  }
}

@keyframes spin {
  0% {
    transform: rotateZ(0deg);
    opacity: 0;
  }

  25% {
    opacity: 1;
  }

  100% {
    transform: rotateZ(1080deg);
    opacity: 1;
  }
}

@keyframes injectLeft {
  from {
    transform: translate(-40px, -40px);
    opacity: 0;
  }

  to {
    transform: translate(0px, 0px);
    opacity: 1;
  }
}

@keyframes injectRight {
  from {
    transform: translate(40px, -40px);
    opacity: 0;
  }

  to {
    transform: translate(0px, 0px);
    opacity: 1;
  }
}

@keyframes injectCenter {
  from {
    transform: translate(0px, 40px);
    opacity: 0;
  }

  to {
    transform: translate(0px, 0px);
    opacity: 1;
  }
}

@keyframes drop {
  from {
    transform: translateY(0px);
  }

  to {
    transform: translateY(20px);
  }
}

@keyframes appear {
  0% {
    color: rgba($color: $color-white, $alpha: 0);
  }

  50% {
    color: rgba($color: $color-white, $alpha: 0);
  }

  51% {
    color: rgba($color: $color-white, $alpha: 1);
  }

  100% {
    color: rgba($color: $color-white, $alpha: 1);
  }
}

@keyframes fadeAppear {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes slideFade {
  0% {
    left: 0;
    right: 100%;
  }

  50% {
    left: 0;
    right: 0;
  }

  100% {
    left: 100%;
    right: 0;
  }
}
</style>
