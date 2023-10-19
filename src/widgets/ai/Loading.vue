<template>
  <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
</template>

<script>
export default {
  name: "Loading"
}
</script>

<style scoped>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 72px;
  height: 32px;
}
.lds-ellipsis div {
  position: absolute;
  top: 12px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(0,0,0, 0.5);
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

</style>
