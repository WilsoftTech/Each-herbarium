"use client";

import Link from "next/link";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import {
  hasMenu,
  isActiveSection,
  megaMenuPanelId,
  primaryNavigation,
  type NavItem,
} from "@/config/navigation";
import { EASE_CINEMATIC } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { MegaMenuPanel } from "./mega-menu-panel";

type OpenSource = "hover" | "click" | "keyboard";
type OpenState = {
  id: string;
  source: OpenSource;
  mode: "reveal" | "crossfade";
} | null;

const HOVER_OPEN_DELAY = 90;
const HOVER_CLOSE_DELAY = 240;
const items: readonly NavItem[] = primaryNavigation;

type DesktopNavProps = {
  pathname: string;
  /** Reports whether a mega menu is open, so the header can switch to its solid style. */
  onOpenChange: (open: boolean) => void;
};

/**
 * Desktop primary navigation with mega menus (disclosure pattern).
 *
 * - Hover (mouse only) opens after a short intent delay and closes on leave.
 * - Click or Enter/Space toggles; a click on a hover-opened menu pins it open.
 * - Left/Right/Home/End move between top-level items; Down opens and enters a menu.
 * - Escape closes and returns focus to the trigger; so does tabbing out of the nav.
 */
export function DesktopNav({ pathname, onOpenChange }: DesktopNavProps) {
  const reduced = useReducedMotion() ?? false;
  const [open, setOpenState] = useState<OpenState>(null);
  const [panelHeight, setPanelHeight] = useState(0);
  const [lastPathname, setLastPathname] = useState(pathname);

  const openRef = useRef<OpenState>(null);
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const controls = useRef(new Map<string, HTMLElement>());
  const timer = useRef<number | undefined>(undefined);
  const focusFirstLink = useRef(false);

  const setOpen = useCallback(
    (next: OpenState) => {
      openRef.current = next;
      setOpenState(next);
      onOpenChange(next !== null);
    },
    [onOpenChange],
  );

  const clearTimer = () => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
  };

  const openMenu = useCallback(
    (id: string, source: OpenSource) => {
      const current = openRef.current;
      setOpen({ id, source, mode: current ? "crossfade" : "reveal" });
    },
    [setOpen],
  );

  const close = useCallback(
    (returnFocus = false) => {
      clearTimer();
      const current = openRef.current;
      setOpen(null);
      if (returnFocus && current) controls.current.get(current.id)?.focus();
    },
    [setOpen],
  );

  // Close when the route changes (adjusting state during render, not in an effect).
  // The header resets its own copy of the open flag per pathname.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpenState(null);
  }
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Outside pointer presses and Escape close the open menu.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close(navRef.current?.contains(document.activeElement) ?? false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  // After a keyboard open (ArrowDown), move focus to the first link in the panel.
  useEffect(() => {
    if (!open || !focusFirstLink.current) return;
    focusFirstLink.current = false;
    document.getElementById(megaMenuPanelId(open))?.querySelector<HTMLElement>("a[href]")?.focus();
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Sliding indicator under the open item, or under the current section.
  const activeId = items.find((item) => isActiveSection(item, pathname))?.id;
  const indicatorTarget = open?.id ?? activeId;
  useLayoutEffect(() => {
    const list = listRef.current;
    const bar = indicatorRef.current;
    if (!list || !bar) return;
    const place = () => {
      const control = indicatorTarget ? controls.current.get(indicatorTarget) : undefined;
      const label = control?.querySelector("[data-nav-label]");
      if (!label) {
        bar.style.opacity = "0";
        return;
      }
      const listBox = list.getBoundingClientRect();
      const box = label.getBoundingClientRect();
      bar.style.opacity = "1";
      bar.style.transform = `translateX(${box.left - listBox.left}px) scaleX(${box.width})`;
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [indicatorTarget]);

  const onHeightChange = useCallback((itemId: string, height: number) => {
    if (openRef.current?.id === itemId) setPanelHeight(height);
  }, []);

  const register = (id: string) => (element: HTMLElement | null) => {
    if (element) controls.current.set(id, element);
    else controls.current.delete(id);
  };

  const focusControl = (index: number) => {
    const item = items[(index + items.length) % items.length];
    if (item) controls.current.get(item.id)?.focus();
  };

  const onTriggerPointerEnter = (id: string) => (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearTimer();
    const current = openRef.current;
    if (current?.id === id) return;
    if (current) {
      // Moving between open menus switches immediately. The new menu counts as
      // hover-opened, so a click on its trigger pins it rather than closing it.
      openMenu(id, "hover");
      return;
    }
    timer.current = window.setTimeout(() => openMenu(id, "hover"), HOVER_OPEN_DELAY);
  };

  const onTriggerClick = (id: string) => (event: MouseEvent) => {
    clearTimer();
    const current = openRef.current;
    const fromKeyboard = event.detail === 0;
    if (current?.id !== id) openMenu(id, fromKeyboard ? "keyboard" : "click");
    else if (current.source === "hover" && !fromKeyboard) setOpen({ ...current, source: "click" });
    else close();
  };

  const onNavPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && openRef.current) clearTimer();
  };

  const onNavPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearTimer();
    if (openRef.current?.source === "hover") {
      timer.current = window.setTimeout(() => close(), HOVER_CLOSE_DELAY);
    }
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const id = (event.target as HTMLElement).dataset.navId;
    if (!id) return; // Keys inside an open panel are handled by the panel.
    const index = items.findIndex((item) => item.id === id);
    const item = items[index];
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusControl(index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusControl(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusControl(0);
        break;
      case "End":
        event.preventDefault();
        focusControl(items.length - 1);
        break;
      case "ArrowDown":
        if (!item || !hasMenu(item)) return;
        event.preventDefault();
        if (openRef.current?.id === id) {
          document
            .getElementById(megaMenuPanelId(item))
            ?.querySelector<HTMLElement>("a[href]")
            ?.focus();
        } else {
          focusFirstLink.current = true;
          openMenu(id, "keyboard");
        }
        break;
    }
  };

  // Keyboard focus landing on another top-level item closes the open menu.
  const onControlFocus = (id: string) => (event: FocusEvent<HTMLElement>) => {
    const current = openRef.current;
    if (current && current.id !== id && event.currentTarget.matches(":focus-visible")) close();
  };

  // Tabbing out of the navigation closes the open menu.
  const onNavBlur = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget as Node | null;
    if (openRef.current && next && !navRef.current?.contains(next)) close();
  };

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className="hidden h-full xl:block"
      onPointerEnter={onNavPointerEnter}
      onPointerLeave={onNavPointerLeave}
      onBlur={onNavBlur}
    >
      <ul ref={listRef} className="relative flex h-full items-stretch" onKeyDown={onListKeyDown}>
        {items.map((item) => {
          const active = isActiveSection(item, pathname);
          const controlClass = cn(
            "group/control relative inline-flex h-full items-center gap-1.5 px-3 text-sm font-medium tracking-wide transition-opacity duration-(--motion-duration-fast) 2xl:px-4",
            "opacity-90 hover:opacity-100 aria-expanded:opacity-100",
          );

          if (!hasMenu(item)) {
            return (
              <li key={item.id} className="flex">
                <Link
                  ref={register(item.id)}
                  href={item.href}
                  data-nav-id={item.id}
                  aria-current={active ? "page" : undefined}
                  onFocus={onControlFocus(item.id)}
                  className={controlClass}
                >
                  <span data-nav-label>{item.label}</span>
                </Link>
              </li>
            );
          }

          const expanded = open?.id === item.id;
          return (
            <li key={item.id} className="flex">
              <button
                ref={register(item.id)}
                type="button"
                data-nav-id={item.id}
                aria-expanded={expanded}
                aria-controls={expanded ? megaMenuPanelId(item) : undefined}
                onClick={onTriggerClick(item.id)}
                onPointerEnter={onTriggerPointerEnter(item.id)}
                onFocus={onControlFocus(item.id)}
                className={controlClass}
              >
                <span data-nav-label>
                  {item.label}
                  {active ? " " : null}
                  {active ? <span className="sr-only">(current section)</span> : null}
                </span>
                <ChevronDownIcon
                  className={cn(
                    "size-3.5 transition-transform duration-(--motion-duration-base) ease-cinematic",
                    expanded && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence>
                {expanded ? (
                  <MegaMenuPanel
                    key={item.id}
                    item={item}
                    pathname={pathname}
                    mode={open.mode}
                    reduced={reduced}
                    onNavigate={() => close()}
                    onHeightChange={onHeightChange}
                  />
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
        <span
          ref={indicatorRef}
          aria-hidden="true"
          data-nav-indicator
          className="pointer-events-none absolute bottom-5 left-0 h-0.5 w-px origin-left bg-current opacity-0 transition-[transform,opacity] duration-(--motion-duration-slow) ease-cinematic"
        />
      </ul>

      <AnimatePresence>
        {open ? (
          <m.div
            key="sheet"
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-header -z-10 overflow-hidden border-b border-border bg-background shadow-2xl shadow-black/10"
            initial={{ height: 0 }}
            animate={{ height: panelHeight }}
            exit={{ height: 0 }}
            transition={{ duration: reduced ? 0 : 0.5, ease: EASE_CINEMATIC }}
          />
        ) : null}
        {open ? (
          <m.div
            key="scrim"
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-header bottom-0 -z-20 bg-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.1 : 0.4, ease: EASE_CINEMATIC }}
          />
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
