<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import { page } from "$app/stores";

  let alertMessage = "";
  let recipientSlug = "";
  let randomMessage = "";

  // Extract recipient slug from the URL
  onMount(() => {
    const parts = window.location.pathname.split("/");
    recipientSlug = parts[parts.length - 1]; // Get the last part of the URL
  });

  // Fetch a random message from the API
  async function fetchRandomMessage() {
    try {
      const response = await axios.get("https://wave-4yvm.onrender.com/random");
      if (response.data && response.data.message) {
        randomMessage = response.data.message;
      }
    } catch (error) {
      console.error("Error fetching random message:", error);
    }
  }

  // Handle form submission
  async function handleFormSubmission(event) {
    event.preventDefault();

    const messageContent = event.target.messageContent.value;

    try {
      const response = await axios.post(
        `https://wave-4yvm.onrender.com/send-message/${recipientSlug}`,
        {
          text: messageContent,
        }
      );

      if (
        response.data &&
        response.data.message === "Message sent successfully"
      ) {
        alertMessage = "Message sent successfully!";
      } else {
        alertMessage = "Failed to send message. Please try again later.";
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alertMessage = "Failed to send message. Please try again later.";
    }

    // Clear the message content after sending
    event.target.reset();

    // Hide the alert after 3 seconds
    setTimeout(() => {
      alertMessage = "";
    }, 3000);
  }
</script>

<main class="container mx-auto py-8 px-4 md:px-0" style="min-height: 90vh;">
  <div class="max-w-lg mx-auto">
    <!-- Message sending form -->
    <form id="messageForm" class="mb-8" on:submit={handleFormSubmission}>
      <div class="mb-6">
        <p class="block text-lg text-gray-700 mb-2">
          Recipient: @{recipientSlug}
        </p>
      </div>
      <div class="mb-6">
        <div class="relative">
          <textarea
            id="messageContent"
            name="messageContent"
            rows="6"
            class="form-textarea mt-1 block w-full border rounded-lg px-4 py-3"
            placeholder="Write your message here..."
            value={randomMessage}
          ></textarea>
          <button
            type="button"
            class="absolute top-0 right-0 mt-2 mr-2 bg-white text-white font-bold py-2 px-4 rounded-lg"
            on:click={fetchRandomMessage}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M31.9999 49.0702C41.4274 49.0702 49.0699 41.4277 49.0699 32.0002C49.0699 22.5727 41.4274 14.9302 31.9999 14.9302C22.5724 14.9302 14.9299 22.5727 14.9299 32.0002C14.9299 41.4277 22.5724 49.0702 31.9999 49.0702Z"
                fill="#78B9EB"
              />
              <path
                d="M48.89 42.0001C48.7748 41.8752 48.6354 41.7752 48.4802 41.7061C48.3251 41.637 48.1575 41.6002 47.9876 41.598C47.8178 41.5958 47.6493 41.6283 47.4924 41.6934C47.3355 41.7585 47.1936 41.8548 47.0752 41.9766C46.9568 42.0984 46.8645 42.2431 46.8038 42.4017C46.7432 42.5604 46.7156 42.7297 46.7226 42.8994C46.7296 43.0691 46.7711 43.2356 46.8446 43.3888C46.9181 43.5419 47.022 43.6784 47.15 43.7901L52.37 48.8601C41.6 47.8701 33.22 40.7101 33.22 32.0001C33.22 23.2901 41.85 16.0001 52.85 15.1501L48.19 21.0001C47.9845 21.2579 47.8891 21.5864 47.9247 21.9142C47.9603 22.2419 48.1239 22.5424 48.38 22.7501C48.5998 22.9308 48.8754 23.0298 49.16 23.0301C49.3516 23.0336 49.5414 22.993 49.7148 22.9115C49.8881 22.8301 50.0405 22.7098 50.16 22.5601L56.42 14.7301C56.5369 14.585 56.6199 14.4156 56.6629 14.2343C56.7058 14.053 56.7078 13.8643 56.6684 13.6822C56.6291 13.5001 56.5496 13.329 56.4357 13.1816C56.3218 13.0341 56.1763 12.914 56.01 12.8301L46.13 7.83005C45.9796 7.75586 45.8161 7.712 45.6488 7.701C45.4815 7.68999 45.3137 7.71204 45.1549 7.7659C44.9961 7.81976 44.8495 7.90437 44.7234 8.01489C44.5973 8.12541 44.4942 8.25969 44.42 8.41005C44.2702 8.71373 44.2471 9.06449 44.3558 9.38518C44.4646 9.70586 44.6963 9.97021 45 10.1201L50.59 12.9301C41.86 14.2001 34.74 19.2501 31.98 25.9301C28.75 18.1801 19.69 12.6101 9 12.6101C8.66848 12.6101 8.35054 12.7418 8.11612 12.9762C7.8817 13.2106 7.75 13.5285 7.75 13.8601C7.75 14.1916 7.8817 14.5095 8.11612 14.7439C8.35054 14.9784 8.66848 15.1101 9 15.1101C21 15.1101 30.69 22.7101 30.69 32.0401C30.69 41.3701 21 49.0001 9 49.0001C8.66848 49.0001 8.35054 49.1317 8.11612 49.3662C7.8817 49.6006 7.75 49.9185 7.75 50.2501C7.75 50.5816 7.8817 50.8995 8.11612 51.1339C8.35054 51.3684 8.66848 51.5001 9 51.5001C19.69 51.4701 28.75 45.9001 32 38.2001C34.84 45.0101 42.25 50.2001 51.3 51.2001L45.7 54.8301C45.4739 54.9761 45.301 55.1912 45.207 55.4433C45.1129 55.6955 45.1028 55.9713 45.1781 56.2297C45.2533 56.4881 45.41 56.7153 45.6248 56.8775C45.8395 57.0397 46.1009 57.1283 46.37 57.1301C46.5876 57.1411 46.8045 57.0963 47 57.0001L56.07 51.1401C56.2283 51.0382 56.3611 50.9014 56.4582 50.7402C56.5552 50.5789 56.614 50.3976 56.63 50.2101C56.6459 50.0264 56.6209 49.8415 56.557 49.6686C56.493 49.4957 56.3916 49.3391 56.26 49.2101L48.89 42.0001Z"
                fill="#006DF0"
              />
            </svg>
          </button>
        </div>
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >Send Message</button
      >
    </form>
    <!-- Alert box for successful message send -->
    {#if alertMessage}
      <div
        class="bg-green-200 border border-green-600 text-green-900 px-4 py-3 rounded-lg mb-4"
      >
        {alertMessage}
      </div>
    {/if}
  </div>
</main>
<svelte:head>
  <title>Send Message to {recipientSlug}</title>
  <meta property="og:title" content="Send Message to {recipientSlug}" />

  <meta
    property="og:image"
    content={`https://api.multiavatar.com/${recipientSlug}.png`}
  />
  <meta property="og:description" content="Send Anonymous message through WAVE" />
</svelte:head>
