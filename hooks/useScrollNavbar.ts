import { useRef, useCallback } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useNavbar } from '@/components/CustomTabBar';

export function useScrollNavbar() {
  const { hideNavbar, showNavbar } = useNavbar();
  const lastScrollY = useRef(0);
  const scrollThreshold = 5; // Minimum scroll distance to trigger hide/show

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Only trigger if scrolled more than threshold
      if (Math.abs(scrollDelta) > scrollThreshold) {
        if (scrollDelta > 0 && currentScrollY > 100) {
          // Scrolling down and past top
          hideNavbar();
        } else if (scrollDelta < 0) {
          // Scrolling up
          showNavbar();
        }
      }

      lastScrollY.current = currentScrollY;
    },
    [hideNavbar, showNavbar]
  );

  return { handleScroll };
}
