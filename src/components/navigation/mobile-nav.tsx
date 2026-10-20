"use client";

import Link from "next/link";
import { AnimatePresence, useIsPresent, useReducedMotion, type Variants } from "motion/react";
import * as m from "motion/react-m";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { BrandMark } from "@/components/layout/brand-mark";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  CloseIcon,
  MenuIcon,
  PlusIcon,
} from "@/components/ui/icons";
import {
  hasMenu,
  isActivePath,
  isActiveSection,
  primaryNavigation,
  type NavItem,
} from "@/config/navigation";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { EASE_CINEMATIC } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DIALOG_ID = "mobile-menu";
const DESKTOP_QUERY = "(min-width: 80rem)";
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const defaultItems: readonly NavItem[] = primaryNavigation;

const subscribeNothing = () => () => {};

const list: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_CINEMATIC } },
};

type MobileNavProps = {
  pathname: string;
  /** The navigation with CMS overrides applied; defaults to the approved navigation. */
  items?: readonly NavItem[];
};

/**
 * Full-screen navigation below the desktop breakpoint. A modal dialog: focus is
 * trapped, the rest of the page is inert and does not scroll, Escape closes,
 * and focus returns to the Menu button.
 */
export function MobileNav({ pathname, items = defaultItems }: MobileNavProps) {
  const reduced = useReducedMotion() ?? false;
  const isClient = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  const [lastPathname, setLastPathname] = useState(pathname);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef(false);
  const pendingFocus = useRef<string | null>(null);

  useBodyScrollLock(open);

  // Close after navigating (adjusting state during render, not in an effect).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const close = useCallback((returnFocus: boolean) => {
    restoreFocus.current = returnFocus;
    setOpen(false);
  }, []);

  const openDialog = () => {
    setCategoryId(null);
    pendingFocus.current = "[data-dialog-close]";
    setOpen(true);
  };

  const showCategory = (id: string) => {
    setCategoryId(id);
    setExpanded(new Set([`${id}:0`]));
    pendingFocus.current = "[data-dialog-back]";
  };

  const showRoot = () => {
    pendingFocus.current = `[data-category-trigger="${categoryId}"]`;
    setCategoryId(null);
  };

  const toggleGroup = (key: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // While open: make the rest of the page inert, trap Tab, close on Escape,
  // and close if the viewport grows to the desktop layout.
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const menuButton = menuButtonRef.current;
    const background = Array.from(document.body.children).filter(
      (element) => element !== dialog && !element.hasAttribute("inert"),
    );
    background.forEach((element) => element.setAttribute("inert", ""));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => !element.closest("[inert], [hidden]"),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) close(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      background.forEach((element) => element.removeAttribute("inert"));
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
      if (restoreFocus.current) {
        restoreFocus.current = false;
        menuButton?.focus();
      }
    };
  }, [open, close]);

  // Move focus after opening and after switching between the root and a category.
  useEffect(() => {
    const selector = pendingFocus.current;
    if (!open || !selector) return;
    pendingFocus.current = null;
    dialogRef.current?.querySelector<HTMLElement>(selector)?.focus();
  }, [open, categoryId]);

  const category = items.find((item) => item.id === categoryId);

  const dialog = (
    <AnimatePresence>
      {open ? (
        <m.div
          ref={dialogRef}
          key="dialog"
          id={DIALOG_ID}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          data-surface="dark"
          className="fixed inset-0 z-60 flex flex-col bg-background text-foreground xl:hidden"
          initial={reduced ? { opacity: 0 } : { clipPath: "circle(0% at 92% 2.5rem)" }}
          animate={reduced ? { opacity: 1 } : { clipPath: "circle(150% at 92% 2.5rem)" }}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.15 } }
              : { clipPath: "circle(0% at 92% 2.5rem)", transition: { duration: 0.45 } }
          }
          transition={{ duration: reduced ? 0.15 : 0.7, ease: EASE_CINEMATIC }}
        >
          <div className="flex h-header shrink-0 items-center justify-between border-b border-border px-6 md:px-10">
            <BrandMark size={44} onNavigate={() => close(false)} />
            <button
              type="button"
              data-dialog-close
              onClick={() => close(true)}
              className="inline-flex size-12 items-center justify-center rounded-full border border-border transition-colors hover:bg-foreground/10"
            >
              <CloseIcon className="size-6" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <div className="relative grid flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
            <AnimatePresence initial={false}>
              {category && hasMenu(category) ? (
                <MenuView key={`category-${category.id}`} direction="forward" reduced={reduced}>
                  <button
                    type="button"
                    data-dialog-back
                    onClick={showRoot}
                    className="-ml-2 inline-flex min-h-12 items-center gap-3 rounded-sm px-2 text-sm font-medium tracking-[0.12em] text-muted-foreground uppercase hover:text-foreground"
                  >
                    <ArrowLeftIcon className="size-5" />
                    Back <span className="sr-only">to main menu</span>
                  </button>
                  <h2 className="mt-6 font-display text-4xl">{category.label}</h2>
                  <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
                    {category.summary}
                  </p>
                  <Link
                    href={category.href}
                    onClick={() => close(false)}
                    className="mt-6 inline-flex min-h-12 items-center gap-2 font-medium text-primary"
                  >
                    Explore {category.label}
                    <ArrowRightIcon className="size-5" />
                  </Link>

                  <div className="mt-8 border-b border-border">
                    {category.groups.map((group, index) => {
                      const key = `${category.id}:${index}`;
                      const isOpen = expanded.has(key);
                      const regionId = `${DIALOG_ID}-${category.id}-${index}`;
                      return (
                        <div key={key} className="border-t border-border">
                          <h3>
                            <button
                              type="button"
                              id={`${regionId}-button`}
                              aria-expanded={isOpen}
                              aria-controls={isOpen ? regionId : undefined}
                              onClick={() => toggleGroup(key)}
                              className="flex min-h-16 w-full items-center justify-between gap-4 text-left text-xl font-medium"
                            >
                              {group.heading}
                              <PlusIcon
                                className={cn(
                                  "size-6 shrink-0 transition-transform duration-(--motion-duration-base) ease-cinematic",
                                  isOpen && "rotate-45",
                                )}
                              />
                            </button>
                          </h3>
                          <AnimatePresence initial={false}>
                            {isOpen ? (
                              <m.div
                                key="region"
                                id={regionId}
                                role="region"
                                aria-labelledby={`${regionId}-button`}
                                className="overflow-hidden"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: reduced ? 0 : 0.4, ease: EASE_CINEMATIC }}
                              >
                                <ul className="space-y-1 pb-6">
                                  {group.links.map((link) => (
                                    <li key={link.href}>
                                      <Link
                                        href={link.href}
                                        onClick={() => close(false)}
                                        aria-current={
                                          isActivePath(link, pathname) ? "page" : undefined
                                        }
                                        className="block rounded-sm py-3"
                                      >
                                        <span className="text-lg">{link.label}</span>
                                        {link.description ? (
                                          <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                                            {link.description}
                                          </span>
                                        ) : null}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </m.div>
                            ) : null}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </MenuView>
              ) : (
                <MenuView key="root" direction="back" reduced={reduced}>
                  <nav aria-label="Primary">
                    <m.ul variants={list} initial="hidden" animate="visible">
                      {items.map((item) => {
                        const active = isActiveSection(item, pathname);
                        const itemClass =
                          "flex min-h-16 w-full items-center justify-between gap-4 border-b border-border py-3 text-left font-display text-3xl sm:text-4xl";
                        return (
                          <m.li key={item.id} variants={rise}>
                            {hasMenu(item) ? (
                              <button
                                type="button"
                                data-category-trigger={item.id}
                                aria-label={`${item.label}, open section`}
                                onClick={() => showCategory(item.id)}
                                className={itemClass}
                              >
                                <span className={cn(active && "text-primary")}>{item.label}</span>
                                <ChevronRightIcon className="size-6 shrink-0 text-muted-foreground" />
                              </button>
                            ) : (
                              <Link
                                href={item.href}
                                onClick={() => close(false)}
                                aria-current={active ? "page" : undefined}
                                className={cn(itemClass, active && "text-primary")}
                              >
                                {item.label}
                              </Link>
                            )}
                          </m.li>
                        );
                      })}
                    </m.ul>
                  </nav>
                </MenuView>
              )}
            </AnimatePresence>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={menuButtonRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? DIALOG_ID : undefined}
        aria-haspopup="dialog"
        onClick={openDialog}
        className="-mr-2 inline-flex min-h-12 items-center gap-3 rounded-sm px-2 text-sm font-medium tracking-[0.12em] uppercase xl:hidden"
      >
        Menu
        <MenuIcon className="size-6" />
      </button>
      {isClient ? createPortal(dialog, document.body) : null}
    </>
  );
}

type MenuViewProps = {
  children: ReactNode;
  direction: "forward" | "back";
  reduced: boolean;
};

/** One level of the mobile menu. Exiting views are inert so they cannot take focus. */
function MenuView({ children, direction, reduced }: MenuViewProps) {
  const isPresent = useIsPresent();
  const offset = direction === "forward" ? 48 : -48;

  return (
    <m.div
      inert={!isPresent}
      className="col-start-1 row-start-1 px-6 py-8 md:px-10"
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: offset }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: -offset }}
      transition={{ duration: reduced ? 0.12 : 0.45, ease: EASE_CINEMATIC }}
    >
      {children}
    </m.div>
  );
}
