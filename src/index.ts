
import { Observable, of, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';

const SEC = 1000;
const MIN = SEC * 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const MONTH = DAY * 30;
const YEAR = MONTH * 12;

/**
 * Settings that determind how a time span will be described.
 */
export interface IConfig {
  /**
   * A string containing a `[t]` token to descibe a future time
   */
  describeFuture: string;

  /**
   * A string containing a `[t]` token to descibe a past time
   */
  describePast: string;

  /**
   * The units to use to break up the time desciption into words.
   * Here here a WEEK or DECADE can be added
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
   * Option to add an `s` for english plural unit descriptions
   */
  addPluralS: boolean;

  /**
   * Allows a user to choose the separation between words eg. " | " will result in "1 yr | 1 mth"
   */
  wordSeparator: string;
}

export const DEFAULT:IConfig = {
  describeFuture: 'in [t]',
  describePast: '[t] ago',
  units: [
    { ms: YEAR, label: ' yr' },
    { ms: MONTH, label: ' mth' },
    { ms: DAY, label: ' day' },
    { ms: HOUR, label: ' hr' },
    { ms: MIN, label: ' min' },
    { ms: SEC, label: ' sec' },
  ],
  addPluralS: true,
  wordSeparator: ' ',
}

/**
 * 
 * @param ms Time difference (future = negative, past = positive)
 * @param maxWordCount Max number of words to describe the time
 * @param config See `IConfig`
 * @returns 
 */
function describe(ms:number, maxWordCount = 1, config:IConfig = DEFAULT):{description:string,msDurationValid:number} {
  let t = Math.abs(ms) + 99; // add time to allow for computational delay
  let msDurationValid = SEC;
  let words = [] as string[];
  for (let i = 0; i < config.units.length; i++) {
    const unit = config.units[i];
    if (t >= unit.ms || words.length) {
      const f = (words.length + 1 >= maxWordCount) ? Math.round : Math.floor; // rounding the final unit improves UX
      let val = f(t / unit.ms);
      let out = `${val}${unit.label}${config.addPluralS && val!==1 ? 's' : ''}`;
      words.push(out);
      if (words.length >= maxWordCount) {
        const rem = ms % unit.ms;
        msDurationValid = (ms < 0 ? -rem : (unit.ms - rem)) || unit.ms;
        break;
      }
      t = t % unit.ms;
    }
  }
  const temp = ms < 0 ? config.describeFuture : config.describePast;
  let description = temp.replace('[t]', words.join(config.wordSeparator));
  if (!words.length || Math.round(ms * 0.001) === 0) description = 'now';
  return {
    description,
    msDurationValid,
  };
}

export function describeTimespan(msTo:number, msFrom = Date.now(), maxWordCount = 1, config:IConfig = DEFAULT) {
  let ms = msFrom - msTo; // future = negative, past = positive
  return describe(ms, maxWordCount, config).description;
}

/**
 * Observe time span label
 * @param msTime Millisecond epoch
 * @returns Observable of time span label
 */
export function observeTimespan(msTime:number, maxWordCount = 1, config:IConfig = DEFAULT) {
  return new Observable<string>(subscriber => {
    let timer:any;
    const evaluate = (msTo:number) => {
      const desc = describe(Date.now() - msTo, maxWordCount, config);
      const timeout = desc.msDurationValid;
      if (0 < timeout && timeout < Number.MAX_SAFE_INTEGER) {
        timer = setTimeout(() => evaluate(msTo), timeout);
        subscriber.next(desc.description);
      } else {
        subscriber.next(desc.description);
        subscriber.error(`Timespan observer reevaluation time is out of bounds. Milliseconds: ${timeout}`);
      }
    }
    evaluate(msTime);
    return () => {
      clearTimeout(timer);
    }
  });
}
