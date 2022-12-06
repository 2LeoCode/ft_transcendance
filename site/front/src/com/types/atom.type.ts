import { WritableAtom } from "jotai";
import { SetStateAction } from "react";

export type Atom<T> = WritableAtom<T, SetStateAction<T>, void>;
