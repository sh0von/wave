<script>
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';

  let ifRegistered = false;

  // On logout, remove the token and redirect to the home page. Show a confirmation dialog before logout.
  function logout() {
    if (confirm("Are you sure you want to logout?")) {
      Cookies.remove("token");
      window.location.href = "../";
    }
  }

  onMount(() => {
    const token = Cookies.get('token');
    if (token) {
      ifRegistered = true;
    }
  });
</script>

<nav class="nav-bar py-4">
  <div class="container mx-auto">
    <div class="flex items-center justify-between">
      <div class="text-black px-8">
        <a href="../" class="hover:text-blue-500">WAVE</a>
      </div>
      <div>
        <ul class="flex font-semibold">
          <li class="px-3 py-2">
            <a href="./messages" class="nav-link hover:text-blue-500">Messages</a>
          </li>
        </ul>
      </div>
      {#if ifRegistered}
      <div class="px-8">
        <button class="px-4 py-2 button-primary rounded-xl" on:click={logout}>Logout</button>
      </div>
      {/if}
    </div>
  </div>
</nav>
