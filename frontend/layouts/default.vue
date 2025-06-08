<template>
    <div class="min-h-screen flex flex-col bg-base-200">
        <Navbar />

        <main class="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <slot />
        </main>

        <footer class="footer footer-center p-4 bg-base-300 text-base-content dark:text-gray-400">
            <div>
                <p>Copyright © {{ new Date().getFullYear() }} - Task Manager</p>
            </div>
        </footer>
    </div>
</template>