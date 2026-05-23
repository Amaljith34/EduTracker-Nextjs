'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';

export interface RowAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface RowActionsMenuProps {
  actions: RowAction[];
  /** Unique id for aria (e.g. row id) */
  menuId?: string;
}

const MENU_WIDTH = 168;
const ITEM_HEIGHT = 40;

export function RowActionsMenu({ actions, menuId = 'row-menu' }: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const menuHeight = actions.length * ITEM_HEIGHT + 8;
    const gap = 6;

    let top = rect.bottom + gap;
    let left = rect.right - MENU_WIDTH;

    if (top + menuHeight > window.innerHeight - 12) {
      top = Math.max(12, rect.top - menuHeight - gap);
    }
    left = Math.max(12, Math.min(left, window.innerWidth - MENU_WIDTH - 12));

    setPosition({ top, left });
  }, [actions.length]);

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    const timer = window.setTimeout(() => {
      document.addEventListener('pointerdown', onPointerDown);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const toggleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const visibleActions = actions.filter((a) => !a.disabled);

  const dropdown =
    open && mounted
      ? createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label="Row actions"
            className="fixed z-[9999] overflow-hidden rounded-lg border border-slate-600 bg-slate-900 py-1 shadow-2xl"
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
          >
            {visibleActions.length === 0 ? (
              <p className="px-4 py-2 text-sm text-slate-500">No actions</p>
            ) : (
              visibleActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  role="menuitem"
                  className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors ${
                    action.variant === 'danger'
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-slate-100 hover:bg-slate-800'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                    action.onClick();
                  }}
                >
                  {action.label}
                </button>
              ))
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="flex items-center justify-end">
        <button
          ref={buttonRef}
          type="button"
          aria-label="Open actions menu"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={toggleOpen}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
          </svg>
        </button>
      </div>
      {dropdown}
    </>
  );
}
