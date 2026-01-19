<template>
  <div p="6" bg="gray-100" class="space-y-6">

    <!-- Flex 布局属性化 -->
    <div
        flex="~ col"
        gap="4"
        p="4"
        bg="white"
        rounded
        shadow
    >
      <div class="bg-blue-100 p-2 rounded">Item 1</div>
      <div class="bg-blue-100 p-2 rounded">Item 2</div>
      <div class="bg-blue-100 p-2 rounded">Item 3</div>
    </div>

    <!-- Grid 布局属性化 -->
    <div
        grid="~ cols-3 gap-4"
        p="4"
        bg="white"
        rounded
        shadow
    >
      <div class="bg-green-100 p-2 rounded">A</div>
      <div class="bg-green-100 p-2 rounded">B</div>
      <div class="bg-green-100 p-2 rounded">C</div>
      <div class="bg-green-100 p-2 rounded">D</div>
      <div class="bg-green-100 p-2 rounded">E</div>
      <div class="bg-green-100 p-2 rounded">F</div>
    </div>

  </div>
</template>