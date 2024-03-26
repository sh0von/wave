<script>
    import Nav from '$lib/Nav.svelte';
</script>
<div class=" mx-auto">
  <div id="preloader" class="preloader">
    <div class="spinner"></div>
  </div> 
  
  <Nav />

  <slot />

  <footer class="footer py-4 bg-white">
    <div class="container mx-auto text-center">
      <p>Made with ❤️ by Shovon.</p>
    </div>
  </footer>
</div>
