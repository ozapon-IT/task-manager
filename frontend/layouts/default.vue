<template>
    <div>
        <Navbar />
        <main>
            <slot />
        </main>
        <footer>
            <div>
                <p>Copyright © {{ new Date().getFullYear() }} - Task Manager</p>
            </div>
        </footer>
    </div>
</template>