<template>
    <div>
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
                <h1 class="text-2xl font-bold mb-2">Dashboard</h1>
                <p class="text-sm opacity-70">Your task overview and summary</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div class="stat bg-base-100 shadow-md rounded-box p-6">
                <div class="stat-title mb-2 text-lg">Active Projects</div>

                <div class="flex justify-between items-center gap-4 mb-2">
                    <div class="text-3xl font-bold text-warning">2</div>

                    <div class="text-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>

                <div class="stat-desc">33% completion rate</div>
            </div>

            <div class="stat bg-base-100 shadow-md rounded-box p-6">
                <div class="stat-title mb-2 text-lg">Total Tasks</div>

                <div class="flex justify-between items-center gap-4 mb-2">
                    <div class="text-3xl font-bold text-success">6</div>

                    <div class="text-success">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                </div>

                <div class="stat-desc">2 completed</div>
            </div>

            <div class="stat bg-base-100 shadow-md rounded-box p-6">
                <div class="stat-title mb-2 text-lg">Due Soon</div>

                <div class="flex justify-between items-center gap-4 mb-2">
                    <div class="text-3xl font-bold text-error">3</div>

                    <div class="text-error">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                <div class="stat-desc">Tasks due in the next 3 days</div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">

</script>