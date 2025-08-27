<script setup lang="ts">
import { useNavigationStore, useMonitorsStore, useUIStore, useChatStore } from '@/stores';

export const useStores = () => {\
  const navigation = useNavigationStore();
  const monitors = useMonitorsStore();
  const ui = useUIStore();
  const chat = useChatStore();

  return {
    navigation,
    monitors,
    ui,
    chat
  };
}

// Individual store composables for convenience
export const useNavigation = () => useNavigationStore();
export const useMonitors = () => useMonitorsStore();
export const useUI = () => useUIStore();
export const useChat = () => useChatStore();
</script>
