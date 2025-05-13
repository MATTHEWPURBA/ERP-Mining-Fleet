<template>
    <div class="default-layout">
      <header class="bg-green-600 text-white p-4">
        <h1>Default Layout</h1>
      </header>
      <main class="p-4">
        <slot></slot>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DefaultLayout'
  }
  </script>