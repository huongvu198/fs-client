// redux/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, ApiDispatch } from '../redux/index';

// Use these typed hooks instead of plain useDispatch and useSelector
export const useRedux = () => useDispatch<ApiDispatch>();
export const useReduxSelector: TypedUseSelectorHook<RootState> = useSelector;