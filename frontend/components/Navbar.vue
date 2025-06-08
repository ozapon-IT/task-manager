<template>
    <div class="navbar bg-base-200 shadow-md">
        <div class="navbar-start">
            <div class="dropdown">
                <label tabindex="0" class="btn btn-ghost lg:hidden light:hover:bg-gray-100/10 dark:hover:bg-gray-100/10 border-0 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                </label>
                <ul tabindex="0"
                    class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 dark:text-gray-400">
                    <li>
                        <NuxtLink to="/">Dashboard</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/projects">Projects</NuxtLink>
                    </li>
                </ul>
            </div>
            <NuxtLink to="/" class="btn btn-ghost normal-case text-xl light:hover:bg-gray-100/10 dark:hover:bg-gray-100/10 border-0 dark:text-gray-400">Task Manager</NuxtLink>
        </div>
        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1 dark:text-gray-400">
                <li>
                    <NuxtLink to="/">Dashboard</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/projects">Projects</NuxtLink>
                </li>
            </ul>
        </div>
        <div class="navbar-end">
            <ClientOnly>
                <button class="btn btn-ghost btn-circle light:hover:bg-gray-100/10 dark:hover:bg-gray-100/10 border-0 dark:text-gray-400" @click="toggleTheme">
                    <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </button>
            </ClientOnly>
        </div>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === 'dark');

function toggleTheme() {
    colorMode.preference = isDark.value ? 'light' : 'dark';
}
</script>