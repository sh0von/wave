<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import Cookies from "js-cookie";

  let messages = [];
  let loading = true; // Track loading state

  let copiedMessage = "";

  async function fetchMessages() {
    try {
      const token = Cookies.get("token");
      const response = await axios.get("https://wave-4yvm.onrender.com/messages", {
        headers: {
          authorization: `${token}`,
        },
      });
      messages = response.data;
      messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error("Failed to fetch messages:", error.response.data.error);
    } finally {
      loading = false; // Set loading to false when fetching is complete
    }
  }
  
  let username = "";

  async function fetchProfile() {
    try {
      const token = Cookies.get("token");
      const response = await axios.get("https://wave-4yvm.onrender.com/profile", {
        headers: {
          authorization: `${token}`,
        },
      });
      username = response.data.username;
    } catch (error) {
      console.error("Failed to fetch profile:", error.response.data.error);
    }
  }


  function formattedTime(createdAt) {
    const now = new Date();
    const messageDate = new Date(createdAt);
    const diff = now - messageDate;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `Just now`;
    }
  }

  function copyToClipboard() {
    const linkInput = document.querySelector("input");
    linkInput.select();
    document.execCommand("copy");

    copiedMessage = "Copied to clipboard";
    setTimeout(() => {
      copiedMessage = "";
    }, 2000);
  }

  onMount(() => {
    fetchMessages();
    fetchProfile();
    //if no token redirect
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/";
    }
  });

</script>

<main class="container mx-auto py-8 px-4">
  <div class="profile-section">
    <div class="card p-6 rounded-lg shadow-md">
      <div class="flex items-center justify-center mb-4">
        <div class="flex-shrink-0 mr-3">
          <img
            src={`https://api.multiavatar.com/${username}.png`}
            alt="User Avatar"
            class="rounded-full w-16 h-16"
          />
        </div>
      </div>

      <div class="text-center">
        <p class="text-gray-700 mb-4">Username: {username}</p>
        <p class="text-gray-700 mb-4">Share your unique message link:</p>
        <input
          id="message-link"
          type="text"
          class="form-input mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          value={`http://localhost:5173/send/${username}`}
          readonly
        />
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
          on:click={copyToClipboard}
        >
          Copy Link
        </button>
        {#if copiedMessage}
          <p class="text-green-500 mt-2">{copiedMessage}</p>
        {/if}
      </div>
    </div>
  </div>


  <h2 class="text-2xl font-semibold text-gray-800 mb-4 py-8">Recent Messages</h2>
  
  {#if loading}
  <div class="flex justify-center items-center mt-10">
    <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
  </div>
{:else}
  <!-- Messages -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each messages as message}
      <div class="card p-6 rounded-lg shadow-md">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 mr-3">
              <img
                src={`https://api.multiavatar.com/${message._id}.png`}
                alt="User Avatar"
                class="rounded-full w-12 h-12"
              />
            </div>
            <div>
              <p class="text-lg text-gray-600">Anonymous</p>
            </div>
          </div>
        </div>
        <p class="text-gray-700 mb-4">{message.text}</p>
        <div class="text-sm text-gray-500">{formattedTime(message.createdAt)}</div>
      </div>
    {/each}
  </div>
{/if}
  </main>

  <style>
    .loader {
      border-top-color: #3498db;
      -webkit-animation: spinner 1.5s linear infinite;
      animation: spinner 1.5s linear infinite;
    }
  
    @-webkit-keyframes spinner {
      0% {
        -webkit-transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
  
    @keyframes spinner {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  </style>