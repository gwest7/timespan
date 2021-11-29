# timespan

Describes the amount of time between two dates, but with optional RxJs.

`npm install @binaryme/timespan`

Most basic useage:
```js
describeTimespan(65000); // 6 minuntes and 5 seconds
// returns "1 min ago"
describeTimespan(-5000); // 5 seconds
// returns "in 5 secs"
```

## Demonstrations of Observable

[Angular demo](https://stackblitz.com/edit/angular-ivy-2kpdv1)

The biggest point this library tries to prove is the ease of use with a basic Angular pipe combined with Angular's ingenius `async` pipe.

The link above demonstrates that with
```js
@Pipe({name: 'obsTimespan'})
export class ObserveTimespanPipe implements PipeTransform {
  transform(epoch: number): Observable<string> {
    return observeTimespan(epoch, 9);
  }
}
```
and a set of data with time stamps
```ts
list: { name: string, epochTime: number }[];
```
you'd be able to observe the timespan description updates real time
```html
<div *ngFor="let item of list">
  {{ item.name }}
  {{ item.epochTime | obsTimespan | async }}
</div>
```

**The same would be true for Svelte's `$` in-template subscription.**

### Other demos

[HTML + RxJs](https://stackblitz.com/edit/rxjs-seq25e?file=index.ts)

[React](https://stackblitz.com/edit/react-ts-3htxy1?file=index.tsx)

[Vue](https://stackblitz.com/edit/vue-rerpfd?file=src/App.vue)

## Documentation

```js
describeTimespan(
  msTo: number, // a  past of future date
  msFrom = Date.now(), // a comparison date date
  maxWordCount = 1, // the number of units to describe timespan, eg. 3 could result in `1 yr 1 mth 1 day ago`
  config: IConfig = DEFAULT, // see IConfig
): string;
```
Where `describeTimespan` takes `msTo` and `msFrom`, `observeTimespan` take only `msTo` assuming `msFrom` to be `Date.Now()` and returns an observable.

```js

interface IConfig {
  /**
   * A string containing a `[t]` token to descibe a future time. Default: "[t] ago"
   */
  describeFuture?: string;

  /**
   * A string containing a description for zero time difference. Default: "now"
   */
   describeZero: string;

  /**
   * A string containing a `[t]` token to descibe a past time. Default: "in [t]"
   */
  describePast?: string;

  /**
   * The units to use to break up the time desciption into words. This list needs to be ordered from largest unit to smallest unit. If a larger unit precedes a smaller unit then the large unit will be ignored. Here other units like a WEEK or DECADE can be added.
   * Default, if `D = 1000 * 60 * 60 * 24`: [
   *   { label: ' yr',  ms: D * 365.2422 }
   *   { label: ' mth', ms: D * 365.2422 / 12 }
   *   { label: ' day', ms: D }
   *   { label: ' hr',  ms: 1000 * 60 * 60 }
   *   { label: ' min', ms: 1000 * 60 }
   *   { label: ' sec', ms: 1000 }
   * ]
   */
  units: {
    /**
     * The time unit in milliseconds
     */
    ms: number,
    /**
     * A label to describe the time unit
     */
    label: string
  }[];

  /**
   * Option to add an `s` for english plural unit descriptions. Default: true
   */
  addPluralS?: boolean;

  /**
   * Allows a user to choose the separation between words eg. " | " will result in "1 yr | 1 mth". Default: " "
   */
  wordSeparator: string;
}

```