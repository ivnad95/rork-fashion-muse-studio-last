import { useRef, useCallback } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export function useScrollNavbar() {
  const lastScrollY = useRef(0);
  const scrollThreshold = 5; // Minimum scroll distance to trigger hide/show

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Placeholder: no-op for custom tab bar visibility (can be wired later)
      if (Math.abs(scrollDelta) > scrollThreshold) {
        // optionally handle UI as needed
      }

      lastScrollY.current = currentScrollY;
    },
    []
  );

  return { handleScroll };
}
