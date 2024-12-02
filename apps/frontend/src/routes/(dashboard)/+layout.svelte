<script lang="ts">
    import { goto } from "$app/navigation";
  import Cookies from "js-cookie";
    let { children } = $props();

    $effect(() => {
        if (!Cookies.get("token")) {
          goto("/auth/login");
        }
    });

</script>
{@render children()}
  <!-- <slot />/ -->