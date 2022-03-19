import { OnDestroy, ɵmarkDirty as markDirty } from '@angular/core';
import { from, Observable, ReplaySubject, Subject } from 'rxjs';
import { mergeMap, tap, switchMap, startWith, filter } from 'rxjs/operators';
import { untilDestroyed } from '@ngneat/until-destroy';

type ObservableDictionary<T> = {
    [P in keyof T]: Observable<T[P]>;
};

type SubjectDictionary<T> = {
    [P in keyof T]: Subject<T[P]>;
};

type LoadingDictionary<T> = {
    [P in keyof T]: boolean;
};

type Impossible<K extends keyof any> = {
    [P in K]?: never;
};

interface ConnectStateUtility<T = {}> {
    $: SubjectDictionary<T>,
    loading: LoadingDictionary<T>,
    reload: (keyToReload?: keyof T) => void,
};

/**
 * Create a dynamic state sink based on an observable-based definition
 *
 * @param component component instance, most likely just "this"
 * @param sources object with observable values - make sure to avoid special key values "$", "reload" and "loading"
 */
export function connectState<C extends OnDestroy, T>(
    component: C,
    sources: ObservableDictionary<T & Impossible<keyof ConnectStateUtility>>,
) {
    const sourceKeys = Object.keys(sources) as (keyof T)[];
    const reload$ = new Subject<keyof T | null>();
    const sink: T & ConnectStateUtility<T> = {
        ...{} as T,
        $: {} as SubjectDictionary<T>,
        loading: {} as LoadingDictionary<T>,
        reload: (keyToReload?: keyof T) => reload$.next(keyToReload),
    };

    const reload = (singleKey?: keyof T) => {
        for (const key of (singleKey ? [ singleKey ] : sourceKeys)) {
            sink.$[key] = new ReplaySubject<any>(1);
            sink.loading[key] = true;
            delete sink[key];
        }
    }
    const updateSink$ = from(sourceKeys).pipe(
        mergeMap((sourceKey: keyof T) => {
            const source$ = sources[sourceKey];

            return reload$.pipe(
                filter(keyToLoad => keyToLoad === sourceKey),
                tap(() => reload(sourceKey)),
                startWith(null),
                switchMap(() => source$),
            ).pipe(
                tap((sinkValue: any) => {
                    sink.loading[sourceKey] = false;
                    sink.$[sourceKey].next(sinkValue);
                    sink[sourceKey] = sinkValue;
                }),
            );
        }),
    );
    reload$.pipe(
        filter(keyToReload => !keyToReload),
        startWith(null),
        switchMap(() => {
            reload();
            return updateSink$;
        }),
        untilDestroyed(component),
    ).subscribe(() => {
        if ((component as any).__ngContext__) {
            markDirty(component);
        }
    });

    return sink;
}
