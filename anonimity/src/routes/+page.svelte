<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Cookies from 'js-cookie';

    const apiURL = 'https://wave-4yvm.onrender.com';
    let name = '';
    let ifRegistered = false;

    async function registerUser(e) {
        e.preventDefault();
        // Get the value of the input field
        const nameInput = document.getElementById('name');
        name = nameInput.value.trim();

        try {
            // Send a POST request to register the user
            const response = await axios.post(`${apiURL}/register`, { name });
            const token = response.data.token;
            
            // Set the token as a cookie with an expiration date (30 days)
            Cookies.set('token', token, { expires: 30 });
            
            console.log('Token set as cookie:', token);
            
            // Update ifRegistered to true
            ifRegistered = true;
        } catch (error) {
            console.error('Registration failed:', error.response.data.error);
        }
    }
    
    // Check if the user is already registered when the component mounts
    onMount(() => {
        const token = Cookies.get('token');
        if (token) {
            ifRegistered = true;
        }
    });

    // Function to handle form submission
    function handleSubmit(e) {
        registerUser(e);
    }
</script>

<main id="content" class="container mx-auto py-8 px-4 text-center">
    <h1 class="text-4xl font-bold text-gray-800 mb-6">Anonymous Messaging Made Simple</h1>
    <p class="text-lg text-gray-600 mb-8">Experience the thrill of receiving anonymous messages securely.</p>
    <div class="my-8  max-w-md mx-auto bg-white rounded-lg overflow-hidden">
        {#if !ifRegistered}
        <div class="p-6">
            <form on:submit={handleSubmit}>
                <div class="mb-4">
                    <input type="text" id="name" name="name" class="form-input mt-1 block w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" placeholder="Enter your name to get started" required>
                </div>
                <p class="text-gray-600 mb-4 text-center">No other information required. Just enter your name to start receiving anonymous messages.</p>
                <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Register</button>
            </form>
        </div>
        {:else}
        <!-- Show a different component or redirect the user -->
        <p class="text-lg text-gray-600 mb-8">You are already registered!</p>
        <a href="/messages" class="text-blue-500 hover:text-blue-600">Go to Messages</a>
        {/if}
    </div>
    
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Feature Card 1 -->
        <div class="bg-white border border-blue-200 rounded-lg ">
            <div class="p-6">
                <i class="fas fa-lock fa-4x text-blue-500 mx-auto mb-4"></i>
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Encrypted Messages</h2>
                <p class="text-gray-700 mb-4">Send and receive encrypted messages for enhanced security.</p>
                <a href="#a" class="text-blue-500 hover:text-blue-600 font-semibold">Learn More</a>
            </div>
        </div>
        
        
        <!-- Feature Card 3 -->
        <div class="bg-white border border-blue-200 rounded-lg ">
            <div class="p-6">
                <i class="fas fa-calendar-times fa-4x text-blue-500 mx-auto mb-4"></i>
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Message Expiry</h2>
                <p class="text-gray-700 mb-4">Store messages for up to 30 days before they are automatically deleted.</p>
                <a href="#b" class="text-blue-500 hover:text-blue-600 font-semibold">Learn More</a>
            </div>
        </div>

        <!-- Feature Card 4 -->
        <div class="bg-white border border-blue-200 rounded-lg ">
            <div class="p-6">
                <i class="fas fa-user-plus fa-4x text-blue-500 mx-auto mb-4"></i>
                <h2 class="text-xl font-semibold text-gray-800 mb-4">No Registration Required</h2>
                <p class="text-gray-700 mb-4">Receive anonymous messages without the need to register.</p>
                <a href="#c" class="text-blue-500 hover:text-blue-600 font-semibold">Learn More</a>
            </div>
        </div>
    </section>
    
    <!-- Call to Action Section -->
    <div class="mt-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Ready to Get Started?</h2>
        <p class="text-gray-700 mb-4">Join our community and start receiving anonymous messages now.</p>
        <a href="#name" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full">Sign Up Now</a>
    </div>
</main>
