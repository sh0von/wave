<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import Cookies from "js-cookie";

  const apiURL = "https://wave-4yvm.onrender.com";
  let name = "";
  let ifRegistered = false;

  async function registerUser(e) {
    e.preventDefault();
    // Get the value of the input field
    const nameInput = document.getElementById("name");
    name = nameInput.value.trim();

    try {
      // Send a POST request to register the user
      const response = await axios.post(`${apiURL}/register`, { name });
      const token = response.data.token;

      // Set the token as a cookie with an expiration date (30 days)
      Cookies.set("token", token, { expires: 30 });

      console.log("Token set as cookie:", token);

      // Update ifRegistered to true
      ifRegistered = true;
    } catch (error) {
      console.error("Registration failed:", error.response.data.error);
    }
  }

  // Check if the user is already registered when the component mounts
  onMount(() => {
    const token = Cookies.get("token");
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
    <div class="my-8 max-w-md mx-auto bg-white rounded-lg overflow-hidden">
        {#if !ifRegistered}
        <div class="p-6">
            <form on:submit={handleSubmit}>
                <input type="text" id="name" class="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 px-4 mb-4" placeholder="Enter your name" required />
                <p class="text-gray-600 mb-4 text-center">No personal information required. Just enter your name to start receiving encrypted anonymous messages.</p>
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
                <p class="text-gray-700 mb-4">Send and receive AES 256 encrypted messages for enhanced security. Your messages are scrambled using industry-standard encryption algorithms, ensuring that only the intended recipient can decipher them.</p>
                <a href="#a" class="text-blue-500 hover:text-blue-600 font-semibold">Learn More</a>
            </div>
        </div>
        
        
        <!-- Feature Card 3 -->
        <div class="bg-white border border-blue-200 rounded-lg ">
            <div class="p-6">
                <i class="fas fa-calendar-times fa-4x text-blue-500 mx-auto mb-4"></i>
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Message Expiry</h2>
                <p class="text-gray-700 mb-4">Messages are stored for up to 30 days before they are automatically deleted. This ensures that your inbox remains clutter-free and that your messages are not retained longer than necessary.</p>
                <a href="#b" class="text-blue-500 hover:text-blue-600 font-semibold">Learn More</a>
            </div>
        </div>

        <!-- Feature Card 4 -->
        <div class="bg-white border border-blue-200 rounded-lg ">
            <div class="p-6">
                <i class="fas fa-user-plus fa-4x text-blue-500 mx-auto mb-4"></i>
                <h2 class="text-xl font-semibold text-gray-800 mb-4">No Registration Required</h2>
                <p class="text-gray-700 mb-4">Receive anonymous messages without the need to register. Your privacy is paramount to us, and we don't require any personal information to use our service.</p>
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


<svelte:head>
  <title>Wave-No login anonymous messaging</title>
  <meta property="og:title" content="Wave-No login anonymous messaging" />
  <meta
    property="og:image"
    content="https://api.multiavatar.com/hellosir.png"
    width="100px"
    height="100px"
  />
  <meta
    property="og:description"
    content="Send and receive anonymous messages securely without the need to register."
  />
  <meta
    description="Send and receive anonymous messages securely without the need to register."
  />
</svelte:head>
